export type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  link?: string | null;
  description?: string | null;
  destacado?: boolean;
};
