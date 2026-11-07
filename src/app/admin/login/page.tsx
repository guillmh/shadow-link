"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminForm from "@/components/admin/AdminForm";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Correo o contraseña incorrectos");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-svh flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        <Image src="/logo.webp" alt="ShadowEZ" width={48} height={48} className="mb-3 rounded-sm" />
        <h1 className="font-display text-2xl text-ink mb-4">Iniciar sesión</h1>
        <AdminForm
          onSubmit={handleSubmit}
          enviando={loading}
          error={error}
          textoBoton="Ingresar"
          textoEspera="Ingresando…"
        >
          <div>
            <label htmlFor="correo" className="label-mono block mb-1">Correo</label>
            <input
              id="correo"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field"
            />
          </div>
          <div>
            <label htmlFor="password" className="label-mono block mb-1">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="field"
            />
          </div>
        </AdminForm>
      </div>
    </main>
  );
}
