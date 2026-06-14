import CitaCard from './CitaCard';
import EmptyState from '../shared/EmptyState';
import { Calendar } from 'lucide-react';

export default function CitasList({ citas, onCambiarEstado, onCancelar }) {
  if (!citas || citas.length === 0) {
    return (
      <EmptyState
        title="No hay citas registradas"
        description="Las citas aparecerán aquí cuando sean agendadas"
        icon={Calendar}
      />
    );
  }

  return (
    <div className="space-y-3">
      {citas.map((cita) => (
        <CitaCard
          key={cita.idCita}
          cita={cita}
          onCambiarEstado={onCambiarEstado}
          onCancelar={onCancelar}
        />
      ))}
    </div>
  );
}
