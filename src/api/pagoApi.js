import api from './axiosConfig';

export const pagoApi = {
  getByCita: (idCita) => api.get(`/api/pago/cita/${idCita}`),
  getByCliente: (nombre) => api.get('/api/pago/buscar', { params: { nombre } }),
  update: (id, data) => api.put(`/api/pago/${id}`, data),
};
