"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchProductos } from "@/lib/queries/productos";
import { Producto } from "@/types/producto";
import ProductCard from "./ProductCard";
import useEmblaCarousel from "embla-carousel-react";
import CategoryFilter from "./CategoryFilter";
import MoreProduct from "./MoreProduct";
import ProductCardSkeleton from "./ProductCardSkeleton";

const LIMITE_CARRUSEL = 5;

export default function ProductGrid() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    fetchProductos().then((data) => {
      setProductos(data);
      setLoading(false);
    });
  }, []);

  const categorias = useMemo(() => {
    const unicas = Array.from(new Set(productos.map((p) => p.categoria)));
    return ["todos", ...unicas];
  }, [productos]);

  const productosFiltrados =
    categoriaActiva === "todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  const productosCarrusel = productosFiltrados.slice(0, LIMITE_CARRUSEL);
  const hayMas = productosFiltrados.length > LIMITE_CARRUSEL;

  return (
    <section className="py-6">
      <CategoryFilter
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onChange={setCategoriaActiva}
      />

      {loading ? (
        <div className="flex gap-3 px-4 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[42vw] md:w-[220px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative mt-4">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 px-4">
              {productosCarrusel.map((producto, index) => (
                <div
                  key={producto.id}
                  className="shrink-0 w-[42vw] md:w-[220px] snap-start"
                >
                  <ProductCard producto={producto} priority={index === 0} />
                </div>
              ))}
              {hayMas && (
                <MoreProduct
                  categoria={categoriaActiva}
                  cantidadRestante={productosFiltrados.length - LIMITE_CARRUSEL}
                  imagenesPreview={productosFiltrados
                    .slice(LIMITE_CARRUSEL, LIMITE_CARRUSEL + 3)
                    .map((p) => p.imagen)}
                />
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
        </div>
      )}
    </section>
  );
}
