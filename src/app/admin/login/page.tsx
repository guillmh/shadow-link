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
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-hairline bg-surface p-6"
      >
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          [ Admin ]
        </span>
        <h1 className="font-display text-xl text-ink mt-1 mb-6">
          Iniciar sesión
        </h1>

        <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
          Correo
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full font-body text-sm px-3 py-2 bg-background border border-hairline text-ink focus:outline-none focus:border-ink transition-colors mb-4"
        />

        <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full font-body text-sm px-3 py-2 bg-background border border-hairline text-ink focus:outline-none focus:border-ink transition-colors mb-4"
        />

        {error && (
          <p className="font-mono text-xs text-red-600 mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-mono text-xs uppercase tracking-wider py-2.5 bg-ink text-background hover:bg-ink/90 disabled:opacity-50 transition-colors"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </main>
  );
}
