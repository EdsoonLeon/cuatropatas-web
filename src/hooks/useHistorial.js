import { useState } from 'react';
import { historialApi } from '../api/historialApi';

export function useHistorial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPorMascota = async (idMascota) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await historialApi.getByMascota(idMascota);
      setHistorial(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (datos) => {
    try {
      await historialApi.create(datos);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear registro');
      throw err;
    }
  };

  const eliminar = async (id) => {
    try {
      await historialApi.remove(id);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar registro');
      throw err;
    }
  };

  return { historial, loading, error, obtenerPorMascota, crear, eliminar };
}
