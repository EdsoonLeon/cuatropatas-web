import { useState, useEffect } from 'react';
import { clienteApi } from '../api/clienteApi';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await clienteApi.getAll();
      setClientes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (datos) => {
    try {
      await clienteApi.create(datos);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear cliente');
      throw err;
    }
  };

  const actualizar = async (id, datos) => {
    try {
      await clienteApi.update(id, datos);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar cliente');
      throw err;
    }
  };

  useEffect(() => {
    obtenerTodos();
  }, []);

  return { clientes, loading, error, obtenerTodos, crear, actualizar };
}
