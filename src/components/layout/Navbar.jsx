import { Search, Bell, Menu, Check, CheckCheck, Clock } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { useAuth } from '../../context/AuthContext';
import { useNotificaciones } from '../../hooks/useNotificaciones';

const TIPO_COLORS = {
  Recordatorio: 'bg-blue-100 text-blue-700',
  Confirmacion: 'bg-green-100 text-green-700',
  Cancelacion: 'bg-red-100 text-red-700',
  StockBajo: 'bg-amber-100 text-amber-700',
  General: 'bg-gray-100 text-gray-700',
};

function formatRelativo(fecha) {
  const diff = Date.now() - new Date(fecha).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'ahora mismo';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} día${d > 1 ? 's' : ''}`;
}

export default function Navbar({ onToggleSidebar }) {
  const { usuario } = useAuth();
  const { notificaciones, noLeidas, loading, marcarLeida, marcarTodasLeidas } = useNotificaciones();

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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl relative">
              <Bell className="w-5 h-5" />
              {noLeidas > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  {noLeidas > 9 ? '9+' : noLeidas}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0 rounded-2xl shadow-xl" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-sm">Notificaciones</h3>
              {noLeidas > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 rounded-lg"
                  onClick={marcarTodasLeidas}
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Marcar todas leídas
                </Button>
              )}
            </div>

            <ScrollArea className="max-h-[400px]">
              {loading && notificaciones.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">Cargando...</p>
              )}
              {!loading && notificaciones.length === 0 && (
                <div className="flex flex-col items-center py-10 text-muted-foreground">
                  <Bell className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">Sin notificaciones</p>
                </div>
              )}
              {notificaciones.map((n, i) => (
                <div key={n.idNotificacion}>
                  <div
                    className={`flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${!n.leida ? 'bg-muted/20' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TIPO_COLORS[n.tipo] || TIPO_COLORS.General}`}>
                          {n.tipo}
                        </span>
                        {!n.leida && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm leading-snug line-clamp-2">{n.mensaje}</p>
                      <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="text-[11px]">{formatRelativo(n.fechaProgramada)}</span>
                      </div>
                    </div>
                    {!n.leida && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 rounded-lg"
                        onClick={() => marcarLeida(n.idNotificacion)}
                        title="Marcar como leída"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  {i < notificaciones.length - 1 && <Separator />}
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>

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
