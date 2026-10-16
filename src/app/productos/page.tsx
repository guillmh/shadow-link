import { Suspense } from "react";
import { fetchProductosServer } from "@/lib/queries/productos.server";
import ProductosContent from "@/components/ProductosContent";

export default async function ProductosPage() {
  const productos = await fetchProductosServer();

  return (
    <Suspense
      fallback={
        <p className="px-4 pt-6 text-sm text-muted font-mono">Cargando...</p>
      }
    >
      <ProductosContent productos={productos} />
    </Suspense>
  );
}
