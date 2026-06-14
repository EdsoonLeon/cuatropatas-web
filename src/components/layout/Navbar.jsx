import { Search, Bell, Menu } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const { usuario } = useAuth();

  const iniciales = usuario?.nombreUsuario
    ? usuario.nombreUsuario.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : usuario?.email?.[0]?.toUpperCase() || '';

  const nombreCompleto = usuario?.nombreUsuario || usuario?.email || '';

  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar mascotas, clientes, citas..."
            className="pl-10 rounded-xl bg-input-background border-border h-11"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{nombreCompleto}</p>
            <p className="text-xs text-muted-foreground">{usuario?.roles?.[0]}</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {iniciales}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
