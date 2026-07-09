export type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string; // "mouses" | "audifonos" | etc.
  links: { tienda: string; url: string }[];
  destacado?: boolean;
};

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Logitech G Pro X Superlight",
    imagen: "/msu.jpg",
    categoria: "mouses",
    links: [
      { tienda: "Amazon", url: "https://amazon.com/..." },
      { tienda: "Mercado Libre", url: "https://mercadolibre.com/..." },
    ],
  },
  {
    id: 2,
    nombre: "Sony WH-1000XM5",
    imagen: "/msu.jpg",
    categoria: "audifonos",
    links: [{ tienda: "Amazon", url: "https://amazon.com/..." }],
  },
  // agrega 2-3 más para probar el grid
];
