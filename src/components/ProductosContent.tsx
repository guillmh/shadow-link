"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Producto } from "@/types/producto";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";

export default function ProductosContent({
  productos,
}: {
  productos: Producto[];
}) {
  const searchParams = useSearchParams();
  const categoriaInicial = searchParams.get("categoria") || "todos";

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
    <>
      <header className="catalog-header">
        <Link
          href="/"
          className="catalog-back"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Volver al inicio
        </Link>
        <h1 className="font-display">Todos los productos</h1>
        <p>Busca por nombre o explora por categoría.</p>
      </header>

      <div className="catalog-search" role="search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          aria-label="Buscar producto"
          value={busqueda}
          onChange={(e) => handleBusquedaChange(e.target.value)}
          placeholder="Buscar producto…"
          className="field"
        />
      </div>

      <div className="catalog-filters">
        <CategoryFilter
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onChange={handleCategoriaChange}
        />
      </div>

      <div className="catalog-grid">
        {productosPagina.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <p role="status" className="catalog-empty">
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
    </>
  );
}
