import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';

export default function CitaForm({ open, onOpenChange, onSubmit, mascotas = [], veterinarios = [] }) {
  const [form, setForm] = useState({
    idMascota: '',
    idVeterinario: '',
    fechaHora: '',
    duracionMinutos: 30,
    motivo: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        idMascota: Number(form.idMascota),
        idVeterinario: Number(form.idVeterinario),
        duracionMinutos: Number(form.duracionMinutos),
      });
      onOpenChange(false);
      setForm({ idMascota: '', idVeterinario: '', fechaHora: '', duracionMinutos: 30, motivo: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Agendar Nueva Cita</DialogTitle>
          <DialogDescription>Completa la información para registrar una nueva cita</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Mascota</Label>
            <Select value={form.idMascota} onValueChange={(v) => setForm({ ...form, idMascota: v })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Seleccionar mascota" />
              </SelectTrigger>
              <SelectContent>
                {mascotas.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.nombre} — {m.especie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Veterinario</Label>
            <Select value={form.idVeterinario} onValueChange={(v) => setForm({ ...form, idVeterinario: v })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Seleccionar veterinario" />
              </SelectTrigger>
              <SelectContent>
                {veterinarios.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.nombre} {v.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha y Hora</Label>
              <Input
                type="datetime-local"
                value={form.fechaHora}
                onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
                className="rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Duración (min)</Label>
              <Input
                type="number"
                value={form.duracionMinutos}
                onChange={(e) => setForm({ ...form, duracionMinutos: e.target.value })}
                className="rounded-xl"
                min={15}
                max={120}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Motivo</Label>
            <Textarea
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              placeholder="Describe el motivo de la consulta..."
              className="rounded-xl resize-none"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary">
              {loading ? 'Agendando...' : 'Agendar Cita'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
