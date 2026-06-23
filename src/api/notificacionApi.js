import api from './axiosConfig';

export const notificacionApi = {
  getMias: () => api.get('/api/notificacion'),
  marcarLeida: (id) => api.put(`/api/notificacion/${id}/marcar-leida`),
  marcarTodasLeidas: () => api.put('/api/notificacion/marcar-todas-leidas'),
};
