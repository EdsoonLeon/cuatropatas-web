import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

const formInicial = { nombre: '', apellido: '', telefono: '', email: '', dni: '', direccion: '' };

export default function ClienteForm({ open, onOpenChange, onSubmit, clienteEditar }) {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clienteEditar) {
      setForm({
        nombre: clienteEditar.nombre || '',
        apellido: clienteEditar.apellido || '',
        telefono: clienteEditar.telefono || '',
        email: clienteEditar.email || '',
        dni: clienteEditar.dni || '',
        direccion: clienteEditar.direccion || '',
      });
    } else {
      setForm(formInicial);
    }
  }, [clienteEditar, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{clienteEditar ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</DialogTitle>
          <DialogDescription>Completa la información del cliente</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={set('nombre')} placeholder="Juan" className="rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input value={form.apellido} onChange={set('apellido')} placeholder="Pérez" className="rounded-xl" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>DNI</Label>
              <Input value={form.dni} onChange={set('dni')} placeholder="12345678" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={form.telefono} onChange={set('telefono')} placeholder="999 999 999" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Correo electrónico</Label>
            <Input type="email" value={form.email} onChange={set('email')} placeholder="cliente@email.com" className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>Dirección</Label>
            <Input value={form.direccion} onChange={set('direccion')} placeholder="Av. Ejemplo 123" className="rounded-xl" />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary">
              {loading ? 'Guardando...' : (clienteEditar ? 'Actualizar' : 'Registrar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
