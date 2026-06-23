import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';

const INICIAL = { idMascota: '', idVeterinario: '', fechaHora: '', duracionMinutos: 30, motivo: '' };

export default function CitaForm({ open, onOpenChange, onSubmit, mascotas = [], veterinarios = [] }) {
  const [form, setForm] = useState(INICIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.idMascota) e.idMascota = 'Selecciona una mascota';
    if (!form.idVeterinario) e.idVeterinario = 'Selecciona un veterinario';
    if (!form.fechaHora) e.fechaHora = 'Elige la fecha y hora';
    if (!form.motivo.trim()) e.motivo = 'El motivo es requerido';
    else if (form.motivo.trim().length < 5) e.motivo = 'El motivo debe tener al menos 5 caracteres';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        idMascota: Number(form.idMascota),
        idVeterinario: Number(form.idVeterinario),
        duracionMinutos: Number(form.duracionMinutos),
      });
      onOpenChange(false);
      setForm(INICIAL);
    } catch (err) {
      const data = err.response?.data;
      let msg = 'No se pudo crear la cita';
      if (data?.message) msg = data.message;
      else if (data?.errors) msg = Object.values(data.errors).flat().join('. ');
      else if (data?.title) msg = data.title;
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) { setForm(INICIAL); setErrors({}); setSubmitError(''); }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Agendar Nueva Cita</DialogTitle>
          <DialogDescription>Completa la información para registrar una nueva cita</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Mascota</Label>
            <Select value={form.idMascota} onValueChange={(v) => setForm({ ...form, idMascota: v })}>
              <SelectTrigger className={`rounded-xl ${errors.idMascota ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Seleccionar mascota" />
              </SelectTrigger>
              <SelectContent>
                {mascotas.map((m) => (
                  <SelectItem key={m.idMascota} value={String(m.idMascota)}>
                    {m.nombre} — {m.especie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.idMascota && <p className="text-xs text-red-500">{errors.idMascota}</p>}
          </div>

          <div className="space-y-2">
            <Label>Veterinario</Label>
            <Select value={form.idVeterinario} onValueChange={(v) => setForm({ ...form, idVeterinario: v })}>
              <SelectTrigger className={`rounded-xl ${errors.idVeterinario ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Seleccionar veterinario" />
              </SelectTrigger>
              <SelectContent>
                {veterinarios.map((v) => (
                  <SelectItem key={v.idVeterinario} value={String(v.idVeterinario)}>
                    {v.nombre} {v.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.idVeterinario && <p className="text-xs text-red-500">{errors.idVeterinario}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha y Hora</Label>
              <Input
                type="datetime-local"
                value={form.fechaHora}
                onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
                className={`rounded-xl ${errors.fechaHora ? 'border-red-500' : ''}`}
              />
              {errors.fechaHora && <p className="text-xs text-red-500">{errors.fechaHora}</p>}
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
            <Label>Motivo <span className="text-muted-foreground text-xs">(mínimo 5 caracteres)</span></Label>
            <Textarea
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              placeholder="Describe el motivo de la consulta..."
              className={`rounded-xl resize-none ${errors.motivo ? 'border-red-500' : ''}`}
              rows={3}
            />
            {errors.motivo && <p className="text-xs text-red-500">{errors.motivo}</p>}
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="rounded-xl">
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
