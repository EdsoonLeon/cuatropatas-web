import { useState } from 'react';
import { Users, Search, Plus, Edit, Phone, Mail } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import EmptyState from '../shared/EmptyState';

export default function ClientesList({ clientes, onNuevo, onEditar }) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = clientes.filter((c) =>
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.dni?.includes(busqueda)
  );

  return (
    <Card className="p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 rounded-xl bg-input-background"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="rounded-lg">{filtrados.length} clientes</Badge>
          <Button className="rounded-xl bg-primary text-primary-foreground" onClick={onNuevo}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState title="No se encontraron clientes" icon={Users} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((cliente) => (
              <TableRow key={cliente.idCliente}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-secondary/20 text-secondary-foreground">
                        {cliente.nombre?.[0]}{cliente.apellido?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{cliente.nombre} {cliente.apellido}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{cliente.dni || '-'}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {cliente.email && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span>{cliente.email}</span>
                      </div>
                    )}
                    {cliente.telefono && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span>{cliente.telefono}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{cliente.direccion || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => onEditar?.(cliente)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
