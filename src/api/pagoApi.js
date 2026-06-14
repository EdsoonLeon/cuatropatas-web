import api from './axiosConfig';

export const pagoApi = {
  getByCita: (idCita) => api.get(`/api/pago/cita/${idCita}`),
  update: (id, data) => api.put(`/api/pago/${id}`, data),
};
