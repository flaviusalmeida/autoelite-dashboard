import { google } from 'googleapis';

const spreadsheetId = process.env.SPREADSHEET_ID;
const SHEET_SERVICOS = process.env.SHEET_SERVICOS || 'Serviços';
const SHEET_OPERACIONAL = process.env.SHEET_OPERACIONAL || 'Operacional';

async function getSheetsClient() {
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
  return google.sheets({ version: 'v4', auth });
}

function rowsToObjects(values) {
  if (!values || values.length === 0) return [];
  const [header, ...rows] = values;
  return rows
    .filter(r => r.some(c => String(c || '').trim() !== ''))
    .map(r => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

export async function listMeses() {
  const sheets = await getSheetsClient();
  const ranges = [`${SHEET_SERVICOS}!A1:C1000`, `${SHEET_OPERACIONAL}!A1:Z1000`];
  const resp = await sheets.spreadsheets.values.batchGet({ spreadsheetId, ranges });
  const meses = new Set();
  for (const v of resp.data.valueRanges || []) {
    const objs = rowsToObjects(v.values || []);
    for (const o of objs) if (o['Mês']) meses.add(o['Mês']);
  }
  const arr = Array.from(meses);
  arr.sort((a,b) => {
    const [ma, ya] = String(a).split('/').map(n=>parseInt(n,10));
    const [mb, yb] = String(b).split('/').map(n=>parseInt(n,10));
    if (ya !== yb) return ya - yb; return ma - mb;
  });
  return arr;
}

export async function getServicos(mes='') {
  const sheets = await getSheetsClient();
  const range = `${SHEET_SERVICOS}!A1:C1000`;
  const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const objs = rowsToObjects(resp.data.values || []);
  const filtered = mes ? objs.filter(o => o['Mês'] === mes) : objs;
  return { servicos: filtered };
}

export async function getOperacional(mes='') {
  const sheets = await getSheetsClient();
  const range = `${SHEET_OPERACIONAL}!A1:Z1000`;
  const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const objs = rowsToObjects(resp.data.values || []);
  const filtered = mes ? objs.filter(o => o['Mês'] === mes || !o['Mês']) : objs;

  const withTotal = filtered.filter(o => 'Total de Serviços' in o);
  const ranking = withTotal
    .map(o => ({ responsavel: o['Responsável'] || o['Responsavel'] || '', total: Number(o['Total de Serviços'] || 0) }))
    .filter(x => x.responsavel)
    .sort((a,b) => b.total - a.total);

  return { operacional: filtered, ranking };
}
