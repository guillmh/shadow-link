"use client";

type CategoryFilterProps = {
  categorias: string[];
  categoriaActiva: string;
  onChange: (categoria: string) => void;
};

export default function CategoryFilter({
  categorias,
  categoriaActiva,
  onChange,
}: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filtrar por categoría" className="flex gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-hairline/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/40 [&::-webkit-scrollbar-thumb]:hover:bg-ink/70">
      {categorias.map((cat) => {
        const activa = categoriaActiva === cat;

        return (
          <button
            key={cat}
            type="button"
            aria-pressed={activa}
            onClick={() => onChange(cat)}
            className={`pill ${activa ? "active" : ""}`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
