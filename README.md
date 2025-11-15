# Auto Elite - Dashboard Operacional

Projeto full-stack (Node/Express + React/Tailwind).

## Rodando local
### Backend
```
cd backend
cp .env.example .env
# edite .env com SPREADSHEET_ID e GOOGLE_APPLICATION_CREDENTIALS
npm install
npm run start
```

### Frontend
```
cd frontend
cp .env.example .env
npm install
npm run dev
```
Abra o URL do Vite.

## Planilha (layout esperado)
- **Serviços**: `Serviço | Mês | Quantidade`
- **Operacional**: `Responsável | Mês | ... | Total de Serviços`
