import api from './axiosConfig';

export const prescripcionApi = {
  create: (data) => api.post('/api/prescripcion', data),
  getByHistorial: (idHistorial) => api.get(`/api/prescripcion/historial/${idHistorial}`),
  getByMascota: (idMascota) => api.get(`/api/prescripcion/mascota/${idMascota}`),
  update: (id, data) => api.put(`/api/prescripcion/${id}`, data),
  remove: (id) => api.delete(`/api/prescripcion/${id}`),
};
