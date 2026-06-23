import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/app/components/ui/select';
import { DollarSign, Search, CreditCard } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import { pagoApi } from '../api/pagoApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EmptyState from '../components/shared/EmptyState';

function formatMoneda(valor) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(valor || 0);
}

function formatFecha(fecha) {
  if (!fecha) return '-';
  return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(fecha));
}

const estadoColors = {
  Pendiente: 'bg-amber-100 text-amber-700',
  Pagado: 'bg-green-100 text-green-700',
  Parcial: 'bg-blue-100 text-blue-700',
  Anulado: 'bg-red-100 text-red-700',
};

const PAGO_INICIAL = { estadoPago: '', metodoPago: '' };

export default function PagosPage() {
  const [busqueda, setBusqueda] = useState('');
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buscado, setBuscado] = useState(false);

  const [pagoEditar, setPagoEditar] = useState(null);
  const [formPago, setFormPago] = useState(PAGO_INICIAL);
  const [formError, setFormError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const buscarPagos = async () => {
    if (!busqueda.trim()) return;
    setLoading(true);
    setError(null);
    setPagos([]);
    setBuscado(false);
    try {
      const { data } = await pagoApi.getByCliente(busqueda.trim());
      setPagos(data);
      setBuscado(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al buscar pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') buscarPagos();
  };

  const abrirEditar = (pago) => {
    setPagoEditar(pago);
    setFormPago({ estadoPago: pago.estadoPago, metodoPago: pago.metodoPago || '' });
    setFormError('');
  };

  const cerrarEditar = () => {
    setPagoEditar(null);
    setFormPago(PAGO_INICIAL);
    setFormError('');
  };

  const handleGuardar = async () => {
    if (!formPago.estadoPago) { setFormError('Selecciona el estado del pago'); return; }
    if (formPago.estadoPago === 'Pagado' && !formPago.metodoPago) {
      setFormError('Selecciona el método de pago');
      return;
    }
    setGuardando(true);
    setFormError('');
    try {
      await pagoApi.update(pagoEditar.idPago, {
        estadoPago: formPago.estadoPago,
        metodoPago: formPago.metodoPago || null,
        fechaPago: formPago.estadoPago === 'Pagado' ? new Date().toISOString() : null,
      });
      cerrarEditar();
      // Refresca la búsqueda para ver los cambios
      const { data } = await pagoApi.getByCliente(busqueda.trim());
      setPagos(data);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al actualizar pago');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pagos</h1>
        <p className="text-muted-foreground">Consulta y registra los pagos de las citas</p>
      </div>

      <Card className="p-6 rounded-2xl">
        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <Label>Nombre del Cliente</Label>
            <Input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ej: Juan Pérez"
              className="rounded-xl"
            />
          </div>
          <Button onClick={buscarPagos} disabled={!busqueda.trim() || loading} className="rounded-xl">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <p className="text-destructive text-sm">{error}</p>}

        {!loading && !buscado && (
          <EmptyState
            title="Busca por nombre de cliente"
            description="Ingresa el nombre o apellido para ver sus pagos"
            icon={DollarSign}
          />
        )}

        {buscado && pagos.length === 0 && !loading && (
          <EmptyState
            title="Sin resultados"
            description={`No se encontraron pagos para "${busqueda}"`}
            icon={DollarSign}
          />
        )}

        {pagos.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Cita #</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Fecha Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagos.map((p) => (
                <TableRow key={p.idPago}>
                  <TableCell className="font-medium">{p.nombreCliente}</TableCell>
                  <TableCell>#{p.idCita}</TableCell>
                  <TableCell>{formatMoneda(p.montoTotal)}</TableCell>
                  <TableCell>
                    <Badge className={`${estadoColors[p.estadoPago] || 'bg-gray-100 text-gray-700'} rounded-lg`}>
                      {p.estadoPago}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.metodoPago || '-'}</TableCell>
                  <TableCell>{formatFecha(p.fechaPago)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                      onClick={() => abrirEditar(p)}
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-1" />
                      {p.estadoPago === 'Pendiente' ? 'Registrar Pago' : 'Editar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Dialog para actualizar estado del pago */}
      <Dialog open={!!pagoEditar} onOpenChange={(open) => !open && cerrarEditar()}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Actualizar Pago</DialogTitle>
            <DialogDescription>
              Cita #{pagoEditar?.idCita} — {pagoEditar?.nombreCliente} —{' '}
              {formatMoneda(pagoEditar?.montoTotal)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Estado del Pago</Label>
              <Select
                value={formPago.estadoPago}
                onValueChange={(v) => setFormPago({ ...formPago, estadoPago: v })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Parcial">Pago Parcial</SelectItem>
                  <SelectItem value="Anulado">Anulado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Método de Pago <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Select
                value={formPago.metodoPago}
                onValueChange={(v) => setFormPago({ ...formPago, metodoPago: v })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="Transferencia">Transferencia</SelectItem>
                  <SelectItem value="Yape">Yape / Plin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={cerrarEditar} className="rounded-xl">
                Cancelar
              </Button>
              <Button onClick={handleGuardar} disabled={guardando} className="rounded-xl bg-primary">
                {guardando ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
