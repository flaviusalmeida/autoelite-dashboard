import axios from 'axios';
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', timeout: 15000 });
export const fetchMeses = () => API.get('/api/meses').then(r=>r.data);
export const fetchServicos = (mes) => API.get('/api/servicos', { params: { mes }}).then(r=>r.data);
export const fetchOperacional = (mes) => API.get('/api/operacional', { params: { mes }}).then(r=>r.data);
