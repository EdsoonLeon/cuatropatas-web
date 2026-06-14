import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Plus, Search } from 'lucide-react';
import HistorialList from '../components/historial/HistorialList';
import HistorialForm from '../components/historial/HistorialForm';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useHistorial } from '../hooks/useHistorial';
import { useMascotas } from '../hooks/useMascotas';
import { useVeterinarios } from '../hooks/useVeterinarios';

export default function HistorialPage() {
  const { historial, loading, error, obtenerPorMascota, crear, eliminar } = useHistorial();
  const { mascotas } = useMascotas();
  const { veterinarios } = useVeterinarios();
  const [searchParams] = useSearchParams();

  const [formOpen, setFormOpen] = useState(false);
  const [registroEliminar, setRegistroEliminar] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');

  useEffect(() => {
    const idMascota = searchParams.get('mascota');
    if (idMascota) {
      setMascotaSeleccionada(idMascota);
      obtenerPorMascota(idMascota);
    }
  }, [searchParams]);

  const handleBuscar = () => {
    if (mascotaSeleccionada) {
      obtenerPorMascota(mascotaSeleccionada);
    }
  };

  const handleCrear = async (datos) => {
    await crear({ ...datos, idMascota: Number(mascotaSeleccionada) });
    if (mascotaSeleccionada) obtenerPorMascota(mascotaSeleccionada);
  };

  const handleEliminar = async () => {
    if (registroEliminar) {
      await eliminar(registroEliminar);
      setRegistroEliminar(null);
      if (mascotaSeleccionada) obtenerPorMascota(mascotaSeleccionada);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Historial Médico</h1>
          <p className="text-muted-foreground">Consulta y gestiona los registros médicos de las mascotas</p>
        </div>
        {mascotaSeleccionada && (
          <Button className="rounded-xl bg-primary text-primary-foreground" onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Registro
          </Button>
        )}
      </div>

      <Card className="p-6 rounded-2xl">
        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <Label>Seleccionar Mascota</Label>
            <Select value={mascotaSeleccionada} onValueChange={setMascotaSeleccionada}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecciona una mascota para ver su historial" />
              </SelectTrigger>
              <SelectContent>
                {mascotas.map((m) => (
                  <SelectItem key={m.idMascota} value={String(m.idMascota)}>
                    {m.nombre} — {m.especie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleBuscar} disabled={!mascotaSeleccionada} className="rounded-xl">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && (
          <HistorialList
            historial={historial}
            onEliminar={(id) => setRegistroEliminar(id)}
          />
        )}
      </Card>

      <HistorialForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCrear}
        idMascota={mascotaSeleccionada}
        veterinarios={veterinarios}
      />

      <ConfirmDialog
        open={!!registroEliminar}
        onOpenChange={(open) => !open && setRegistroEliminar(null)}
        onConfirm={handleEliminar}
        title="¿Eliminar este registro?"
        description="El registro quedará inactivo en el sistema."
      />
    </div>
  );
}
