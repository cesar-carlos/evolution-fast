module.exports = {
  apps: [
    {
      name: 'evolution-api',
      script: './dist/main.js',
      interpreter: '/root/.nvm/versions/node/v20.10.0/bin/node',

      // ============================================
      // CONFIGURAÇÃO DE INSTÂNCIAS
      // ============================================
      // Apenas 1 instância (Evolution API não suporta múltiplas instâncias
      // devido a estado compartilhado e recursos exclusivos)
      instances: 1,
      exec_mode: 'fork',
      watch: false,

      // ============================================
      // GERENCIAMENTO DE MEMÓRIA
      // ============================================
      // Limite de memória: 3GB (aproveitando os 10GB disponíveis)
      // Permite mais instâncias WhatsApp e cache em memória
      max_memory_restart: '3000M',

      // ============================================
      // OTIMIZAÇÕES DO NODE.JS
      // ============================================
      node_args: [
        '--max-old-space-size=2560', // Heap máximo de 2.5GB (deixa 500MB para outros)
        '--gc-interval=100', // GC mais frequente para reduzir pausas longas
        '--expose-gc', // Permite chamadas manuais de GC se necessário
      ],

      // ============================================
      // VARIÁVEIS DE AMBIENTE
      // ============================================
      env: {
        NODE_ENV: 'production',
        // Otimizações de I/O - Thread pool maior para operações assíncronas
        // Útil para múltiplas conexões WhatsApp simultâneas
        UV_THREADPOOL_SIZE: '32', // Aumentado para melhor throughput de I/O
        // Otimizações de V8
        NODE_OPTIONS: '--max-old-space-size=2560 --expose-gc',
      },

      // ============================================
      // CONFIGURAÇÃO DE LOGS
      // ============================================
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true,
      merge_logs: true,

      // ============================================
      // CONFIGURAÇÕES DE RESTART
      // ============================================
      autorestart: true,
      max_restarts: 15, // Máximo de restarts antes de parar
      min_uptime: '30s', // Tempo mínimo de uptime para considerar estável
      restart_delay: 5000, // Delay entre restarts (ms)
      exp_backoff_restart_delay: 100, // Backoff exponencial

      // ============================================
      // TIMEOUTS E SHUTDOWN
      // ============================================
      kill_timeout: 10000, // Tempo para graceful shutdown (ms)
      wait_ready: true, // Aguarda sinal de ready
      listen_timeout: 15000, // Timeout para inicialização (ms)
      shutdown_with_message: true, // Shutdown graceful

      // ============================================
      // IDENTIFICAÇÃO DE INSTÂNCIA
      // ============================================
      instance_var: 'INSTANCE_ID', // Variável para identificar instância
    },
  ],
};
