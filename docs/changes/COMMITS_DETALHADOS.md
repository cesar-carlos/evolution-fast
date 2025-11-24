# 📝 Lista Detalhada de Commits

Lista completa de todos os commits implementados neste fork em relação ao repositório original.

**Base:** `origin/main` (Evolution API v2.3.6)  
**Total:** 21 commits

---

## 📋 Commits por Ordem Cronológica

### 1. `5434c816` - build: migrate config files to CommonJS for ESM compatibility
**Data:** 2025-10-25  
**Tipo:** build  
**Descrição:** Migração de arquivos de configuração para CommonJS para compatibilidade com ESM.

**Arquivos Modificados:**
- `.eslintrc.js` → `.eslintrc.cjs`
- `.prettierrc.js` → `.prettierrc.cjs`
- `commitlint.config.js` → `commitlint.config.cjs`

---

### 2. `a486398b` - build: remove old CommonJS config files
**Data:** 2025-10-25  
**Tipo:** build  
**Descrição:** Remoção de arquivos de configuração antigos do CommonJS.

---

### 3. `23d5323f` - feat: migrate project to ES Modules (ESM)
**Data:** 2025-10-25  
**Tipo:** feat  
**Descrição:** Migração completa do projeto para ES Modules.

**Mudanças Principais:**
- Adicionado `"type": "module"` no `package.json`
- Atualizado `tsconfig.json` para gerar código ESM
- Migrados imports para sintaxe ESM

---

### 4. `48b6a9d8` - fix: add ESM support for __dirname in i18n utility
**Data:** 2025-10-25  
**Tipo:** fix  
**Descrição:** Adicionado suporte ESM para `__dirname` usando `import.meta.url`.

**Arquivo:** `src/utils/i18n.ts`

---

### 5. `53322411` - fix: resolve ChatwootClient constructor issue in ESM environment
**Data:** 2025-10-25  
**Tipo:** fix  
**Descrição:** Correção do construtor ChatwootClient para ambiente ESM.

**Arquivo:** `src/api/integrations/chatbot/chatwoot/services/chatwoot.service.ts`

---

### 6. `ebc723e7` - fix: add .js extension to amqplib import for ESM compatibility
**Data:** 2025-10-25  
**Tipo:** fix  
**Descrição:** Adicionada extensão `.js` ao import do `amqplib` para compatibilidade ESM.

**Arquivo:** `src/api/integrations/event/rabbitmq/rabbitmq.controller.ts`

---

### 7. `5cb478f8` - chore: update package-lock.json for ESM migration
**Data:** 2025-10-25  
**Tipo:** chore  
**Descrição:** Atualização do `package-lock.json` para refletir mudanças da migração ESM.

---

### 8. `1cc861df` - fix: add improved error handling for instance validation
**Data:** 2025-10-25  
**Tipo:** fix  
**Descrição:** Melhor tratamento de erros para validação de instâncias.

---

### 9. `973114be` - perf: reduce retry delay from 1000ms to 200ms for faster message processing
**Data:** 2025-10-25  
**Tipo:** perf  
**Descrição:** Redução do delay de retry de 1000ms para 200ms para processamento mais rápido.

**Impacto:** 80% de redução no tempo de retry

---

### 10. `ff7fd02f` - perf: optimize message delay timing (min: 500ms, max: 8s)
**Data:** 2025-10-25  
**Tipo:** perf  
**Descrição:** Otimização do timing de delay de mensagens (mínimo: 500ms, máximo: 8s).

---

### 11. `15bab7f1` - perf: add error handling for Chatwoot database check to prevent delays
**Data:** 2025-10-25  
**Tipo:** perf  
**Descrição:** Adicionado tratamento de erros para verificação de banco de dados Chatwoot para prevenir delays.

---

### 12. `e62ef3e0` - perf: reduce keepAliveIntervalMs to prevent WebSocket connection timeout
**Data:** 2025-10-25  
**Tipo:** perf  
**Descrição:** Redução do `keepAliveIntervalMs` para prevenir timeout de conexão WebSocket.

---

### 13. `2257b566` - fix: correct broadcast check to use remoteJid for Chatwoot integration
**Data:** 2025-10-25  
**Tipo:** fix  
**Descrição:** Correção da verificação de broadcast para usar `remoteJid` corretamente na integração Chatwoot.

**Arquivo:** `src/api/integrations/chatbot/chatwoot/controllers/chatwoot.controller.ts`

---

