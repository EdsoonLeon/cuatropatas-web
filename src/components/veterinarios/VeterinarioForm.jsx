import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

const formInicial = { nombre: '', apellido: '', especialidad: '', telefono: '', email: '' };

export default function VeterinarioForm({ open, onOpenChange, onSubmit, veterinarioEditar }) {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (veterinarioEditar) {
      setForm({
        nombre: veterinarioEditar.nombre || '',
        apellido: veterinarioEditar.apellido || '',
        especialidad: veterinarioEditar.especialidad || '',
        telefono: veterinarioEditar.telefono || '',
        email: veterinarioEditar.email || '',
      });
    } else {
      setForm(formInicial);
    }
  }, [veterinarioEditar, open]);

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
          <DialogTitle>{veterinarioEditar ? 'Editar Veterinario' : 'Registrar Veterinario'}</DialogTitle>
          <DialogDescription>Completa los datos del veterinario</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={set('nombre')} placeholder="Nombre" className="rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input value={form.apellido} onChange={set('apellido')} placeholder="Apellido" className="rounded-xl" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Especialidad</Label>
            <Input value={form.especialidad} onChange={set('especialidad')} placeholder="Ej: Cirugía General" className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={form.telefono} onChange={set('telefono')} placeholder="999 999 999" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={set('email')} placeholder="vet@clinica.com" className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary">
              {loading ? 'Guardando...' : (veterinarioEditar ? 'Actualizar' : 'Registrar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
