import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { DollarSign, Search } from 'lucide-react';
import { pagoApi } from '../api/pagoApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';

function formatMoneda(valor) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(valor || 0);
}

function formatFecha(fecha) {
  if (!fecha) return '';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fecha));
}

const estadoPagoColors = {
  Pendiente: 'bg-amber-100 text-amber-700',
  Pagado: 'bg-green-100 text-green-700',
  Parcial: 'bg-blue-100 text-blue-700',
  Cancelado: 'bg-red-100 text-red-700',
};

export default function PagosPage() {
  const [idCita, setIdCita] = useState('');
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarPago = async () => {
    if (!idCita) return;
    setLoading(true);
    setError(null);
    setPago(null);
    try {
      const { data } = await pagoApi.getByCita(idCita);
      setPago(data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se encontró pago para esa cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pagos</h1>
        <p className="text-muted-foreground">Consulta y gestiona los pagos de las citas</p>
      </div>

      <Card className="p-6 rounded-2xl">
        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <Label>ID de Cita</Label>
            <Input
              value={idCita}
              onChange={(e) => setIdCita(e.target.value)}
              placeholder="Ingresa el ID de la cita"
              className="rounded-xl"
              type="number"
            />
          </div>
          <Button onClick={buscarPago} disabled={!idCita} className="rounded-xl">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <p className="text-destructive text-sm">{error}</p>}

        {!loading && !error && !pago && (
          <EmptyState
            title="Sin resultado"
            description="Ingresa un ID de cita para buscar el pago"
            icon={DollarSign}
          />
        )}

        {pago && (
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cita #{pago.idCita}</p>
                <p className="text-2xl font-bold mt-1">{formatMoneda(pago.total)}</p>
              </div>
              <Badge className={`${estadoPagoColors[pago.estado] || 'bg-gray-100 text-gray-700'} rounded-lg`}>
                {pago.estado}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">{formatMoneda(pago.subtotal)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">IGV (18%)</p>
                <p className="font-medium">{formatMoneda(pago.igv)}</p>
              </div>
              {pago.descuento > 0 && (
                <div>
                  <p className="text-muted-foreground">Descuento</p>
                  <p className="font-medium text-green-600">-{formatMoneda(pago.descuento)}</p>
                </div>
              )}
              {pago.metodoPago && (
                <div>
                  <p className="text-muted-foreground">Método de pago</p>
                  <p className="font-medium">{pago.metodoPago}</p>
                </div>
              )}
              {pago.fechaPago && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Fecha de pago</p>
                  <p className="font-medium">{formatFecha(pago.fechaPago)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
