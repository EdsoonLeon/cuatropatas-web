import { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

const NOTIF_KEY = 'cuatropatas_notificaciones';

const defaultNotif = {
  citas: true,
  stockBajo: true,
  nuevosClientes: false,
  recordatorios: true,
};

function Alert({ type, msg, onClose }) {
  if (!msg) return null;
  const isError = type === 'error';
  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm mt-3 ${isError ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-700'}`}>
      {isError ? <XCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="text-xs opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="font-medium text-sm">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

// ─── Perfil ──────────────────────────────────────────────────────────────────
function PerfilPanel({ usuario }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword)
      return setAlert({ type: 'error', msg: 'Las contraseñas nuevas no coinciden.' });
    if (form.newPassword.length < 6)
      return setAlert({ type: 'error', msg: 'La contraseña debe tener al menos 6 caracteres.' });
    setLoading(true);
    try {
      await authApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setAlert({ type: 'success', msg: 'Contraseña actualizada correctamente.' });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowForm(false);
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Error al cambiar la contraseña.' });
    } finally {
      setLoading(false);
    }
  };

  const roleColors = { Administrador: 'bg-red-100 text-red-700', Veterinario: 'bg-blue-100 text-blue-700', Cliente: 'bg-green-100 text-green-700' };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
          {(usuario?.nombreUsuario || usuario?.email || 'U')[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg">{usuario?.nombreUsuario || usuario?.email}</p>
          <p className="text-sm text-muted-foreground">{usuario?.email}</p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {usuario?.roles?.map((r) => (
              <span key={r} className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[r] || 'bg-muted text-muted-foreground'}`}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      <Alert type={alert?.type} msg={alert?.msg} onClose={() => setAlert(null)} />

      {!showForm ? (
        <Button variant="outline" className="rounded-xl w-full" onClick={() => setShowForm(true)}>
          Cambiar contraseña
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl border border-border">
          <p className="font-medium text-sm mb-2">Cambiar contraseña</p>
          <div className="space-y-1">
            <Label>Contraseña actual</Label>
            <div className="relative">
              <Input type={showPwd ? 'text' : 'password'} value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="rounded-xl pr-10" required />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Nueva contraseña</Label>
            <Input type="password" value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="rounded-xl" required minLength={6} />
          </div>
          <div className="space-y-1">
            <Label>Confirmar nueva contraseña</Label>
            <Input type="password" value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="rounded-xl" required />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="rounded-xl flex-1" onClick={() => { setShowForm(false); setAlert(null); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-xl flex-1 bg-primary">
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Notificaciones ───────────────────────────────────────────────────────────
function NotificacionesPanel() {
  const [notif, setNotif] = useState(() => {
    try { return { ...defaultNotif, ...JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}') }; }
    catch { return defaultNotif; }
  });
  const [saved, setSaved] = useState(false);

  const update = (key, val) => setNotif((prev) => ({ ...prev, [key]: val }));

  const guardar = () => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notif));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-2">
      <Toggle checked={notif.citas} onChange={(v) => update('citas', v)}
        label="Recordatorio de citas" description="Alerta cuando se acerquen citas del día" />
      <Toggle checked={notif.stockBajo} onChange={(v) => update('stockBajo', v)}
        label="Stock bajo de medicamentos" description="Aviso cuando un medicamento esté por agotarse" />
      <Toggle checked={notif.nuevosClientes} onChange={(v) => update('nuevosClientes', v)}
        label="Nuevos clientes registrados" description="Notificación al registrarse un nuevo cliente" />
      <Toggle checked={notif.recordatorios} onChange={(v) => update('recordatorios', v)}
        label="Recordatorios del sistema" description="Alertas generales de la aplicación" />
      <div className="pt-2">
        <Button onClick={guardar} className="rounded-xl w-full bg-primary">
          {saved ? '✓ Preferencias guardadas' : 'Guardar preferencias'}
        </Button>
      </div>
    </div>
  );
}

// ─── Seguridad ────────────────────────────────────────────────────────────────
function SeguridadPanel({ usuario }) {
  const roleInfo = {
    Administrador: { desc: 'Acceso total al sistema: gestión de usuarios, configuración y todos los módulos.', color: 'bg-red-100 text-red-700' },
    Veterinario:   { desc: 'Acceso a citas, historial médico, prescripciones y mascotas asignadas.', color: 'bg-blue-100 text-blue-700' },
    Cliente:       { desc: 'Acceso a sus propias mascotas y citas programadas.', color: 'bg-green-100 text-green-700' },
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Roles asignados</p>
        <div className="space-y-2">
          {usuario?.roles?.map((r) => {
            const info = roleInfo[r] || { desc: 'Rol del sistema.', color: 'bg-muted text-muted-foreground' };
            return (
              <div key={r} className="flex items-start gap-3 p-3 rounded-xl border border-border">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${info.color}`}>{r}</span>
                <p className="text-sm text-muted-foreground">{info.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-3 rounded-xl bg-muted/30 text-sm space-y-1">
        <p className="font-medium">Sesión activa</p>
        <p className="text-muted-foreground">ID de usuario: <span className="font-mono">{usuario?.idUsuario}</span></p>
        <p className="text-muted-foreground">Credencial: <span className="font-mono">{usuario?.email}</span></p>
        <p className="text-muted-foreground text-xs mt-1">Las sesiones expiran automáticamente por inactividad.</p>
      </div>
    </div>
  );
}

// ─── Sistema ──────────────────────────────────────────────────────────────────
function SistemaPanel() {
  const [apiStatus, setApiStatus] = useState('verificando...');

  useEffect(() => {
    authApi.me()
      .then(() => setApiStatus('Conectado'))
      .catch(() => setApiStatus('Sin conexión'));
  }, []);

  const info = [
    { label: 'Aplicación', value: 'CuatroPatas Veterinaria' },
    { label: 'Versión', value: '1.0.0' },
    { label: 'Frontend', value: 'React 19 + Vite 6' },
    { label: 'Backend', value: 'ASP.NET Core 9' },
    { label: 'Base de datos', value: 'SQL Server' },
    { label: 'Estado API', value: apiStatus },
  ];

  return (
    <div className="space-y-2">
      {info.map(({ label, value }) => (
        <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className={`font-medium ${value === 'Conectado' ? 'text-green-600' : value === 'Sin conexión' ? 'text-destructive' : ''}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
const secciones = [
  { id: 'perfil',         label: 'Perfil de Usuario',  icon: User,   color: 'bg-primary/10',    iconColor: 'text-primary',    desc: 'Tus datos y contraseña' },
  { id: 'notificaciones', label: 'Notificaciones',      icon: Bell,   color: 'bg-purple-100',    iconColor: 'text-purple-600', desc: 'Alertas y recordatorios' },
  { id: 'seguridad',      label: 'Seguridad',           icon: Shield, color: 'bg-green-100',     iconColor: 'text-green-600',  desc: 'Roles y acceso' },
  { id: 'sistema',        label: 'Sistema',             icon: Settings, color: 'bg-amber-100',  iconColor: 'text-amber-600',  desc: 'Información de la app' },
];

export default function ConfiguracionPage() {
  const { usuario } = useAuth();
  const [activo, setActivo] = useState(null);

  const toggle = (id) => setActivo((prev) => (prev === id ? null : id));

  const renderPanel = (id) => {
    switch (id) {
      case 'perfil':         return <PerfilPanel usuario={usuario} />;
      case 'notificaciones': return <NotificacionesPanel />;
      case 'seguridad':      return <SeguridadPanel usuario={usuario} />;
      case 'sistema':        return <SistemaPanel />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground">Administra tu perfil y preferencias del sistema</p>
      </div>

      <div className="space-y-3">
        {secciones.map(({ id, label, icon: Icon, color, iconColor, desc }) => (
          <Card key={id} className="rounded-2xl overflow-hidden">
            <button
              onClick={() => toggle(id)}
              className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
              <span className={`text-muted-foreground transition-transform ${activo === id ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {activo === id && (
              <div className="px-5 pb-5 border-t border-border pt-4">
                {renderPanel(id)}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
