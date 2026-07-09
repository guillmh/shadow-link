export type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  links: { tienda: string; url: string }[];
  destacado?: boolean;
};
