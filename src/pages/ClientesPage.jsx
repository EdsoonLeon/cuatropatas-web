import { useState } from 'react';
import ClientesList from '../components/clientes/ClientesList';
import ClienteForm from '../components/clientes/ClienteForm';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { useClientes } from '../hooks/useClientes';

export default function ClientesPage() {
  const { clientes, loading, error, obtenerTodos, crear, actualizar } = useClientes();
  const [formOpen, setFormOpen] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  const handleSubmit = async (datos) => {
    if (clienteEditar) {
      await actualizar(clienteEditar.idCliente, datos);
    } else {
      await crear(datos);
    }
    setClienteEditar(null);
  };

  const handleEditar = (cliente) => {
    setClienteEditar(cliente);
    setFormOpen(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={obtenerTodos} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Clientes</h1>
        <p className="text-muted-foreground">Gestiona el registro de clientes</p>
      </div>

      <ClientesList
        clientes={clientes}
        onNuevo={() => { setClienteEditar(null); setFormOpen(true); }}
        onEditar={handleEditar}
      />

      <ClienteForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setClienteEditar(null); }}
        onSubmit={handleSubmit}
        clienteEditar={clienteEditar}
      />
    </div>
  );
}
