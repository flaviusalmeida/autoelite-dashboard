# Auto Elite - Backend (Express + Google Sheets)

## Setup
1) Crie um Service Account no Google Cloud e baixe o JSON.
2) Compartilhe a planilha com o e-mail do Service Account como **Leitor**.
3) Copie `.env.example` para `.env` e preencha:
   - `SPREADSHEET_ID`
   - `GOOGLE_APPLICATION_CREDENTIALS=./sa-credentials.json` (ou caminho absoluto)
4) `npm install`
5) `npm run start`

## Endpoints
- `GET /api/health`
- `GET /api/meses`
- `GET /api/servicos?mes=09/2025`
- `GET /api/operacional?mes=09/2025`
