import { StatCard } from "./StatCard";
import { Card } from "./ui/card";
import { PawPrint, Calendar, Users, Stethoscope, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { mes: "Ene", citas: 45 },
  { mes: "Feb", citas: 52 },
  { mes: "Mar", citas: 61 },
  { mes: "Abr", citas: 58 },
  { mes: "May", citas: 70 },
  { mes: "Jun", citas: 75 },
];

const proximasCitas = [
  { id: 1, mascota: "Max", cliente: "Juan Pérez", hora: "09:00 AM", tipo: "Consulta General" },
  { id: 2, mascota: "Luna", cliente: "María García", hora: "10:30 AM", tipo: "Vacunación" },
  { id: 3, mascota: "Rocky", cliente: "Carlos López", hora: "11:00 AM", tipo: "Control" },
  { id: 4, mascota: "Milo", cliente: "Ana Martínez", hora: "02:00 PM", tipo: "Emergencia" },
];

const actividadReciente = [
  { id: 1, accion: "Nueva mascota registrada", detalle: "Max - Golden Retriever", tiempo: "Hace 5 min" },
  { id: 2, accion: "Cita completada", detalle: "Luna - Vacunación", tiempo: "Hace 15 min" },
  { id: 3, accion: "Historial actualizado", detalle: "Rocky - Control rutinario", tiempo: "Hace 1 hora" },
  { id: 4, accion: "Nuevo cliente", detalle: "Ana Martínez", tiempo: "Hace 2 horas" },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido de vuelta, Dr. Rodriguez</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Mascotas Registradas"
          value="247"
          icon={PawPrint}
          trend="+12% vs mes anterior"
          trendUp={true}
          color="primary"
        />
        <StatCard
          title="Citas Hoy"
          value="18"
          icon={Calendar}
          trend="4 pendientes"
          color="secondary"
        />
        <StatCard
          title="Clientes Activos"
          value="189"
          icon={Users}
          trend="+8% este mes"
          trendUp={true}
          color="accent"
        />
        <StatCard
          title="Veterinarios"
          value="5"
          icon={Stethoscope}
          trend="En servicio"
          color="success"
        />
      </div>

      {/* Chart and Appointments */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="xl:col-span-2 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Citas Mensuales</h3>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+15% crecimiento</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
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

        {/* Today's Schedule */}
        <Card className="p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Agenda de Hoy</h3>
          <div className="space-y-3">
            {proximasCitas.map((cita) => (
              <div key={cita.id} className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{cita.mascota}</p>
                  <Badge variant="outline" className="text-xs">{cita.hora}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{cita.cliente}</p>
                <p className="text-xs text-primary mt-1">{cita.tipo}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {actividadReciente.map((actividad) => (
            <div key={actividad.id} className="flex items-start space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <PawPrint className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{actividad.accion}</p>
                <p className="text-sm text-muted-foreground">{actividad.detalle}</p>
              </div>
              <span className="text-xs text-muted-foreground">{actividad.tiempo}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
