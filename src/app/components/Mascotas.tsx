import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Search, Edit, Trash2, FileText, PawPrint } from "lucide-react";

const mascotasData = [
  { id: 1, nombre: "Max", especie: "Perro", raza: "Golden Retriever", edad: "3 años", dueño: "Juan Pérez", estado: "Saludable" },
  { id: 2, nombre: "Luna", especie: "Gato", raza: "Siamés", edad: "2 años", dueño: "María García", estado: "Tratamiento" },
  { id: 3, nombre: "Rocky", especie: "Perro", raza: "Bulldog", edad: "5 años", dueño: "Carlos López", estado: "Saludable" },
  { id: 4, nombre: "Milo", especie: "Gato", raza: "Persa", edad: "1 año", dueño: "Ana Martínez", estado: "Control" },
  { id: 5, nombre: "Bella", especie: "Perro", raza: "Labrador", edad: "4 años", dueño: "Luis Rodríguez", estado: "Saludable" },
];

export function Mascotas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredMascotas = mascotasData.filter((mascota) =>
    mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mascota.dueño.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Saludable":
        return "bg-green-100 text-green-700 border-green-200";
      case "Tratamiento":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Control":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mascotas</h1>
          <p className="text-muted-foreground">Gestiona el registro de todas las mascotas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Mascota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Mascota</DialogTitle>
              <DialogDescription>
                Completa la información de la mascota para registrarla en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la mascota</Label>
                <Input id="nombre" placeholder="Ej: Max" className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="especie">Especie</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perro">Perro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                      <SelectItem value="ave">Ave</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raza">Raza</Label>
                  <Input id="raza" placeholder="Ej: Golden Retriever" className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edad">Edad</Label>
                  <Input id="edad" placeholder="Ej: 3 años" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="macho">Macho</SelectItem>
                      <SelectItem value="hembra">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueño">Dueño</Label>
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
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                Cancelar
              </Button>
              <Button className="rounded-xl bg-primary" onClick={() => setIsDialogOpen(false)}>
                Registrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o dueño..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl bg-input-background"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="rounded-lg">
              {filteredMascotas.length} mascotas
            </Badge>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mascota</TableHead>
              <TableHead>Especie</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Dueño</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMascotas.map((mascota) => (
              <TableRow key={mascota.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <PawPrint className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{mascota.nombre}</span>
                  </div>
                </TableCell>
                <TableCell>{mascota.especie}</TableCell>
                <TableCell className="text-muted-foreground">{mascota.raza}</TableCell>
                <TableCell>{mascota.edad}</TableCell>
                <TableCell>{mascota.dueño}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(mascota.estado)} rounded-lg`}>
                    {mascota.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-lg text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
