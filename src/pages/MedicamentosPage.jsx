import { useState, useEffect } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import MedicamentosList from '../components/medicamentos/MedicamentosList';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useMedicamentos } from '../hooks/useMedicamentos';

const formInicial = { nombre: '', descripcion: '', tipo: '', precioUnitario: '', stock: '' };

function MedicamentoForm({ open, onOpenChange, onSubmit, medicamentoEditar }) {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (medicamentoEditar) {
      setForm({
        nombre: medicamentoEditar.nombre || '',
        descripcion: medicamentoEditar.descripcion || '',
        tipo: medicamentoEditar.tipo || '',
        precioUnitario: medicamentoEditar.precioUnitario || '',
        stock: medicamentoEditar.stock || '',
      });
    } else {
      setForm(formInicial);
    }
  }, [medicamentoEditar, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        precioUnitario: Number(form.precioUnitario),
        stock: Number(form.stock),
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{medicamentoEditar ? 'Editar Medicamento' : 'Nuevo Medicamento'}</DialogTitle>
          <DialogDescription>Completa la información del medicamento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={form.nombre} onChange={set('nombre')} placeholder="Nombre del medicamento" className="rounded-xl" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Input value={form.tipo} onChange={set('tipo')} placeholder="Ej: Antibiótico" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Precio Unitario (S/)</Label>
              <Input type="number" step="0.01" value={form.precioUnitario} onChange={set('precioUnitario')} placeholder="0.00" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Stock Actual</Label>
            <Input type="number" value={form.stock} onChange={set('stock')} placeholder="0" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input value={form.descripcion} onChange={set('descripcion')} placeholder="Descripción breve" className="rounded-xl" />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary">
              {loading ? 'Guardando...' : (medicamentoEditar ? 'Actualizar' : 'Registrar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MedicamentosPage() {
  const { medicamentos, stockBajo, loading, error, obtenerTodos, crear, actualizar, eliminar } = useMedicamentos();
  const [formOpen, setFormOpen] = useState(false);
  const [medicamentoEditar, setMedicamentoEditar] = useState(null);
  const [medicamentoEliminar, setMedicamentoEliminar] = useState(null);

  const handleSubmit = async (datos) => {
    if (medicamentoEditar) {
      await actualizar(medicamentoEditar.idMedicamento, datos);
    } else {
      await crear(datos);
    }
    setMedicamentoEditar(null);
  };

  const handleEditar = (med) => {
    setMedicamentoEditar(med);
    setFormOpen(true);
  };

  const handleEliminar = async () => {
    if (medicamentoEliminar) {
      await eliminar(medicamentoEliminar);
      setMedicamentoEliminar(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={obtenerTodos} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Medicamentos</h1>
        <p className="text-muted-foreground">Gestiona el inventario de medicamentos</p>
      </div>

      {stockBajo.length > 0 && (
        <Card className="p-4 rounded-2xl border-amber-200 bg-amber-50">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Alertas de Stock</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stockBajo.map((m) => (
              <Badge key={m.idMedicamento} className="bg-amber-100 text-amber-700 border-amber-200 rounded-lg">
                {m.nombre}: {m.stock} unidades
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <MedicamentosList
        medicamentos={medicamentos}
        onNuevo={() => { setMedicamentoEditar(null); setFormOpen(true); }}
        onEditar={handleEditar}
        onEliminar={(id) => setMedicamentoEliminar(id)}
      />

      <MedicamentoForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setMedicamentoEditar(null); }}
        onSubmit={handleSubmit}
        medicamentoEditar={medicamentoEditar}
      />

      <ConfirmDialog
        open={!!medicamentoEliminar}
        onOpenChange={(open) => !open && setMedicamentoEliminar(null)}
        onConfirm={handleEliminar}
        title="¿Eliminar medicamento?"
        description="El medicamento quedará inactivo en el sistema."
      />
    </div>
  );
}
