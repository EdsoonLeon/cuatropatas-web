import api from './axiosConfig';

export const clienteApi = {
  getAll: () => api.get('/api/cliente'),
  getById: (id) => api.get(`/api/cliente/${id}`),
  create: (data) => api.post('/api/cliente', data),
  update: (id, data) => api.put(`/api/cliente/${id}`, data),
  getMascotas: (id) => api.get(`/api/cliente/${id}/mascotas`),
};
