"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { fetchProductos } from "@/lib/queries/productos";
import { Producto } from "@/types/producto";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";

function ProductosContent() {
  const searchParams = useSearchParams();
  const categoriaInicial = searchParams.get("categoria") || "todos";

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const PRODUCTOS_POR_PAGINA = 10; // 5 columnas x 2 filas en desktop

  const handleCategoriaChange = (categoria: string) => {
    setCategoriaActiva(categoria);
    setPagina(1);
  };

  const handleBusquedaChange = (valor: string) => {
    setBusqueda(valor);
    setPagina(1);
  };

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

  const productosFiltrados = productos
    .filter(
      (p) => categoriaActiva === "todos" || p.categoria === categoriaActiva,
    )
    .filter((p) =>
      busqueda.trim() === ""
        ? true
        : p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );
  const totalPaginas = Math.ceil(
    productosFiltrados.length / PRODUCTOS_POR_PAGINA,
  );
  const productosPagina = productosFiltrados.slice(
    (pagina - 1) * PRODUCTOS_POR_PAGINA,
    pagina * PRODUCTOS_POR_PAGINA,
  );

  return (
    <main className="max-w-5xl mx-auto pb-12">
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
            onChange={(e) => handleBusquedaChange(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full font-mono text-sm pl-9 pr-3 py-2 bg-surface border border-hairline text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      <div className="mt-4">
        <CategoryFilter
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onChange={handleCategoriaChange}
        />
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-4 mt-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-4 mt-6">
          {productosPagina.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {!loading && productosFiltrados.length === 0 && (
        <p className="px-4 mt-6 text-sm text-muted font-mono">
          {busqueda.trim() !== ""
            ? `Sin resultados para "${busqueda}"`
            : "No hay productos en esta categoría todavía."}
        </p>
      )}
      <Pagination
        paginaActual={pagina}
        totalPaginas={totalPaginas}
        onChange={setPagina}
      />
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
