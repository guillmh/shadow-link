"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-strong w-full max-w-sm rounded-xl shadow-lg p-6"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          [ Admin ]
        </span>
        <h1 className="font-display text-xl text-ink mt-1 mb-6">
          Iniciar sesión
        </h1>

        <label htmlFor="correo" className="label-mono block mb-1">Correo</label>
        <input
          id="correo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          className="field mb-4"
        />

        <label htmlFor="password" className="label-mono block mb-1">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          className="field mb-4"
        />

        {error && (
          <p id="login-error" className="font-mono text-[11px] text-danger mb-4">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
