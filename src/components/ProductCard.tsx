import Image from "next/image";
import { Producto } from "@/app/data/product";

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
      <div className="relative w-full aspect-square bg-gray-50">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-contain p-2"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2">{producto.nombre}</h3>
        <div className="flex gap-2 mt-2">
          {producto.links.map((link) => (
            <a
              key={link.tienda}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition"
            >
              {link.tienda}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
