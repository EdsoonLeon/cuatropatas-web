import { FileText, Trash2 } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import EmptyState from '../shared/EmptyState';

function formatFecha(fecha) {
  if (!fecha) return '';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(fecha));
}

const tipoColors = {
  Vacunación: 'bg-green-100 text-green-700',
  Cirugía: 'bg-red-100 text-red-700',
  Consulta: 'bg-blue-100 text-blue-700',
  Control: 'bg-purple-100 text-purple-700',
  Emergencia: 'bg-amber-100 text-amber-700',
  Desparasitación: 'bg-teal-100 text-teal-700',
};

export default function HistorialList({ historial, onEliminar }) {
  if (!historial || historial.length === 0) {
    return (
      <EmptyState
        title="Sin registros en el historial"
        description="Los registros médicos aparecerán aquí"
        icon={FileText}
      />
    );
  }

  return (
    <div className="space-y-4">
      {historial.map((registro) => (
        <div key={registro.idHistorial} className="p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Badge className={`${tipoColors[registro.tipo] || 'bg-gray-100 text-gray-700'} rounded-lg`}>
                {registro.tipo}
              </Badge>
              <span className="text-sm text-muted-foreground">{formatFecha(registro.fecha)}</span>
            </div>
            {onEliminar && (
              <Button variant="ghost" size="icon" className="rounded-lg text-destructive" onClick={() => onEliminar(registro.idHistorial)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          {registro.nombreVeterinario && (
            <p className="text-sm font-medium mb-2">
              Dr. {registro.nombreVeterinario}
            </p>
          )}
          {registro.diagnostico && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Diagnóstico</p>
              <p className="text-sm mt-0.5">{registro.diagnostico}</p>
            </div>
          )}
          {registro.tratamiento && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Tratamiento</p>
              <p className="text-sm mt-0.5">{registro.tratamiento}</p>
            </div>
          )}
          {(registro.peso || registro.temperatura) && (
            <div className="flex space-x-4 mt-2">
              {registro.peso && <p className="text-xs text-muted-foreground">Peso: <span className="font-medium">{registro.peso} kg</span></p>}
              {registro.temperatura && <p className="text-xs text-muted-foreground">Temp: <span className="font-medium">{registro.temperatura}°C</span></p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
