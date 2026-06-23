import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

const INICIAL = {
  tipoConsulta: '',
  descripcion: '',
  diagnostico: '',
  tratamiento: '',
  idVeterinario: '',
};

export default function HistorialForm({ open, onOpenChange, onSubmit, idMascota, veterinarios = [] }) {
  const [form, setForm] = useState(INICIAL);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) { setForm(INICIAL); setErrors({}); setSubmitError(''); }
  }, [open]);

  const validate = () => {
    const e = {};
    if (!form.tipoConsulta) e.tipoConsulta = 'Selecciona el tipo de consulta';
    if (!form.idVeterinario) e.idVeterinario = 'Selecciona el veterinario';
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es requerida';
    else if (form.descripcion.trim().length < 5) e.descripcion = 'La descripción debe tener al menos 5 caracteres';
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
        idMascota: Number(idMascota),
        idVeterinario: Number(form.idVeterinario),
        tipoRegistro: form.tipoConsulta,
        descripcion: form.descripcion,
        diagnostico: form.diagnostico || undefined,
        tratamiento: form.tratamiento || undefined,
      });
      onOpenChange(false);
      setForm(INICIAL);
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      let msg = 'No se pudo guardar el registro';
      if (status === 403) msg = 'No tienes permiso para registrar historial (requiere rol Veterinario o Administrador)';
      else if (status === 401) msg = 'Sesión expirada, vuelve a iniciar sesión';
      else if (data?.message) msg = data.message;
      else if (data?.errors) msg = Object.values(data.errors).flat().join('. ');
      else if (data?.title) msg = data.title;
      setSubmitError(msg);
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
                <SelectTrigger className={`rounded-xl ${errors.tipoConsulta ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta">Consulta General</SelectItem>
                  <SelectItem value="Vacuna">Vacunación</SelectItem>
                  <SelectItem value="Cirugia">Cirugía</SelectItem>
                  <SelectItem value="Diagnostico">Diagnóstico</SelectItem>
                  <SelectItem value="Tratamiento">Tratamiento</SelectItem>
                  <SelectItem value="Observacion">Observación / Control</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoConsulta && <p className="text-xs text-red-500">{errors.tipoConsulta}</p>}
            </div>
            <div className="space-y-2">
              <Label>Veterinario</Label>
              <Select value={form.idVeterinario} onValueChange={(v) => setForm({ ...form, idVeterinario: v })}>
                <SelectTrigger className={`rounded-xl ${errors.idVeterinario ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={veterinarios.length === 0 ? 'Sin veterinarios' : 'Seleccionar'} />
                </SelectTrigger>
                <SelectContent>
                  {veterinarios.length === 0 && (
                    <SelectItem value="__none__" disabled>No hay veterinarios registrados</SelectItem>
                  )}
                  {veterinarios.map((v) => (
                    <SelectItem key={v.idVeterinario} value={String(v.idVeterinario)}>
                      {v.nombre} {v.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.idVeterinario && <p className="text-xs text-red-500">{errors.idVeterinario}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción <span className="text-muted-foreground text-xs">(mínimo 5 caracteres)</span></Label>
            <Textarea
              value={form.descripcion}
              onChange={set('descripcion')}
              placeholder="Describe el motivo de la consulta..."
              className={`rounded-xl resize-none ${errors.descripcion ? 'border-red-500' : ''}`}
              rows={2}
            />
            {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
          </div>

          <div className="space-y-2">
            <Label>Diagnóstico <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Textarea
              value={form.diagnostico}
              onChange={set('diagnostico')}
              placeholder="Describe el diagnóstico..."
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Tratamiento <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Textarea
              value={form.tratamiento}
              onChange={set('tratamiento')}
              placeholder="Describe el tratamiento indicado..."
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-primary">
              {loading ? 'Guardando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
