import {
  LayoutDashboard,
  PawPrint,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Heart,
  ChevronLeft
} from "lucide-react";
import { cn } from "./ui/utils";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "mascotas", label: "Mascotas", icon: PawPrint },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "veterinarios", label: "Veterinarios", icon: Stethoscope },
  { id: "citas", label: "Citas", icon: Calendar },
  { id: "historial", label: "Historial Médico", icon: FileText },
  { id: "facturacion", label: "Facturación", icon: DollarSign },
  { id: "configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-20" : "w-72"
    )}>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="bg-primary rounded-xl p-2">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-xl font-bold text-sidebar-foreground">VetApp</span>}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <ChevronLeft className={cn(
            "w-5 h-5 transition-transform",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-sidebar-accent">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              DR
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Dr. Rodriguez</p>
              <p className="text-xs text-muted-foreground">Veterinario</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
