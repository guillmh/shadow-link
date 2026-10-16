"use client";

import { FormEvent, ReactNode } from "react";

type AdminFormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  enviando: boolean;
  error: string;
  /** Etiqueta del botón cuando no se está enviando. */
  textoBoton: string;
  children: ReactNode;
};

/**
 * Carcasa compartida de los formularios del panel admin: `<form>`, mensaje de
 * error y botón de envío con su estado «Guardando...».
 */
export default function AdminForm({
  onSubmit,
  enviando,
  error,
  textoBoton,
  children,
}: AdminFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-md">
      {children}

      {error && <p className="font-mono text-[11px] text-danger">{error}</p>}

      <button type="submit" disabled={enviando} className="btn btn-primary">
        {enviando ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}
