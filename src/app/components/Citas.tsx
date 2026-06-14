import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Plus, Clock, User, PawPrint } from "lucide-react";

const citasData = [
  { id: 1, mascota: "Max", cliente: "Juan Pérez", veterinario: "Dr. Rodriguez", hora: "09:00 AM", fecha: "2026-05-22", motivo: "Consulta General", estado: "Confirmada" },
  { id: 2, mascota: "Luna", cliente: "María García", veterinario: "Dra. López", hora: "10:30 AM", fecha: "2026-05-22", motivo: "Vacunación", estado: "Pendiente" },
  { id: 3, mascota: "Rocky", cliente: "Carlos López", veterinario: "Dr. Rodriguez", hora: "11:00 AM", fecha: "2026-05-22", motivo: "Control", estado: "Confirmada" },
  { id: 4, mascota: "Milo", cliente: "Ana Martínez", veterinario: "Dr. Sánchez", hora: "02:00 PM", fecha: "2026-05-22", motivo: "Emergencia", estado: "Completada" },
  { id: 5, mascota: "Bella", cliente: "Luis Rodríguez", veterinario: "Dra. López", hora: "03:30 PM", fecha: "2026-05-22", motivo: "Cirugía", estado: "Cancelada" },
];

export function Citas() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Confirmada":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pendiente":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Completada":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelada":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Citas</h1>
          <p className="text-muted-foreground">Gestiona las citas veterinarias</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Agendar Nueva Cita</DialogTitle>
              <DialogDescription>
                Completa la información para registrar una nueva cita
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Juan Pérez</SelectItem>
                    <SelectItem value="2">María García</SelectItem>
                    <SelectItem value="3">Carlos López</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mascota">Mascota</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar mascota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Max - Perro</SelectItem>
                    <SelectItem value="2">Luna - Gato</SelectItem>
                    <SelectItem value="3">Rocky - Perro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="veterinario">Veterinario</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dr. Rodriguez</SelectItem>
                    <SelectItem value="2">Dra. López</SelectItem>
                    <SelectItem value="3">Dr. Sánchez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input id="fecha" type="date" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Input id="hora" type="time" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo">Motivo de la cita</Label>
                <Textarea
                  id="motivo"
                  placeholder="Describe el motivo de la consulta..."
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button className="rounded-xl bg-primary" onClick={() => setIsDialogOpen(false)}>
                Agendar Cita
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Calendario</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl"
          />
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5">
              <span className="text-sm">Hoy</span>
              <Badge className="bg-primary text-primary-foreground">5 citas</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <span className="text-sm">Esta semana</span>
              <Badge variant="outline">23 citas</Badge>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <Card className="xl:col-span-2 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Citas del Día</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="rounded-lg">
                {citasData.length} citas
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {citasData.map((cita) => (
              <div
                key={cita.id}
                className="p-5 rounded-xl border border-border hover:shadow-md transition-all bg-card"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">{cita.mascota}</h4>
                      <Badge className={`${getStatusColor(cita.estado)} rounded-lg text-xs`}>
                        {cita.estado}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{cita.cliente}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PawPrint className="w-4 h-4" />
                        <span>{cita.veterinario}</span>
                      </div>
                    </div>

                    <p className="text-sm">{cita.motivo}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2 text-primary">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{cita.hora}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        Editar
                      </Button>
                      <Button size="sm" className="rounded-lg bg-primary">
                        Ver
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
