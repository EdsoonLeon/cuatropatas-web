import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerResumen = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const { data: resumen } = await dashboardApi.getResumen(params);
      setData(resumen);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerResumen();
  }, []);

  return { data, loading, error, obtenerResumen };
}
