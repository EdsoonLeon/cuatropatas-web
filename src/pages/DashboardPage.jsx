import { PawPrint, Calendar, Users, Stethoscope } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import MetricCard from '../components/dashboard/MetricCard';
import CitasChart from '../components/dashboard/CitasChart';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';

function formatHora(fechaHora) {
  if (!fechaHora) return '';
  return new Intl.DateTimeFormat('es-PE', { timeStyle: 'short' }).format(new Date(fechaHora));
}

export default function DashboardPage() {
  const { data, loading, error, obtenerResumen } = useDashboard();
  const { usuario } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={obtenerResumen} />;

  const resumen = data || {};
  const chartData = resumen.citasPorMes || [
    { mes: 'Ene', citas: 0 }, { mes: 'Feb', citas: 0 }, { mes: 'Mar', citas: 0 },
    { mes: 'Abr', citas: 0 }, { mes: 'May', citas: 0 }, { mes: 'Jun', citas: 0 },
  ];
  const proximasCitas = resumen.proximasCitas || resumen.citasHoy || [];

  const nombreBienvenida = usuario?.nombreUsuario || usuario?.email || 'usuario';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido de vuelta, {nombreBienvenida}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Mascotas Atendidas"
          value={resumen.mascotasAtendidas ?? '-'}
          icon={PawPrint}
          trend="En el período"
          color="primary"
        />
        <MetricCard
          title="Total Citas"
          value={resumen.totalCitas ?? '-'}
          icon={Calendar}
          trend="En el período"
          color="secondary"
        />
        <MetricCard
          title="Citas Completadas"
          value={resumen.citasCompletadas ?? '-'}
          icon={Users}
          trend="Finalizadas"
          trendUp
          color="accent"
        />
        <MetricCard
          title="Stock Bajo"
          value={resumen.medicamentosBajoStock ?? '-'}
          icon={Stethoscope}
          trend="Medicamentos"
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CitasChart data={chartData} />

        <Card className="p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Agenda de Hoy</h3>
          {proximasCitas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No hay citas programadas para hoy</p>
          ) : (
            <div className="space-y-3">
              {proximasCitas.slice(0, 5).map((cita, i) => (
                <div key={cita.idCita || i} className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{cita.nombreMascota}</p>
                    <Badge variant="outline" className="text-xs">{formatHora(cita.fechaHora)}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cita.nombreCliente}
                  </p>
                  <p className="text-xs text-primary mt-1">{cita.motivo}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
