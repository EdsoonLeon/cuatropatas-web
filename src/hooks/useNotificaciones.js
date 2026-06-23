import { useState, useEffect, useCallback } from 'react';
import { notificacionApi } from '../api/notificacionApi';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await notificacionApi.getMias();
      setNotificaciones(data);
    } catch {
      // silencioso — el usuario puede no tener notificaciones
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 60000); // refresca cada 1 min
    return () => clearInterval(intervalo);
  }, [cargar]);

  const marcarLeida = async (id) => {
    await notificacionApi.marcarLeida(id);
    setNotificaciones((prev) =>
      prev.map((n) => (n.idNotificacion === id ? { ...n, leida: true } : n))
    );
  };

  const marcarTodasLeidas = async () => {
    await notificacionApi.marcarTodasLeidas();
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return { notificaciones, noLeidas, loading, marcarLeida, marcarTodasLeidas, cargar };
}
