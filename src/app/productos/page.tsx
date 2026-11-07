import { Suspense, type CSSProperties } from "react";
import { fetchApariencia } from "@/lib/queries/apariencia.server";
import { fetchProductosServer } from "@/lib/queries/productos.server";
import ProductosContent from "@/components/ProductosContent";

export default async function ProductosPage() {
  const [productos, apariencia] = await Promise.all([
    fetchProductosServer(),
    fetchApariencia(),
  ]);

  return (
    <main
      className="catalog-page"
      style={
        {
          "--home-start": apariencia.fondo_inicio,
          "--home-end": apariencia.fondo_fin,
        } as CSSProperties
      }
    >
      <div className="catalog-content">
        <Suspense fallback={<p role="status">Cargando productos…</p>}>
          <ProductosContent productos={productos} />
        </Suspense>
      </div>
    </main>
  );
}
