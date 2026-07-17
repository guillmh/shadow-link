export type Producto = {
  id: number;
  nombre: string;
  imagen: string;
  categoria: string;
  link?: string | null;
  descripcion?: string | null;
  destacado?: boolean;
};
