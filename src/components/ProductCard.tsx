import Image from "next/image";
import type { Producto } from "@/types/producto";

export default function ProductCard({
  producto,
  priority = false,
}: {
  producto: Producto;
  priority?: boolean;
}) {
  const linkUrl = producto.link ?? "#";

  const textoSecundario =
    producto.descripcion ??
    (linkUrl && linkUrl !== "#" ? "Ver producto" : "Sin descripción");

  return (
    <a
      href={linkUrl}
      target={linkUrl && linkUrl !== "#" ? "_blank" : undefined}
      rel={linkUrl && linkUrl !== "#" ? "noopener noreferrer" : undefined}
      aria-label={`Abrir ${producto.nombre}`}
      title={producto.nombre}
      className="group block w-full rounded-lg transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
    >
      <div className="relative w-full aspect-square thumb rounded-lg">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 42vw, 220px"
          className="object-contain p-4"
          priority={priority}
        />
        <span className="absolute top-2 left-2 badge">
          {producto.categoria}
        </span>
      </div>

      <div className="pt-2">
        <h3 className="font-body text-sm font-medium text-ink line-clamp-2 leading-snug">
          {producto.nombre}
        </h3>
        <p className="mt-2 text-[11px] leading-relaxed text-muted line-clamp-2">
          {textoSecundario}
        </p>
      </div>
    </a>
  );
}
