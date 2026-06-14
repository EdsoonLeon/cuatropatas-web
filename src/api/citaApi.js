import api from './axiosConfig';

export const citaApi = {
  getAll: () => api.get('/api/cita'),
  getHoy: () => api.get('/api/cita/hoy'),
  getMisCitas: () => api.get('/api/cita/mis-citas'),
  getById: (id) => api.get(`/api/cita/${id}`),
  create: (data) => api.post('/api/cita', data),
  changeStatus: (id, data) => api.patch(`/api/cita/${id}/estado`, data),
  cancel: (id, data) => api.post(`/api/cita/${id}/cancelar`, data),
  addServicio: (id, data) => api.post(`/api/cita/${id}/servicio`, data),
  getServicios: (id) => api.get(`/api/cita/${id}/servicios`),
};
