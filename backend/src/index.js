import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { getServicos, getOperacional, listMeses } from './services/googleSheets.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.get('/api/meses', async (_req, res) => {
  try { res.json(await listMeses()); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Erro ao listar meses', details: String(e) }); }
});

app.get('/api/servicos', async (req, res) => {
  try { res.json(await getServicos(req.query.mes || '')); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Erro ao ler Serviços', details: String(e) }); }
});

app.get('/api/operacional', async (req, res) => {
  try { res.json(await getOperacional(req.query.mes || '')); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Erro ao ler Operacional', details: String(e) }); }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`[autoelite-backend] listening on :${port}`));
