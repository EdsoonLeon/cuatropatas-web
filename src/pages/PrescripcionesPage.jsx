import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Search, ClipboardList } from 'lucide-react';
import { prescripcionApi } from '../api/prescripcionApi';
import { useMascotas } from '../hooks/useMascotas';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';

function formatFecha(fecha) {
  if (!fecha) return '';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(fecha));
}

export default function PrescripcionesPage() {
  const { mascotas } = useMascotas();
  const [prescripciones, setPrescripciones] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarPrescripciones = async () => {
    if (!mascotaSeleccionada) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await prescripcionApi.getByMascota(mascotaSeleccionada);
      setPrescripciones(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar prescripciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Prescripciones</h1>
        <p className="text-muted-foreground">Consulta las prescripciones médicas por mascota</p>
      </div>

      <Card className="p-6 rounded-2xl">
        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <Label>Seleccionar Mascota</Label>
            <Select value={mascotaSeleccionada} onValueChange={setMascotaSeleccionada}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecciona una mascota" />
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
          <Button onClick={buscarPrescripciones} disabled={!mascotaSeleccionada} className="rounded-xl">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <p className="text-destructive text-sm">{error}</p>}

        {!loading && !error && prescripciones.length === 0 && (
          <EmptyState
            title="Sin prescripciones"
            description="Selecciona una mascota para ver sus prescripciones"
            icon={ClipboardList}
          />
        )}

        {prescripciones.length > 0 && (
          <div className="space-y-4">
            {prescripciones.map((p) => (
              <div key={p.idPrescripcion} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{p.nombreMedicamento || 'Medicamento'}</p>
                    <p className="text-sm text-muted-foreground">{formatFecha(p.fechaInicio)} — {formatFecha(p.fechaFin)}</p>
                  </div>
                  <Badge variant="outline" className="rounded-lg">{p.dosis}</Badge>
                </div>
                {p.indicaciones && (
                  <p className="text-sm text-muted-foreground">{p.indicaciones}</p>
                )}
                {p.nombreVeterinario && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Prescrito por: Dr. {p.nombreVeterinario}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
