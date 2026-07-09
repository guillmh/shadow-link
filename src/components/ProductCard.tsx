import Image from "next/image";
import type { Producto } from "@/types/producto";

export default function ProductCard({ producto }: { producto: Producto }) {
  const linkUrl = producto.link ?? "#";

  const textoSecundario =
    producto.description ??
    (linkUrl && linkUrl !== "#" ? "Ver producto" : "Sin descripción");

  return (
    <a
      href={linkUrl}
      target={linkUrl && linkUrl !== "#" ? "_blank" : undefined}
      rel={linkUrl && linkUrl !== "#" ? "noopener noreferrer" : undefined}
      aria-label={`Abrir ${producto.nombre}`}
      title={producto.nombre}
      className="block w-full"
    >
      <div className="relative w-full aspect-square bg-surface border border-hairline overflow-hidden">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 42vw, 220px"
          className="object-contain p-4"
        />
        <span className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-wider text-muted bg-background/90 px-1.5 py-0.5 border border-hairline">
          {producto.categoria}
        </span>
      </div>

      <div className="pt-2">
        <h3 className="font-body text-sm text-ink line-clamp-2 leading-snug">
          {producto.nombre}
        </h3>
        <p className="mt-2 text-[11px] leading-relaxed text-muted line-clamp-2">
          {textoSecundario}
        </p>
      </div>
    </a>
  );
}
