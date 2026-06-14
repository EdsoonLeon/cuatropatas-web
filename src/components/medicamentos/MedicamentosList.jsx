import { useState } from 'react';
import { Pill, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/app/components/ui/table';
import StockAlertBadge from './StockAlertBadge';
import EmptyState from '../shared/EmptyState';

export default function MedicamentosList({ medicamentos, onNuevo, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = medicamentos.filter((m) =>
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.tipo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatPrecio = (precio) =>
    new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(precio || 0);

  return (
    <Card className="p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar medicamento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 rounded-xl bg-input-background"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="rounded-lg">{filtrados.length} medicamentos</Badge>
          <Button className="rounded-xl bg-primary text-primary-foreground" onClick={onNuevo}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Medicamento
          </Button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState title="No se encontraron medicamentos" icon={Pill} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((med) => (
              <TableRow key={med.idMedicamento}>
                <TableCell>
                  <div>
                    <p className="font-medium">{med.nombre}</p>
                    {med.descripcion && <p className="text-xs text-muted-foreground">{med.descripcion}</p>}
                  </div>
                </TableCell>
                <TableCell>{med.tipo || '-'}</TableCell>
                <TableCell>{formatPrecio(med.precioUnitario)}</TableCell>
                <TableCell>
                  <StockAlertBadge stock={med.stock} stockMinimo={med.stockMinimo} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => onEditar?.(med)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-lg text-destructive" onClick={() => onEliminar?.(med.idMedicamento)}>
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
