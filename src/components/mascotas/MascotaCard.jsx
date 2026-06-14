import { PawPrint, Edit, Trash2, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

export default function MascotaCard({ mascota, onEditar, onEliminar, onVerHistorial }) {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-xl border border-border hover:shadow-sm transition-all bg-card">
      <Avatar className="w-12 h-12">
        <AvatarFallback className="bg-primary/10 text-primary">
          <PawPrint className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{mascota.nombre}</p>
        <p className="text-sm text-muted-foreground">
          {mascota.especie} {mascota.raza && `· ${mascota.raza}`}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Dueño: {mascota.nombreCliente || `Cliente #${mascota.idCliente}`}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {onVerHistorial && (
          <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => onVerHistorial(mascota)}>
            <FileText className="w-4 h-4" />
          </Button>
        )}
        {onEditar && (
          <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => onEditar(mascota)}>
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {onEliminar && (
          <Button variant="ghost" size="icon" className="rounded-lg text-destructive" onClick={() => onEliminar(mascota.idMascota)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
