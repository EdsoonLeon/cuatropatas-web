import api from './axiosConfig';

export const dashboardApi = {
  getResumen: (params) => api.get('/api/dashboard', { params }),
};
