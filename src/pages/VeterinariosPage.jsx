import { useState } from 'react';
import VeterinariosList from '../components/veterinarios/VeterinariosList';
import VeterinarioForm from '../components/veterinarios/VeterinarioForm';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useVeterinarios } from '../hooks/useVeterinarios';

export default function VeterinariosPage() {
  const { veterinarios, loading, error, obtenerTodos, crear, actualizar, eliminar } = useVeterinarios();
  const [formOpen, setFormOpen] = useState(false);
  const [veterinarioEditar, setVeterinarioEditar] = useState(null);
  const [veterinarioEliminar, setVeterinarioEliminar] = useState(null);

  const handleSubmit = async (datos) => {
    if (veterinarioEditar) {
      await actualizar(veterinarioEditar.idVeterinario, datos);
    } else {
      await crear(datos);
    }
    setVeterinarioEditar(null);
  };

  const handleEditar = (vet) => {
    setVeterinarioEditar(vet);
    setFormOpen(true);
  };

  const handleEliminar = async () => {
    if (veterinarioEliminar) {
      await eliminar(veterinarioEliminar);
      setVeterinarioEliminar(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={obtenerTodos} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Veterinarios</h1>
        <p className="text-muted-foreground">Gestiona el equipo de veterinarios</p>
      </div>

      <VeterinariosList
        veterinarios={veterinarios}
        onNuevo={() => { setVeterinarioEditar(null); setFormOpen(true); }}
        onEditar={handleEditar}
        onEliminar={(id) => setVeterinarioEliminar(id)}
      />

      <VeterinarioForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setVeterinarioEditar(null); }}
        onSubmit={handleSubmit}
        veterinarioEditar={veterinarioEditar}
      />

      <ConfirmDialog
        open={!!veterinarioEliminar}
        onOpenChange={(open) => !open && setVeterinarioEliminar(null)}
        onConfirm={handleEliminar}
        title="¿Desactivar veterinario?"
        description="El veterinario quedará inactivo en el sistema."
      />
    </div>
  );
}
