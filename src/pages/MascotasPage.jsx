import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MascotasList from '../components/mascotas/MascotasList';
import MascotaForm from '../components/mascotas/MascotaForm';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useMascotas } from '../hooks/useMascotas';
import { useClientes } from '../hooks/useClientes';

export default function MascotasPage() {
  const { mascotas, loading, error, obtenerTodas, crear, actualizar, eliminar } = useMascotas();
  const { clientes } = useClientes();
  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [mascotaEditar, setMascotaEditar] = useState(null);
  const [mascotaEliminar, setMascotaEliminar] = useState(null);

  const handleSubmit = async (datos) => {
    if (mascotaEditar) {
      await actualizar(mascotaEditar.idMascota, datos);
    } else {
      await crear(datos);
    }
    setMascotaEditar(null);
  };

  const handleEditar = (mascota) => {
    setMascotaEditar(mascota);
    setFormOpen(true);
  };

  const handleEliminar = async () => {
    if (mascotaEliminar) {
      await eliminar(mascotaEliminar);
      setMascotaEliminar(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={obtenerTodas} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mascotas</h1>
        <p className="text-muted-foreground">Gestiona el registro de todas las mascotas</p>
      </div>

      <MascotasList
        mascotas={mascotas}
        clientes={clientes}
        onNueva={() => { setMascotaEditar(null); setFormOpen(true); }}
        onEditar={handleEditar}
        onEliminar={(id) => setMascotaEliminar(id)}
        onVerHistorial={(mascota) => navigate(`/historial?mascota=${mascota.idMascota}`)}
      />

      <MascotaForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setMascotaEditar(null); }}
        onSubmit={handleSubmit}
        clientes={clientes}
        mascotaEditar={mascotaEditar}
      />

      <ConfirmDialog
        open={!!mascotaEliminar}
        onOpenChange={(open) => !open && setMascotaEliminar(null)}
        onConfirm={handleEliminar}
        title="¿Eliminar mascota?"
        description="La mascota quedará inactiva en el sistema (soft delete)."
      />
    </div>
  );
}
