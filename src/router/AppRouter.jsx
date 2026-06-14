import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateRoute } from '../components/layout/PrivateRoute';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CitasPage from '../pages/CitasPage';
import MascotasPage from '../pages/MascotasPage';
import ClientesPage from '../pages/ClientesPage';
import VeterinariosPage from '../pages/VeterinariosPage';
import HistorialPage from '../pages/HistorialPage';
import MedicamentosPage from '../pages/MedicamentosPage';
import PrescripcionesPage from '../pages/PrescripcionesPage';
import PagosPage from '../pages/PagosPage';
import ConfiguracionPage from '../pages/ConfiguracionPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'citas', element: <CitasPage /> },
      { path: 'mascotas', element: <MascotasPage /> },
      {
        path: 'clientes',
        element: (
          <PrivateRoute roles={['Administrador', 'Recepcionista']}>
            <ClientesPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'veterinarios',
        element: (
          <PrivateRoute roles={['Administrador']}>
            <VeterinariosPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'historial',
        element: (
          <PrivateRoute roles={['Administrador', 'Veterinario']}>
            <HistorialPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'medicamentos',
        element: (
          <PrivateRoute roles={['Administrador', 'Veterinario', 'Recepcionista']}>
            <MedicamentosPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'prescripciones',
        element: (
          <PrivateRoute roles={['Administrador', 'Veterinario']}>
            <PrescripcionesPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'pagos',
        element: (
          <PrivateRoute roles={['Administrador', 'Recepcionista']}>
            <PagosPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'configuracion',
        element: (
          <PrivateRoute roles={['Administrador']}>
            <ConfiguracionPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
