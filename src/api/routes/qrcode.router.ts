import { RouterBroker } from '@api/abstract/abstract.router';
import { ConfigService } from '@config/env.config';
import { Logger } from '@config/logger.config';
import crypto from 'crypto';
import { Router } from 'express';

const logger = new Logger('QRCODE');

interface SessionToken {
  token: string;
  expiresAt: number;
}

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

// Store tokens in memory (should be in Redis in production)
const sessionTokens = new Map<string, SessionToken>();

// Rate limiting: max 7 attempts per hour per IP
const RATE_LIMIT_MAX_ATTEMPTS = 7;
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup rate limit entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

// Cleanup expired tokens every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [token, session] of sessionTokens.entries()) {
      if (session.expiresAt < now) {
        sessionTokens.delete(token);
      }
    }
  },
  5 * 60 * 1000,
);

export class QrCodeRouter extends RouterBroker {
  public readonly router: Router = Router();

  constructor(readonly configService: ConfigService) {
    super();
    this.createRoutes();
  }

  // Helper function to get client IP
  private getClientIP(req: any): string {
    return (
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
      'unknown'
    );
  }

  // Rate limiting middleware
  private checkRateLimit(ip: string, endpoint: string): { allowed: boolean; resetAt?: number } {
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry) {
      // First request
      rateLimitStore.set(key, {
        attempts: 1,
        resetAt: now + RATE_LIMIT_WINDOW_MS,
      });
      return { allowed: true };
    }

    // Check if window has reset
    if (entry.resetAt < now) {
      rateLimitStore.set(key, {
        attempts: 1,
        resetAt: now + RATE_LIMIT_WINDOW_MS,
      });
      return { allowed: true };
    }

    // Check if limit exceeded
    if (entry.attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
      return {
        allowed: false,
        resetAt: entry.resetAt,
      };
    }

    // Increment attempts
    entry.attempts++;
    rateLimitStore.set(key, entry);
    return { allowed: true };
  }

  private createRoutes() {
    this.router
      // GET /qrcode/api-key - Verificar se API key está configurada e retornar token temporário
      .get('/qrcode/api-key', async (req, res) => {
        try {
          // Rate limiting check
          const clientIP = this.getClientIP(req);
          const rateLimitResult = this.checkRateLimit(clientIP, 'api-key');

          if (!rateLimitResult.allowed) {
            const remainingMinutes = rateLimitResult.resetAt
              ? Math.ceil((rateLimitResult.resetAt - Date.now()) / 60000)
              : 60;
            return res.status(429).json({
              configured: false,
              error: 'Too many attempts',
              message: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX_ATTEMPTS} attempts per hour. Try again in ${remainingMinutes} minutes.`,
              retryAfter: Math.ceil((rateLimitResult.resetAt! - Date.now()) / 60000),
            });
          }

          const authConfig = this.configService.get('AUTHENTICATION');
          const apiKey = authConfig.API_KEY.KEY;

          if (!apiKey || apiKey === 'BQYHJGJHJ') {
            return res.status(200).json({
              configured: false,
              message: 'API key not configured on server',
            });
          }

          // Generate temporary session token
          const sessionToken = crypto.randomBytes(32).toString('hex');
          const expiresIn = 3600; // 1 hour
          const expiresAt = Date.now() + expiresIn * 1000;

          sessionTokens.set(sessionToken, { token: apiKey, expiresAt });

          logger.info('Session token generated for QR code scanner');

          return res.status(200).json({
            configured: true,
            sessionToken,
            expiresIn,
          });
        } catch (error) {
          logger.error(error);
          return res.status(500).json({
            status: 500,
            message: 'Internal server error',
          });
        }
      })

      // POST /qrcode/exchange-token - Trocar token temporário pela API key real
      .post('/qrcode/exchange-token', async (req, res) => {
        try {
          const { sessionToken } = req.body;

          if (!sessionToken) {
            return res.status(400).json({
              status: 400,
              message: 'Session token is required',
            });
          }

          const session = sessionTokens.get(sessionToken);

          if (!session) {
            return res.status(401).json({
              status: 401,
              message: 'Invalid or expired session token',
            });
          }

          if (session.expiresAt < Date.now()) {
            sessionTokens.delete(sessionToken);
            return res.status(401).json({
              status: 401,
              message: 'Session token expired',
            });
          }

          // Remove token after exchange (single use)
          sessionTokens.delete(sessionToken);

          logger.info('Session token exchanged for API key');

          return res.status(200).json({
            apiKey: session.token,
          });
        } catch (error) {
          logger.error(error);
          return res.status(500).json({
            status: 500,
            message: 'Internal server error',
          });
        }
      });
  }
}
