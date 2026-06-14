import { Search, Bell, Menu } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center space-x-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
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

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Bell className="w-5 h-5" />
          </Button>
          <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Dr. Rodriguez</p>
            <p className="text-xs text-muted-foreground">Veterinario</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              DR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
