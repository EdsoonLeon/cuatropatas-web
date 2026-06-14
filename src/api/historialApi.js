import api from './axiosConfig';

export const historialApi = {
  create: (data) => api.post('/api/historial', data),
  getById: (id) => api.get(`/api/historial/${id}`),
  getByMascota: (idMascota) => api.get(`/api/historial/mascota/${idMascota}`),
  getVacunas: (idMascota) => api.get(`/api/historial/mascota/${idMascota}/vacunas`),
  remove: (id) => api.delete(`/api/historial/${id}`),
};
