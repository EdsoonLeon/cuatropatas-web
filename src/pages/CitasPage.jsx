import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Calendar } from '@/app/components/ui/calendar';
import { Plus } from 'lucide-react';
import CitasList from '../components/citas/CitasList';
import CitaForm from '../components/citas/CitaForm';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useCitas } from '../hooks/useCitas';
import { useMascotas } from '../hooks/useMascotas';
import { useVeterinarios } from '../hooks/useVeterinarios';

export default function CitasPage() {
  const { citas, loading, error, obtenerTodas, crear, cambiarEstado, cancelar } = useCitas();
  const { mascotas } = useMascotas();
  const { veterinarios } = useVeterinarios();

  const [formOpen, setFormOpen] = useState(false);
  const [citaACancelar, setCitaACancelar] = useState(null);
  const [fecha, setFecha] = useState(new Date());

  const citasHoy = citas.filter((c) => {
    if (!c.fechaHora) return false;
    const d = new Date(c.fechaHora);
    const hoy = new Date();
    return d.getDate() === hoy.getDate() && d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
  });

  const handleCrear = async (datos) => {
    await crear(datos);
  };

  const handleCancelar = async () => {
    if (citaACancelar) {
      await cancelar(citaACancelar, 'Cancelado por el usuario');
      setCitaACancelar(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={obtenerTodas} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Citas</h1>
          <p className="text-muted-foreground">Gestiona las citas veterinarias</p>
        </div>
        <Button className="rounded-xl bg-primary text-primary-foreground" onClick={() => setFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Calendario</h3>
          <Calendar mode="single" selected={fecha} onSelect={setFecha} className="rounded-xl" />
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
              <span className="text-sm">Hoy</span>
              <Badge className="bg-primary text-primary-foreground">{citasHoy.length} citas</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <span className="text-sm">Total</span>
              <Badge variant="outline">{citas.length} citas</Badge>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Citas del Día</h3>
            <Badge variant="outline" className="rounded-lg">{citasHoy.length} citas</Badge>
          </div>
          <CitasList
            citas={citasHoy.length > 0 ? citasHoy : citas}
            onCambiarEstado={cambiarEstado}
            onCancelar={(id) => setCitaACancelar(id)}
          />
        </Card>
      </div>

      <CitaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCrear}
        mascotas={mascotas}
        veterinarios={veterinarios}
      />

      <ConfirmDialog
        open={!!citaACancelar}
        onOpenChange={(open) => !open && setCitaACancelar(null)}
        onConfirm={handleCancelar}
        title="¿Cancelar esta cita?"
        description="La cita quedará como cancelada y no podrá revertirse fácilmente."
      />
    </div>
  );
}