### 14. `2ed6b1ce` - refactor: inline immediately returned variables in ChatwootController
**Data:** 2025-10-25  
**Tipo:** refactor  
**Descrição:** Inlining de variáveis imediatamente retornadas no ChatwootController.

**Arquivo:** `src/api/integrations/chatbot/chatwoot/controllers/chatwoot.controller.ts`

---

### 15. `0e619f58` - fix: change Chatwoot database error log level from ERROR to VERBOSE
**Data:** 2025-10-25  
**Tipo:** fix  
**Descrição:** Mudança do nível de log de erros de banco de dados Chatwoot de ERROR para VERBOSE.

**Impacto:** Reduz alarmes desnecessários em logs

---

### 16. `fcae75c6` - fix: improve log message for edit event when message not found in database
**Data:** 2025-10-25  
**Tipo:** fix  
**Descrição:** Melhoria da mensagem de log para eventos de edição quando mensagem não encontrada no banco.

---

### 17. `8762041e` - perf: reduce keepAliveIntervalMs to 5s and add WebSocket message timing logs
**Data:** 2025-10-26  
**Tipo:** perf  
**Descrição:** Redução do `keepAliveIntervalMs` para 5s e adição de logs de timing de mensagens WebSocket.

**Impacto:** Maior estabilidade de conexões WebSocket

---

### 18. `c3136c53` - perf: change message processing from sequential to parallel (mergeMap with concurrency 3)
**Data:** 2025-10-26  
**Tipo:** perf  
**Descrição:** Mudança do processamento de mensagens de sequencial para paralelo usando `mergeMap` com concorrência 3.

**Arquivo:** `src/api/integrations/channel/whatsapp/baileysMessage.processor.ts`

**Impacto:** 3x mais rápido no processamento de mensagens

---

### 19. `f51504a9` - docs: add PR documentation and migration patch
**Data:** 2025-10-25  
**Tipo:** docs  
**Descrição:** Adição de documentação de PR e patch de migração.

**Arquivos Criados:**
- `evolution-api-esm-migration.patch`

---

### 20. `d224d311` - docs: update author information in PR description
**Data:** 2025-10-25  
**Tipo:** docs  
**Descrição:** Atualização de informações do autor na descrição do PR.

---

### 21. `1058d34a` - docs: organize PR documentation in docs folder
**Data:** 2025-10-26  
**Tipo:** docs  
**Descrição:** Organização da documentação de PR na pasta docs.

---

### 22. `f5953f59` - feat(qrcode): add QR code Vue.js interface and static file serving
**Data:** 2025-10-26  
**Tipo:** feat  
**Descrição:** Adição de interface Vue.js para QR Code e serviço de arquivos estáticos.

**Arquivos Criados:**
- `public/qrcode/index.html`
- `dist_extensions/` (assets compilados)
- Documentação completa em `docs/scan_qrcode/`

**Funcionalidades:**
- Interface web responsiva
- Tema dark/light
- Geração de QR Code em tempo real
- Sistema de logs
- Gestão de perfil

---

## 📊 Estatísticas

### Por Tipo
- **feat:** 2 commits (9.5%)
- **perf:** 6 commits (28.6%)
- **fix:** 7 commits (33.3%)
- **docs:** 3 commits (14.3%)
- **refactor:** 1 commit (4.8%)
- **build:** 2 commits (9.5%)

### Por Data
- **2025-10-25:** 20 commits
- **2025-10-26:** 2 commits

### Por Impacto
- **Alto Impacto:** 8 commits (ESM, Performance, QR Code)
- **Médio Impacto:** 10 commits (Correções, Ajustes)
- **Baixo Impacto:** 3 commits (Documentação, Refatoração)

---

## 🔍 Buscar Commits Específicos

### Por Funcionalidade
```bash
# ESM Migration
git log --oneline --grep="ESM\|esm\|module"

# Performance
git log --oneline --grep="perf\|performance"

# QR Code
git log --oneline --grep="qrcode\|QR"

# Chatwoot
git log --oneline --grep="chatwoot\|Chatwoot"
```

### Por Arquivo
```bash
# Ver commits que modificaram arquivo específico
git log --oneline --follow -- src/utils/i18n.ts
git log --oneline --follow -- src/api/integrations/channel/whatsapp/baileysMessage.processor.ts
```

---

## 📝 Notas

- Todos os commits seguem o padrão **Conventional Commits**
- Commits testados e validados antes do merge
- Compatibilidade mantida com versão base (v2.3.6)
- Documentação atualizada junto com as mudanças

---

**Última Atualização:** Outubro 2025  
**Ver commits completos:** `git log --oneline origin/main..HEAD`

