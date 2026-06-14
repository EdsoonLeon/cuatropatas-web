import api from './axiosConfig';

export const veterinarioApi = {
  getAll: () => api.get('/api/veterinario'),
  getById: (id) => api.get(`/api/veterinario/${id}`),
  create: (data) => api.post('/api/veterinario', data),
  update: (id, data) => api.put(`/api/veterinario/${id}`, data),
  remove: (id) => api.delete(`/api/veterinario/${id}`),
  getAgenda: (id, params) => api.get(`/api/veterinario/${id}/agenda`, { params }),
  getEstadisticas: (id) => api.get(`/api/veterinario/${id}/estadisticas`),
};
