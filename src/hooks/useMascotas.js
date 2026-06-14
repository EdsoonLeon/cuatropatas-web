import { useState, useEffect } from 'react';
import { mascotaApi } from '../api/mascotaApi';

export function useMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodas = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await mascotaApi.getAll();
      setMascotas(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (datos) => {
    try {
      await mascotaApi.create(datos);
      await obtenerTodas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear mascota');
      throw err;
    }
  };

  const actualizar = async (id, datos) => {
    try {
      await mascotaApi.update(id, datos);
      await obtenerTodas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar mascota');
      throw err;
    }
  };

  const eliminar = async (id) => {
    try {
      await mascotaApi.remove(id);
      await obtenerTodas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar mascota');
      throw err;
    }
  };

  useEffect(() => {
    obtenerTodas();
  }, []);

  return { mascotas, loading, error, obtenerTodas, crear, actualizar, eliminar };
}
