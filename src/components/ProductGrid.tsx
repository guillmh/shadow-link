"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Producto } from "@/types/producto";
import ProductCard from "./ProductCard";
import useEmblaCarousel from "embla-carousel-react";
import CategoryFilter from "./CategoryFilter";
import MoreProduct from "./MoreProduct";

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
    async function fetchProductos() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando productos:", error);
      } else {
        setProductos(data as Producto[]);
      }
      setLoading(false);
    }

    fetchProductos();
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

      {loading && (
        <p className="px-4 text-sm text-muted font-mono">
          Cargando productos...
        </p>
      )}
      <div className="relative mt-4">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 px-4">
            {productosCarrusel.map((producto) => (
              <div
                key={producto.id}
                className="shrink-0 w-[42vw] md:w-[220px] snap-start"
              >
                <ProductCard producto={producto} />
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
    </section>
  );
}
