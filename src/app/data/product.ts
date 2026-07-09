import type { Producto } from "@/types/producto";

export type { Producto };

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Logitech G Pro X Superlight",
    imagen: "/msu.jpg",
    categoria: "mouses",
    link: { tienda: "Amazon", url: "https://amazon.com/..." },
    descripcion: "Diseño ultraligero con switches ultrarrápidos.",
    cupon: "Cupón: 10% OFF",
  },
  {
    id: 2,
    nombre: "Sony WH-1000XM5",
    imagen: "/msu.jpg",
    categoria: "audifonos",
    link: { tienda: "Amazon", url: "https://amazon.com/..." },
    descripcion: "Cancelación de ruido premium para viajes y trabajo.",
  },
  // agrega 2-3 más para probar el grid
];
