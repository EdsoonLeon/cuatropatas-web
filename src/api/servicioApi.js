import api from './axiosConfig';

export const servicioApi = {
  getAll: () => api.get('/api/servicio'),
  create: (data) => api.post('/api/servicio', data),
  update: (id, data) => api.put(`/api/servicio/${id}`, data),
  remove: (id) => api.delete(`/api/servicio/${id}`),
};
