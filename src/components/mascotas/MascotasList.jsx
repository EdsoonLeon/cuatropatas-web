import { useState } from 'react';
import { PawPrint, Search, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import EmptyState from '../shared/EmptyState';

export default function MascotasList({ mascotas, clientes = [], onNueva, onEditar, onEliminar, onVerHistorial }) {
  const getNombreCliente = (idCliente) => {
    const c = clientes.find((c) => c.idCliente === idCliente);
    return c ? `${c.nombre} ${c.apellido}` : `Cliente #${idCliente}`;
  };
  const [busqueda, setBusqueda] = useState('');

  const filtradas = mascotas.filter((m) =>
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.especie?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Card className="p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, dueño o especie..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 rounded-xl bg-input-background"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="rounded-lg">{filtradas.length} mascotas</Badge>
          <Button className="rounded-xl bg-primary text-primary-foreground" onClick={onNueva}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Mascota
          </Button>
        </div>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState
          title="No se encontraron mascotas"
          description="Registra la primera mascota usando el botón de arriba"
          icon={PawPrint}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mascota</TableHead>
              <TableHead>Especie / Raza</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Dueño</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.map((mascota) => (
              <TableRow key={mascota.idMascota}>
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
                <TableCell>
                  <div>
                    <p>{mascota.especie}</p>
                    <p className="text-xs text-muted-foreground">{mascota.raza}</p>
                  </div>
                </TableCell>
                <TableCell>{mascota.sexo === 'M' ? 'Macho' : mascota.sexo === 'F' ? 'Hembra' : '-'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {getNombreCliente(mascota.idCliente)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => onVerHistorial?.(mascota)}>
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => onEditar?.(mascota)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-lg text-destructive" onClick={() => onEliminar?.(mascota.idMascota)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
