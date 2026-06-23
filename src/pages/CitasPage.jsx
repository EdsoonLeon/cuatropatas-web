import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Calendar } from '@/app/components/ui/calendar';
import { Plus, X } from 'lucide-react';
import CitasList from '../components/citas/CitasList';
import CitaForm from '../components/citas/CitaForm';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useCitas } from '../hooks/useCitas';
import { useMascotas } from '../hooks/useMascotas';
import { useVeterinarios } from '../hooks/useVeterinarios';

function mismaFecha(fechaHora, referencia) {
  const d = new Date(fechaHora);
  return (
    d.getDate() === referencia.getDate() &&
    d.getMonth() === referencia.getMonth() &&
    d.getFullYear() === referencia.getFullYear()
  );
}

export default function CitasPage() {
  const { citas, loading, error, obtenerTodas, crear, cambiarEstado, cancelar } = useCitas();
  const { mascotas } = useMascotas();
  const { veterinarios } = useVeterinarios();

  const [formOpen, setFormOpen] = useState(false);
  const [citaACancelar, setCitaACancelar] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState(null);

  const hoy = new Date();
  const citasHoy = citas.filter((c) => c.fechaHora && mismaFecha(c.fechaHora, hoy));

  const citasMostradas = fechaFiltro
    ? citas.filter((c) => c.fechaHora && mismaFecha(c.fechaHora, fechaFiltro))
    : citas;

  const handleSeleccionarFecha = (d) => {
    if (!d) { setFechaFiltro(null); return; }
    // Si el usuario hace clic en la misma fecha ya seleccionada, limpia el filtro
    if (fechaFiltro && mismaFecha(d, fechaFiltro)) {
      setFechaFiltro(null);
    } else {
      setFechaFiltro(d);
    }
  };

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
          <Calendar
            mode="single"
            selected={fechaFiltro ?? undefined}
            onSelect={handleSeleccionarFecha}
            className="rounded-xl"
          />
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
            <h3 className="text-lg font-semibold">
              {fechaFiltro
                ? `Citas del ${fechaFiltro.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}`
                : 'Todas las citas'}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-lg">{citasMostradas.length} citas</Badge>
              {fechaFiltro && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg h-7 px-2 text-xs text-muted-foreground"
                  onClick={() => setFechaFiltro(null)}
                >
                  <X className="w-3 h-3 mr-1" />
                  Ver todas
                </Button>
              )}
            </div>
          </div>
          <CitasList
            citas={citasMostradas}
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
