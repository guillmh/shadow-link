"use client";

import Image from "next/image";

type ImageFieldProps = {
  /** Texto de la etiqueta: «Imagen» (productos) o «Logo» (sponsors). */
  etiqueta: string;
  /** Imagen ya guardada, se muestra como vista previa. */
  imagenActual: string;
  /** Si hay un archivo nuevo pendiente de subir se oculta la anterior. */
  tieneArchivo: boolean;
  onArchivo: (archivo: File | null) => void;
  /** Clases de la vista previa (productos/sponsors no usan las mismas). */
  classNamePreview: string;
};

/**
 * Campo de imagen compartido: etiqueta, vista previa de la imagen actual y
 * selector de archivo.
 */
export default function ImageField({
  etiqueta,
  imagenActual,
  tieneArchivo,
  onArchivo,
  classNamePreview,
}: ImageFieldProps) {
  return (
    <div>
      <label className="label-mono block mb-1">{etiqueta}</label>
      {imagenActual && !tieneArchivo && (
        <Image
          src={imagenActual}
          alt="Actual"
          width={80}
          height={80}
          className={classNamePreview}
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
        className="w-full font-body text-sm text-ink file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-hairline file:bg-white/80 file:px-4 file:py-2 file:font-mono file:text-xs file:uppercase file:text-ink file:transition"
      />
    </div>
  );
}
