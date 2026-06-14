import { TrendingUp } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function CitasChart({ data }) {
  return (
    <Card className="xl:col-span-2 p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Citas Mensuales</h3>
          <p className="text-sm text-muted-foreground">Resumen de actividad</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Tendencia</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCitas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5eead4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="citas"
            stroke="#5eead4"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCitas)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
