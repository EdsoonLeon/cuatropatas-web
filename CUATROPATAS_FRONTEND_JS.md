# CuatroPatas — Implementación Frontend en JavaScript

> **REGLA NÚMERO 1 Y MÁS IMPORTANTE:**
> Todo el proyecto se implementa en **JavaScript puro**.
> Ningún archivo nuevo usa TypeScript.
> Extensiones: `.jsx` para componentes React, `.js` para lógica pura.
> No usar: `interface`, `type`, `: string`, `: number`, `<T>`, `as Tipo`, ni nada de TypeScript.

---

## CONTEXTO

Proyecto React + Vite para una clínica veterinaria llamada **CuatroPatas**.
Tiene un UI con datos en duro que necesito conectar a un backend real.

**Proyecto frontend:** `C:\VETERINARIA_WEB_BACKEND-FRONT\CuatroPatas.Front`
**Backend corriendo en:** `http://localhost:5000`
**Frontend corre en:** `http://localhost:5173`

### Lo que ya tiene el proyecto:
- React + Vite + Tailwind CSS
- shadcn/ui instalado — componentes en `src/app/components/ui/` (**NO TOCAR**)
- `App.tsx` con navegación por switch sin React Router
- Componentes con datos en duro: `LoginPage`, `Dashboard`, `Mascotas`, `Citas`, `HistorialMedico`
- **NO tiene:** React Router, Axios, Context, ni llamadas reales a la API

### Archivos existentes a renombrar:
```
src/app/App.tsx  →  src/app/App.jsx
src/main.tsx     →  src/main.jsx
```

---

## ESTRUCTURA DE CARPETAS

```
src/
├── api/
│   ├── axiosConfig.js
│   ├── authApi.js
│   ├── citaApi.js
│   ├── clienteApi.js
│   ├── mascotaApi.js
│   ├── veterinarioApi.js
│   ├── historialApi.js
│   ├── medicamentoApi.js
│   ├── prescripcionApi.js
│   ├── servicioApi.js
│   ├── pagoApi.js
│   └── dashboardApi.js
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useCitas.js
│   ├── useMascotas.js
│   ├── useClientes.js
│   ├── useVeterinarios.js
│   ├── useHistorial.js
│   ├── useMedicamentos.js
│   └── useDashboard.js
│
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── CitasPage.jsx
│   ├── MascotasPage.jsx
│   ├── ClientesPage.jsx
│   ├── VeterinariosPage.jsx
│   ├── HistorialPage.jsx
│   ├── MedicamentosPage.jsx
│   ├── PrescripcionesPage.jsx
│   ├── PagosPage.jsx
│   └── ConfiguracionPage.jsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── dashboard/
│   │   ├── MetricCard.jsx
│   │   └── CitasChart.jsx
│   ├── citas/
│   │   ├── CitasList.jsx
│   │   ├── CitaCard.jsx
│   │   └── CitaForm.jsx
│   ├── mascotas/
│   │   ├── MascotasList.jsx
│   │   ├── MascotaCard.jsx
│   │   └── MascotaForm.jsx
│   ├── clientes/
│   │   ├── ClientesList.jsx
│   │   └── ClienteForm.jsx
│   ├── veterinarios/
│   │   ├── VeterinariosList.jsx
│   │   └── VeterinarioForm.jsx
│   ├── historial/
│   │   ├── HistorialList.jsx
│   │   └── HistorialForm.jsx
│   ├── medicamentos/
│   │   ├── MedicamentosList.jsx
│   │   └── StockAlertBadge.jsx
│   └── shared/
│       ├── LoadingSpinner.jsx
│       ├── ErrorMessage.jsx
│       ├── ConfirmDialog.jsx
│       └── EmptyState.jsx
│
├── router/
│   └── AppRouter.jsx
│
├── app/
│   ├── App.jsx                  ← refactorizado
│   └── components/
│       └── ui/                  ← shadcn — NO TOCAR
│
├── styles/
│   └── index.css
└── main.jsx
```

---

## CÓDIGO BASE EN JAVASCRIPT

