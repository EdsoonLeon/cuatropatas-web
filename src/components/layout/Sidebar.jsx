import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PawPrint, Users, Stethoscope, Calendar,
  FileText, DollarSign, Settings, Heart, ChevronLeft,
  Pill, ClipboardList, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@/app/components/ui/utils';

const allMenuItems = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrador', 'Veterinario', 'Recepcionista', 'Cliente'] },
  { id: 'mascotas', path: '/mascotas', label: 'Mascotas', icon: PawPrint, roles: ['Administrador', 'Veterinario', 'Recepcionista', 'Cliente'] },
  { id: 'clientes', path: '/clientes', label: 'Clientes', icon: Users, roles: ['Administrador', 'Recepcionista'] },
  { id: 'veterinarios', path: '/veterinarios', label: 'Veterinarios', icon: Stethoscope, roles: ['Administrador'] },
  { id: 'citas', path: '/citas', label: 'Citas', icon: Calendar, roles: ['Administrador', 'Veterinario', 'Recepcionista', 'Cliente'] },
  { id: 'historial', path: '/historial', label: 'Historial Médico', icon: FileText, roles: ['Administrador', 'Veterinario'] },
  { id: 'medicamentos', path: '/medicamentos', label: 'Medicamentos', icon: Pill, roles: ['Administrador', 'Veterinario', 'Recepcionista'] },
  { id: 'prescripciones', path: '/prescripciones', label: 'Prescripciones', icon: ClipboardList, roles: ['Administrador', 'Veterinario'] },
  { id: 'pagos', path: '/pagos', label: 'Pagos', icon: DollarSign, roles: ['Administrador', 'Recepcionista'] },
  { id: 'configuracion', path: '/configuracion', label: 'Configuración', icon: Settings, roles: ['Administrador'] },
];

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout, hasRole } = useAuth();

  const menuItems = allMenuItems.filter(item => hasRole(item.roles));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const iniciales = usuario?.nombreUsuario
    ? usuario.nombreUsuario.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : usuario?.email?.[0]?.toUpperCase() || '';

  const nombreCompleto = usuario?.nombreUsuario || usuario?.email || '';

  return (
    <div className={cn(
      'bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300',
      collapsed ? 'w-20' : 'w-72'
    )}>
      <div className="p-6 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="bg-primary rounded-xl p-2 flex-shrink-0">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-xl font-bold text-sidebar-foreground">CuatroPatas</span>}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-sidebar-accent mb-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
              {iniciales}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{nombreCompleto}</p>
              <p className="text-xs text-muted-foreground truncate">{usuario?.roles?.[0]}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center rounded-xl text-destructive hover:bg-destructive/10 transition-colors',
            collapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-2'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
}
