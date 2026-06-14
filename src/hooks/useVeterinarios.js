import { useState, useEffect } from 'react';
import { veterinarioApi } from '../api/veterinarioApi';

export function useVeterinarios() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await veterinarioApi.getAll();
      setVeterinarios(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar veterinarios');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (datos) => {
    try {
      await veterinarioApi.create(datos);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear veterinario');
      throw err;
    }
  };

  const actualizar = async (id, datos) => {
    try {
      await veterinarioApi.update(id, datos);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar veterinario');
      throw err;
    }
  };

  const eliminar = async (id) => {
    try {
      await veterinarioApi.remove(id);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar veterinario');
      throw err;
    }
  };

  useEffect(() => {
    obtenerTodos();
  }, []);

  return { veterinarios, loading, error, obtenerTodos, crear, actualizar, eliminar };
}
