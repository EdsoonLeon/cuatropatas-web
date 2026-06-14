import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

const formInicial = {
  nombre: '',
  especie: '',
  raza: '',
  fechaNacimiento: '',
  sexo: '',
  peso: '',
  color: '',
  idCliente: '',
};

export default function MascotaForm({ open, onOpenChange, onSubmit, clientes = [], mascotaEditar }) {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mascotaEditar) {
      setForm({
        nombre: mascotaEditar.nombre || '',
        especie: mascotaEditar.especie || '',
        raza: mascotaEditar.raza || '',
        fechaNacimiento: mascotaEditar.fechaNacimiento?.split('T')[0] || '',
        sexo: mascotaEditar.sexo || '',
        peso: mascotaEditar.peso || '',
        color: mascotaEditar.color || '',
        idCliente: String(mascotaEditar.idCliente || ''),
      });
    } else {
      setForm(formInicial);
    }
  }, [mascotaEditar, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        peso: form.peso ? Number(form.peso) : undefined,
        idCliente: form.idCliente ? Number(form.idCliente) : undefined,
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{mascotaEditar ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</DialogTitle>
          <DialogDescription>
            Completa la información de la mascota
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Max"
              className="rounded-xl"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Especie</Label>
              <Select value={form.especie} onValueChange={(v) => setForm({ ...form, especie: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Ave">Ave</SelectItem>
                  <SelectItem value="Conejo">Conejo</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Raza</Label>
              <Input
                value={form.raza}
                onChange={(e) => setForm({ ...form, raza: e.target.value })}
                placeholder="Ej: Golden Retriever"
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <Input
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Sexo</Label>
              <Select value={form.sexo} onValueChange={(v) => setForm({ ...form, sexo: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Macho</SelectItem>
                  <SelectItem value="F">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.peso}
                onChange={(e) => setForm({ ...form, peso: e.target.value })}
                placeholder="Ej: 5.5"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Ej: Dorado"
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Dueño</Label>
            <Select value={form.idCliente} onValueChange={(v) => setForm({ ...form, idCliente: v })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c.idCliente} value={String(c.idCliente)}>
                    {c.nombre} {c.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary">
              {loading ? 'Guardando...' : (mascotaEditar ? 'Actualizar' : 'Registrar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
