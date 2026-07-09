"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Producto } from "@/types/producto";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

function ProductosContent() {
  const searchParams = useSearchParams();
  const categoriaInicial = searchParams.get("categoria") || "todos";

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial);
  const [busqueda, setBusqueda] = useState("");

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

  const productosFiltrados = productos
    .filter(
      (p) => categoriaActiva === "todos" || p.categoria === categoriaActiva,
    )
    .filter((p) =>
      busqueda.trim() === ""
        ? true
        : p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );

  return (
    <main className="max-w-2xl mx-auto pb-12">
      <div className="px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          Volver
        </Link>
        <h1 className="font-display text-2xl text-ink mt-3">
          Todos los productos
        </h1>
      </div>

      <div className="px-4 mt-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full font-mono text-sm pl-9 pr-3 py-2 bg-surface border border-hairline text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      <div className="mt-4">
        <CategoryFilter
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onChange={setCategoriaActiva}
        />
      </div>

      {loading && (
        <p className="px-4 mt-4 text-sm text-muted font-mono">
          Cargando productos...
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 mt-6">
        {productosFiltrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>

      {!loading && productosFiltrados.length === 0 && (
        <p className="px-4 mt-6 text-sm text-muted font-mono">
          {busqueda.trim() !== ""
            ? `Sin resultados para "${busqueda}"`
            : "No hay productos en esta categoría todavía."}
        </p>
      )}
    </main>
  );
}

export default function ProductosPage() {
  return (
    <Suspense
      fallback={
        <p className="px-4 pt-6 text-sm text-muted font-mono">Cargando...</p>
      }
    >
      <ProductosContent />
    </Suspense>
  );
}
