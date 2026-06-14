import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

export default function StockAlertBadge({ stock, stockMinimo = 10 }) {
  if (stock <= 0) {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 rounded-lg flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Sin stock
      </Badge>
    );
  }
  if (stock <= stockMinimo) {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 rounded-lg flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Stock bajo ({stock})
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-700 border-green-200 rounded-lg">
      {stock} unidades
    </Badge>
  );
}
