# Gestão Matriz RACI - Jurídico

Este projeto é uma plataforma de organização de demandas jurídicas utilizando a Matriz RACI.

## Como implantar na Vercel via GitHub

1. **Crie um repositório no GitHub** e suba todos os arquivos deste projeto.
2. **Acesse o painel da Vercel** (vercel.com).
3. **Importe o repositório** que você acabou de criar.
4. **Configurações de Projeto**:
   - O Framework Preset deve ser detectado automaticamente como **Vite**.
   - O Build Command deve ser `npm run build`.
   - O Output Directory deve ser `dist`.
5. **Variáveis de Ambiente**:
   - Se você estiver usando a API do Gemini, adicione a variável `GEMINI_API_KEY` com o seu valor nas configurações de "Environment Variables" da Vercel.
6. **Clique em Deploy**.

O arquivo `vercel.json` já está incluído para garantir que as rotas do React funcionem corretamente (SPA routing).
