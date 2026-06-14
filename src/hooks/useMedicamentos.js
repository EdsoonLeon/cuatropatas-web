import { useState, useEffect } from 'react';
import { medicamentoApi } from '../api/medicamentoApi';

export function useMedicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [medicamentosRes, stockRes] = await Promise.all([
        medicamentoApi.getAll(),
        medicamentoApi.getStockBajo(),
      ]);
      setMedicamentos(medicamentosRes.data);
      setStockBajo(stockRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar medicamentos');
    } finally {
      setLoading(false);
    }
  };

  const crear = async (datos) => {
    try {
      await medicamentoApi.create(datos);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear medicamento');
      throw err;
    }
  };

  const actualizar = async (id, datos) => {
    try {
      await medicamentoApi.update(id, datos);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar medicamento');
      throw err;
    }
  };

  const eliminar = async (id) => {
    try {
      await medicamentoApi.remove(id);
      await obtenerTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar medicamento');
      throw err;
    }
  };

  useEffect(() => {
    obtenerTodos();
  }, []);

  return { medicamentos, stockBajo, loading, error, obtenerTodos, crear, actualizar, eliminar };
}
