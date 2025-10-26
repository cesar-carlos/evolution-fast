import { Logger } from '@config/logger.config';
import { BaileysEventMap, MessageUpsertType, WAMessage } from 'baileys';
import { catchError, delay, EMPTY, from, mergeMap, retryWhen, Subject, Subscription, take, tap } from 'rxjs';

type MessageUpsertPayload = BaileysEventMap['messages.upsert'];
type MountProps = {
  onMessageReceive: (payload: MessageUpsertPayload, settings: any) => Promise<void>;
};

export class BaileysMessageProcessor {
  private processorLogs = new Logger('BaileysMessageProcessor');
  private subscription?: Subscription;

  protected messageSubject = new Subject<{
    messages: WAMessage[];
    type: MessageUpsertType;
    requestId?: string;
    settings: any;
  }>();

  mount({ onMessageReceive }: MountProps) {
    this.subscription = this.messageSubject
      .pipe(
        tap(({ messages }) => {
          const timestamp = new Date().toISOString();
          this.processorLogs.log(`[${timestamp}] Processing batch of ${messages.length} messages`);
        }),
        // Changed from concatMap to mergeMap with concurrency limit of 3
        // This allows processing up to 3 messages in parallel instead of sequentially
        mergeMap(
          ({ messages, type, requestId, settings }) => {
            const startTime = Date.now();
            return from(onMessageReceive({ messages, type, requestId }, settings)).pipe(
              tap(() => {
                const duration = Date.now() - startTime;
                this.processorLogs.log(`Batch processed in ${duration}ms`);
              }),
              retryWhen((errors) =>
                errors.pipe(
                  tap((error) => this.processorLogs.warn(`Retrying message batch due to error: ${error.message}`)),
                  delay(200), // Reduzido para 200ms de delay
                  take(3), // Máximo 3 tentativas
                ),
              ),
            );
          },
          3, // Process up to 3 messages concurrently
        ),
        catchError((error) => {
          this.processorLogs.error(`Error processing message batch: ${error}`);
          return EMPTY;
        }),
      )
      .subscribe({
        error: (error) => {
          this.processorLogs.error(`Message stream error: ${error}`);
        },
      });
  }

  processMessage(payload: MessageUpsertPayload, settings: any) {
    const { messages, type, requestId } = payload;
    const timestamp = new Date().toISOString();
    this.processorLogs.log(`[${timestamp}] Message added to queue: ${messages.length} message(s)`);
    this.messageSubject.next({ messages, type, requestId, settings });
  }

  onDestroy() {
    this.subscription?.unsubscribe();
    this.messageSubject.complete();
  }
}
