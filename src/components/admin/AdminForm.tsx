"use client";

import { FormEvent, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type AdminFormProps = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  enviando: boolean;
  textoEspera?: string;
  deshabilitado?: boolean;
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
  textoEspera = "Guardando…",
  deshabilitado,
  error,
  textoBoton,
  children,
}: AdminFormProps) {
  return (
    <form onSubmit={onSubmit} className="admin-form">
      <fieldset disabled={enviando} className="min-w-0 flex flex-col gap-4">
        {children}
      </fieldset>

      {error && <p role="alert" className="text-sm text-danger">{error}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={enviando || deshabilitado} className="btn btn-primary">
          {enviando && <LoaderCircle size={16} className="admin-spinner" aria-hidden="true" />}
          {enviando ? textoEspera : textoBoton}
        </button>
        <span className="sr-only" role="status">{enviando ? textoEspera : ""}</span>
      </div>
    </form>
  );
}
