import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Heart } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl shadow-2xl p-10 border border-border">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-primary rounded-2xl p-3">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="ml-3 text-3xl font-bold text-foreground">VetApp</h1>
            </div>

            <h2 className="text-2xl font-semibold text-center mb-2">Bienvenido de nuevo</h2>
            <p className="text-muted-foreground text-center mb-8">
              Ingresa tus credenciales para continuar
            </p>

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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Recordarme
                  </label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Iniciar Sesión
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
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