### axiosConfig.js
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Agrega el token JWT en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token expira (401), intenta renovarlo con el refresh token
// Si no puede renovar, manda al login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(
            'http://localhost:5000/api/auth/refresh-token',
            { refreshToken }
          );
          sessionStorage.setItem('accessToken', res.data.accessToken);
          sessionStorage.setItem('refreshToken', res.data.refreshToken);
          original.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(original);
        } catch {
          sessionStorage.clear();
          window.location.href = '/login';
        }
      } else {
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### AuthContext.jsx
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al iniciar la app, verificar si hay sesión activa
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      authApi.me()
        .then(({ data }) => setUsuario(data))
        .catch(() => sessionStorage.clear())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    const { data } = await authApi.login({ email, password });
    sessionStorage.setItem('accessToken', data.accessToken);
    sessionStorage.setItem('refreshToken', data.refreshToken);
    setUsuario({ email: data.email, roles: data.roles });
  };

  const logout = async () => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      await authApi.logout({ refreshToken });
    } finally {
      sessionStorage.clear();
      setUsuario(null);
    }
  };

  // Acepta un rol como string o un array de roles
  const hasRole = (roles) => {
    if (!usuario) return false;
    if (Array.isArray(roles)) return roles.some(r => usuario.roles.includes(r));
    return usuario.roles.includes(roles);
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      isLoading,
      isAuthenticated: !!usuario,
      login,
      logout,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
```

### PrivateRoute.jsx
```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';

// roles: string[] opcional — si no se pasa, solo verifica autenticación
export function PrivateRoute({ children, roles }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !hasRole(roles)) return <Navigate to="/" replace />;

  return children;
}
```

### AppRouter.jsx
```javascript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PrivateRoute } from '../components/layout/PrivateRoute';
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
    element: <PrivateRoute><DashboardPage /></PrivateRoute>,
  },
  {
    path: '/citas',
    element: <PrivateRoute><CitasPage /></PrivateRoute>,
  },
  {
    path: '/mascotas',
    element: <PrivateRoute><MascotasPage /></PrivateRoute>,
  },
  {
    path: '/clientes',
    element: <PrivateRoute roles={['Administrador','Recepcionista']}><ClientesPage /></PrivateRoute>,
  },
  {
    path: '/veterinarios',
    element: <PrivateRoute roles={['Administrador']}><VeterinariosPage /></PrivateRoute>,
  },
  {
    path: '/historial',
    element: <PrivateRoute roles={['Administrador','Veterinario']}><HistorialPage /></PrivateRoute>,
  },
  {
    path: '/medicamentos',
    element: <PrivateRoute roles={['Administrador','Veterinario','Recepcionista']}><MedicamentosPage /></PrivateRoute>,
  },
  {
    path: '/prescripciones',
    element: <PrivateRoute roles={['Administrador','Veterinario']}><PrescripcionesPage /></PrivateRoute>,
  },
  {
    path: '/pagos',
    element: <PrivateRoute roles={['Administrador','Recepcionista']}><PagosPage /></PrivateRoute>,
  },
  {
    path: '/configuracion',
    element: <PrivateRoute roles={['Administrador']}><ConfiguracionPage /></PrivateRoute>,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### Ejemplo de hook — useCitas.js
```javascript
import { useState, useEffect } from 'react';
import { citaApi } from '../api/citaApi';

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTodas = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await citaApi.getAll();
      setCitas(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado, observaciones) => {
    try {
      await citaApi.changeStatus(id, { estado, observaciones });
      await obtenerTodas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const cancelar = async (id, motivo) => {
    try {
      await citaApi.cancel(id, { motivoCancelacion: motivo });
      await obtenerTodas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar cita');
    }
  };

  useEffect(() => {
    obtenerTodas();
  }, []);

  return { citas, loading, error, obtenerTodas, cambiarEstado, cancelar };
}
```

### Ejemplo de componente — LoadingSpinner.jsx
```javascript
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
```

### Ejemplo de componente — ErrorMessage.jsx
```javascript
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-destructive text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm underline text-muted-foreground"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
```

### App.jsx refactorizado
```javascript
import { AuthProvider } from '../context/AuthContext';
import { AppRouter } from '../router/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
```

---

## TODOS LOS ENDPOINTS DEL BACKEND

```
BASE URL: http://localhost:5000

AUTH:
POST   /api/auth/login                    → { email, password }
POST   /api/auth/register                 → { email, password, nombre, apellido, telefono, dni }
GET    /api/auth/me                        → usuario autenticado
POST   /api/auth/refresh-token            → { refreshToken }
POST   /api/auth/logout                   → { refreshToken }

CITAS:
GET    /api/cita                           → todas las citas
GET    /api/cita/hoy                       → citas del día
GET    /api/cita/mis-citas                 → citas del cliente autenticado
GET    /api/cita/{id}                      → detalle con pago incluido
POST   /api/cita                           → { idMascota, idVeterinario, fechaHora, duracionMinutos, motivo }
PATCH  /api/cita/{id}/estado              → { estado, observaciones }
POST   /api/cita/{id}/cancelar            → { motivoCancelacion }
POST   /api/cita/{id}/servicio            → { idServicio, cantidad, precioUnitario }
GET    /api/cita/{id}/servicios           → servicios de la cita

MASCOTAS:
GET    /api/mascota                        → todas
GET    /api/mascota/{id}                   → detalle
POST   /api/mascota                        → crear
PUT    /api/mascota/{id}                   → editar
DELETE /api/mascota/{id}                   → soft delete
GET    /api/mascota/{id}/historial         → historial médico
GET    /api/mascota/{id}/proximas-citas   → próximas citas

CLIENTES:
GET    /api/cliente                        → todos
GET    /api/cliente/{id}                   → detalle
POST   /api/cliente                        → crear
PUT    /api/cliente/{id}                   → editar
GET    /api/cliente/{id}/mascotas          → mascotas del cliente

VETERINARIOS:
GET    /api/veterinario                    → todos
GET    /api/veterinario/{id}              → detalle
POST   /api/veterinario                   → crear (solo Admin)
PUT    /api/veterinario/{id}              → editar (solo Admin)
DELETE /api/veterinario/{id}              → soft delete (solo Admin)
GET    /api/veterinario/{id}/agenda       → agenda por fechas
GET    /api/veterinario/{id}/estadisticas → estadísticas

HISTORIAL:
POST   /api/historial                                    → crear registro
GET    /api/historial/{id}                               → detalle
GET    /api/historial/mascota/{idMascota}                → historial de mascota
GET    /api/historial/mascota/{idMascota}/vacunas        → solo vacunas
DELETE /api/historial/{id}                               → soft delete

MEDICAMENTOS:
GET    /api/medicamento                        → todos
GET    /api/medicamento/{id}                   → detalle
POST   /api/medicamento                        → crear (solo Admin)
PUT    /api/medicamento/{id}                   → editar (solo Admin)
DELETE /api/medicamento/{id}                   → soft delete (solo Admin)
GET    /api/medicamento/stock-bajo             → alertas de stock
POST   /api/medicamento/{id}/descontar-stock  → { cantidad }
POST   /api/medicamento/{id}/reponer-stock    → { cantidad }

PRESCRIPCIONES:
POST   /api/prescripcion                           → crear
GET    /api/prescripcion/historial/{idHistorial}   → por historial
GET    /api/prescripcion/mascota/{idMascota}       → por mascota
PUT    /api/prescripcion/{id}                      → editar
DELETE /api/prescripcion/{id}                      → eliminar

SERVICIOS:
GET    /api/servicio               → todos
POST   /api/servicio               → crear (solo Admin)
PUT    /api/servicio/{id}          → editar (solo Admin)
DELETE /api/servicio/{id}          → soft delete (solo Admin)

PAGOS:
GET    /api/pago/cita/{idCita}    → pago de una cita
PUT    /api/pago/{id}             → actualizar pago

DASHBOARD:
GET    /api/dashboard                                               → resumen general
GET    /api/dashboard?fecha_inicio=2026-01-01&fecha_fin=2026-12-31 → con filtro de fechas
```

---

## ROLES Y ACCESO

```
Administrador → todo
Veterinario   → citas, historial, prescripciones, mascotas, medicamentos
Recepcionista → citas, clientes, mascotas, pagos
Cliente       → solo sus mascotas y sus propias citas
```

El sidebar debe mostrar solo las opciones del rol del usuario autenticado.

---

## USUARIOS DE PRUEBA

```
admin@cuatropatas.com        → password123 → Administrador
dr.rodriguez@cuatropatas.com → password123 → Veterinario
recepcion@cuatropatas.com    → password123 → Recepcionista
juan.perez@email.com         → password123 → Cliente
```

---

## REGLAS GENERALES

1. Instalar primero: `npm install axios react-router-dom`
2. Token guardado en `sessionStorage` — claves: `accessToken` y `refreshToken`
3. Todos los hooks tienen: `data`, `loading`, `error` y funciones para CRUD
4. Todos los fetch van dentro de `try/catch` con `async/await`
5. Usar `LoadingSpinner` mientras carga, `ErrorMessage` si falla
6. Usar `ConfirmDialog` antes de eliminar o cancelar cualquier cosa
7. Soft delete: nunca borrar físicamente, solo desactivar
8. Mantener el diseño visual actual de shadcn + Tailwind
9. Formularios con componentes shadcn: `Input`, `Button`, `Select`, `Dialog`
10. Tablas con el componente `Table` de shadcn
11. Moneda en soles: `new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(valor)`
12. Fechas en español: `new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(fecha))`
13. Los archivos de shadcn en `src/app/components/ui/` NO se tocan

---

## ORDEN DE IMPLEMENTACIÓN

1. Instalar dependencias: `npm install axios react-router-dom`
2. Crear `src/api/axiosConfig.js`
3. Crear todos los archivos en `src/api/`
4. Crear `src/context/AuthContext.jsx`
5. Crear `src/hooks/useAuth.js` y todos los demás hooks
6. Crear `src/components/layout/PrivateRoute.jsx`
7. Crear `src/router/AppRouter.jsx`
8. Crear componentes shared: `LoadingSpinner`, `ErrorMessage`, `ConfirmDialog`, `EmptyState`
9. Crear componentes de layout: `Sidebar.jsx`, `Navbar.jsx`
10. Crear componentes de cada módulo en `src/components/`
11. Crear todas las páginas en `src/pages/`
12. Refactorizar `App.tsx` → `App.jsx`
13. Refactorizar `main.tsx` → `main.jsx`
14. Verificar que no haya errores al correr `npm run dev`
15. Probar login con `admin@cuatropatas.com` / `password123`

