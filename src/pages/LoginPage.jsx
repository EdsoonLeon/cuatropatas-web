import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-2xl p-10 border border-border">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-primary rounded-2xl p-3">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="ml-3 text-3xl font-bold text-foreground">CuatroPatas</h1>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-2">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground text-center mb-8">Ingresa tus credenciales para continuar</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-input-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-input-background border-border"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary via-secondary to-accent items-center justify-center p-12">
        <div className="text-center text-white max-w-lg">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <Heart className="w-24 h-24 mx-auto mb-6 text-white" />
            <h2 className="text-4xl font-bold mb-4">Sistema de Gestión Veterinaria</h2>
            <p className="text-xl text-white/90">
              Gestiona pacientes, citas, historiales médicos y más desde una sola plataforma
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
