"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Producto } from "@/types/producto";
import ProductCard from "./ProductCard";
import CategoryFilter from "./CategoryFilter";

export default function ProductGrid() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

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

  return (
    <section className="py-6">
      <CategoryFilter
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onChange={setCategoriaActiva}
      />

      {loading && (
        <p className="px-4 text-sm text-gray-400">Cargando productos...</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 mt-4">
        {productosFiltrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}
