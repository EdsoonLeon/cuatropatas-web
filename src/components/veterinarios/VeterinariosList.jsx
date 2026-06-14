import { useState } from 'react';
import { Stethoscope, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import { Search } from 'lucide-react';
import EmptyState from '../shared/EmptyState';

export default function VeterinariosList({ veterinarios, onNuevo, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = veterinarios.filter((v) =>
    `${v.nombre} ${v.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.especialidad?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Card className="p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar veterinario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 rounded-xl bg-input-background"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="rounded-lg">{filtrados.length} veterinarios</Badge>
          <Button className="rounded-xl bg-primary text-primary-foreground" onClick={onNuevo}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Veterinario
          </Button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState title="No se encontraron veterinarios" icon={Stethoscope} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Veterinario</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((vet) => (
              <TableRow key={vet.idVeterinario}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {vet.nombre?.[0]}{vet.apellido?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-medium">Dr. {vet.nombre} {vet.apellido}</p>
                  </div>
                </TableCell>
                <TableCell>{vet.especialidad || '-'}</TableCell>
                <TableCell className="text-muted-foreground">{vet.email || '-'}</TableCell>
                <TableCell>{vet.telefono || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => onEditar?.(vet)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-lg text-destructive" onClick={() => onEliminar?.(vet.idVeterinario)}>
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
