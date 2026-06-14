import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  PawPrint,
  Syringe,
  Stethoscope,
  Pill,
  FileText,
  Plus,
  Calendar,
  User,
} from "lucide-react";

const mascotaSeleccionada = {
  nombre: "Max",
  especie: "Perro",
  raza: "Golden Retriever",
  edad: "3 años",
  peso: "28 kg",
  dueño: "Juan Pérez",
  foto: "M",
};

const vacunas = [
  { id: 1, nombre: "Rabia", fecha: "2025-12-10", proxima: "2026-12-10", veterinario: "Dr. Rodriguez" },
  { id: 2, nombre: "Parvovirus", fecha: "2025-11-15", proxima: "2026-11-15", veterinario: "Dr. Rodriguez" },
  { id: 3, nombre: "Moquillo", fecha: "2025-10-20", proxima: "2026-10-20", veterinario: "Dra. López" },
];

const diagnosticos = [
  { id: 1, fecha: "2026-04-15", titulo: "Infección de oído leve", veterinario: "Dr. Rodriguez", descripcion: "Tratamiento con antibióticos durante 7 días" },
  { id: 2, fecha: "2026-02-10", titulo: "Control de rutina", veterinario: "Dra. López", descripcion: "Estado general excelente, todas las vacunas al día" },
  { id: 3, fecha: "2025-12-01", titulo: "Lesión en pata", veterinario: "Dr. Sánchez", descripcion: "Tratamiento con antiinflamatorios y reposo" },
];

const tratamientos = [
  { id: 1, medicamento: "Amoxicilina", dosis: "250mg cada 12h", duracion: "7 días", fecha: "2026-04-15" },
  { id: 2, medicamento: "Ibuprofeno", dosis: "100mg cada 8h", duracion: "5 días", fecha: "2025-12-01" },
];

export function HistorialMedico() {
  const [selectedPet, setSelectedPet] = useState("max");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Historial Médico</h1>
          <p className="text-muted-foreground">Registro completo de salud de las mascotas</p>
        </div>

        <Select value={selectedPet} onValueChange={setSelectedPet}>
          <SelectTrigger className="w-64 rounded-xl">
            <SelectValue placeholder="Seleccionar mascota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="max">Max - Golden Retriever</SelectItem>
            <SelectItem value="luna">Luna - Siamés</SelectItem>
            <SelectItem value="rocky">Rocky - Bulldog</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pet Info Card */}
      <Card className="p-6 rounded-2xl">
        <div className="flex items-start space-x-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
              <PawPrint className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{mascotaSeleccionada.nombre}</h2>
                <p className="text-muted-foreground">
                  {mascotaSeleccionada.raza} • {mascotaSeleccionada.especie}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200 rounded-lg">
                Saludable
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Edad</p>
                <p className="font-semibold">{mascotaSeleccionada.edad}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Peso</p>
                <p className="font-semibold">{mascotaSeleccionada.peso}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Dueño</p>
                <p className="font-semibold">{mascotaSeleccionada.dueño}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">ID</p>
                <p className="font-semibold">#VET001</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="vacunas" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="vacunas" className="rounded-lg">
            <Syringe className="w-4 h-4 mr-2" />
            Vacunas
          </TabsTrigger>
          <TabsTrigger value="diagnosticos" className="rounded-lg">
            <Stethoscope className="w-4 h-4 mr-2" />
            Diagnósticos
          </TabsTrigger>
          <TabsTrigger value="tratamientos" className="rounded-lg">
            <Pill className="w-4 h-4 mr-2" />
            Tratamientos
          </TabsTrigger>
          <TabsTrigger value="observaciones" className="rounded-lg">
            <FileText className="w-4 h-4 mr-2" />
            Observaciones
          </TabsTrigger>
        </TabsList>

        {/* Vacunas Tab */}
        <TabsContent value="vacunas" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registro de Vacunación</h3>
            <Button className="rounded-xl bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Vacuna
            </Button>
          </div>

          <div className="grid gap-4">
            {vacunas.map((vacuna) => (
              <Card key={vacuna.id} className="p-5 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Syringe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{vacuna.nombre}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Aplicada: {vacuna.fecha}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{vacuna.veterinario}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-lg">
                    Próxima: {vacuna.proxima}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Diagnósticos Tab */}
        <TabsContent value="diagnosticos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Historial de Diagnósticos</h3>
            <Button className="rounded-xl bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Diagnóstico
            </Button>
          </div>

          <div className="grid gap-4">
            {diagnosticos.map((diagnostico) => (
              <Card key={diagnostico.id} className="p-5 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-secondary/10">
                    <Stethoscope className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{diagnostico.titulo}</h4>
                      <span className="text-sm text-muted-foreground">{diagnostico.fecha}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{diagnostico.descripcion}</p>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{diagnostico.veterinario}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tratamientos Tab */}
        <TabsContent value="tratamientos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tratamientos Activos</h3>
            <Button className="rounded-xl bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Prescribir Medicamento
            </Button>
          </div>

          <div className="grid gap-4">
            {tratamientos.map((tratamiento) => (
              <Card key={tratamiento.id} className="p-5 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <Pill className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{tratamiento.medicamento}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Dosis</p>
                        <p className="font-medium">{tratamiento.dosis}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Duración</p>
                        <p className="font-medium">{tratamiento.duracion}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Fecha inicio</p>
                        <p className="font-medium">{tratamiento.fecha}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Observaciones Tab */}
        <TabsContent value="observaciones" className="space-y-4">
          <Card className="p-6 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4">Agregar Observación</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Comportamiento después de tratamiento"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacion">Observación</Label>
                <Textarea
                  id="observacion"
                  placeholder="Escribe las observaciones detalladas..."
                  className="rounded-xl resize-none"
                  rows={6}
                />
              </div>
              <Button className="rounded-xl bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Guardar Observación
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
