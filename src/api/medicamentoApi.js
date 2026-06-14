import api from './axiosConfig';

export const medicamentoApi = {
  getAll: () => api.get('/api/medicamento'),
  getById: (id) => api.get(`/api/medicamento/${id}`),
  create: (data) => api.post('/api/medicamento', data),
  update: (id, data) => api.put(`/api/medicamento/${id}`, data),
  remove: (id) => api.delete(`/api/medicamento/${id}`),
  getStockBajo: () => api.get('/api/medicamento/stock-bajo'),
  descontarStock: (id, data) => api.post(`/api/medicamento/${id}/descontar-stock`, data),
  reponerStock: (id, data) => api.post(`/api/medicamento/${id}/reponer-stock`, data),
};
