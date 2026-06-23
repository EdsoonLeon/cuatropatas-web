import { useState, useEffect } from 'react';
import { citaApi } from '../api/citaApi';

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodas = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await citaApi.getAll();
      setCitas(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (datos) => {
    // Lanza el error de creación para que el formulario lo muestre
    await citaApi.create(datos);
    // El refresh no debe bloquear ni propagar error al formulario
    obtenerTodas();
  };

  const cambiarEstado = async (id, estado, observaciones) => {
    try {
      await citaApi.changeStatus(id, { estado, observaciones });
      await obtenerTodas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const cancelar = async (id, motivo) => {
    try {
      await citaApi.cancel(id, { motivo });
      await obtenerTodas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar cita');
    }
  };

  useEffect(() => {
    obtenerTodas();
  }, []);

  return { citas, loading, error, obtenerTodas, crear, cambiarEstado, cancelar };
}
