import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setUsuario({
      idUsuario: data.idUsuario,
      email: data.email,
      nombreUsuario: data.nombreUsuario,
      roles: data.roles,
    });
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

  const hasRole = (roles) => {
    if (!usuario) return false;
    if (Array.isArray(roles)) return roles.some(r => usuario.roles?.includes(r));
    return usuario.roles?.includes(roles);
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
