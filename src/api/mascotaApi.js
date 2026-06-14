import api from './axiosConfig';

export const mascotaApi = {
  getAll: () => api.get('/api/mascota'),
  getById: (id) => api.get(`/api/mascota/${id}`),
  create: (data) => api.post('/api/mascota', data),
  update: (id, data) => api.put(`/api/mascota/${id}`, data),
  remove: (id) => api.delete(`/api/mascota/${id}`),
  getHistorial: (id) => api.get(`/api/mascota/${id}/historial`),
  getProximasCitas: (id) => api.get(`/api/mascota/${id}/proximas-citas`),
};
