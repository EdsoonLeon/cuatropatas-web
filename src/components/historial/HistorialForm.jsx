import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

const formInicial = {
  tipoConsulta: '',
  descripcion: '',
  diagnostico: '',
  tratamiento: '',
  idVeterinario: '',
};

export default function HistorialForm({ open, onOpenChange, onSubmit, idMascota, veterinarios = [] }) {
  const [form, setForm] = useState(formInicial);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        idMascota: Number(idMascota),
        idVeterinario: Number(form.idVeterinario),
        tipoRegistro: form.tipoConsulta,
        descripcion: form.descripcion,
        diagnostico: form.diagnostico || undefined,
        tratamiento: form.tratamiento || undefined,
      });
      onOpenChange(false);
      setForm(formInicial);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Registro de Historial</DialogTitle>
          <DialogDescription>Registra la consulta o procedimiento médico</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Consulta</Label>
              <Select value={form.tipoConsulta} onValueChange={(v) => setForm({ ...form, tipoConsulta: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta">Consulta General</SelectItem>
                  <SelectItem value="Vacunación">Vacunación</SelectItem>
                  <SelectItem value="Cirugía">Cirugía</SelectItem>
                  <SelectItem value="Control">Control</SelectItem>
                  <SelectItem value="Emergencia">Emergencia</SelectItem>
                  <SelectItem value="Desparasitación">Desparasitación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Veterinario</Label>
              <Select value={form.idVeterinario} onValueChange={(v) => setForm({ ...form, idVeterinario: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {veterinarios.map((v) => (
                    <SelectItem key={v.idVeterinario} value={String(v.idVeterinario)}>
                      {v.nombre} {v.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea value={form.descripcion} onChange={set('descripcion')} placeholder="Describe el motivo de la consulta..." className="rounded-xl resize-none" rows={2} required />
          </div>
          <div className="space-y-2">
            <Label>Diagnóstico</Label>
            <Textarea value={form.diagnostico} onChange={set('diagnostico')} placeholder="Describe el diagnóstico..." className="rounded-xl resize-none" rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Tratamiento</Label>
            <Textarea value={form.tratamiento} onChange={set('tratamiento')} placeholder="Describe el tratamiento indicado..." className="rounded-xl resize-none" rows={2} />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary">
              {loading ? 'Guardando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
