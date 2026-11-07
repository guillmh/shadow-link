"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

type ImageFieldProps = {
  etiqueta: string;
  imagenActual: string;
  archivo: File | null;
  onArchivo: (archivo: File | null) => void;
  portada?: boolean;
};

export default function ImageField({
  etiqueta,
  imagenActual,
  archivo,
  onArchivo,
  portada = false,
}: ImageFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [vistaPrevia, setVistaPrevia] = useState("");

  const urlLocal = archivo ? vistaPrevia : "";
  useEffect(() => {
    if (urlLocal) return () => URL.revokeObjectURL(urlLocal);
  }, [urlLocal]);
  useEffect(() => {
    if (!archivo && inputRef.current) inputRef.current.value = "";
  }, [archivo]);

  const imagen = archivo ? urlLocal : imagenActual;

  return (
    <div>
      <label htmlFor={id} className="label-mono block mb-2">{etiqueta}</label>
      <div className={`admin-image-field${portada ? " admin-image-cover" : ""}`}>
        <div className="admin-image-preview">
          {imagen ? (
            <Image
              src={imagen}
              alt={archivo ? "Vista previa del archivo elegido" : "Imagen guardada"}
              fill
              sizes={portada ? "(max-width: 640px) 100vw, 560px" : "72px"}
              unoptimized={!!archivo}
            />
          ) : (
            <ImagePlus size={22} aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-describedby={`${id}-ayuda`}
            onChange={(event) => {
              const nuevoArchivo = event.target.files?.[0] ?? null;
              setVistaPrevia(nuevoArchivo?.type.startsWith("image/") ? URL.createObjectURL(nuevoArchivo) : "");
              onArchivo(nuevoArchivo);
            }}
            className="admin-file-input"
          />
          <p id={`${id}-ayuda`} className="mt-2 text-xs text-muted">
            PNG, JPEG, WebP o GIF. Máximo 5 MB.
            {portada && " Usa una imagen horizontal."}
          </p>
        </div>
      </div>
    </div>
  );
}
