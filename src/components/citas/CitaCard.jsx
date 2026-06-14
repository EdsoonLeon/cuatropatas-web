import { Clock, User, Stethoscope } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

const estadoColors = {
  Confirmada: 'bg-green-100 text-green-700 border-green-200',
  Pendiente: 'bg-amber-100 text-amber-700 border-amber-200',
  Completada: 'bg-blue-100 text-blue-700 border-blue-200',
  Cancelada: 'bg-red-100 text-red-700 border-red-200',
};

function formatFechaHora(fechaHora) {
  if (!fechaHora) return '';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fechaHora));
}

export default function CitaCard({ cita, onCambiarEstado, onCancelar }) {
  const colorClass = estadoColors[cita.estado] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="p-5 rounded-xl border border-border hover:shadow-md transition-all bg-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-3">
            <h4 className="font-semibold text-lg">{cita.nombreMascota}</h4>
            <Badge className={`${colorClass} rounded-lg text-xs`}>{cita.estado}</Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{cita.nombreCliente}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4" />
              <span>{cita.nombreVeterinario}</span>
            </div>
          </div>
          <p className="text-sm">{cita.motivo}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2 text-primary">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">{formatFechaHora(cita.fechaHora)}</span>
          </div>
          <div className="flex items-center space-x-2">
            {cita.estado === 'Pendiente' && onCambiarEstado && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => onCambiarEstado(cita.idCita, 'Confirmada')}
              >
                Confirmar
              </Button>
            )}
            {cita.estado !== 'Cancelada' && cita.estado !== 'Completada' && onCancelar && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => onCancelar(cita.idCita)}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
