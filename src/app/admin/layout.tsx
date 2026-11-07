import type { CSSProperties, ReactNode } from "react";
import { fetchApariencia } from "@/lib/queries/apariencia.server";

export default async function AdminTheme({ children }: { children: ReactNode }) {
  const apariencia = await fetchApariencia();

  return (
    <div
      className="admin-theme"
      style={{
        "--home-start": apariencia.fondo_inicio,
        "--home-end": apariencia.fondo_fin,
      } as CSSProperties}
    >
      {children}
    </div>
  );
}
