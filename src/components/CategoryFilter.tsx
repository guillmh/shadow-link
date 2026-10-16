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
    <div className="flex gap-2 overflow-x-auto px-4 pb-3 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-hairline/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-ink/40 [&::-webkit-scrollbar-thumb]:hover:bg-ink/70">
      {categorias.map((cat) => {
        const activa = categoriaActiva === cat;
        const label = cat === "todos" ? "todos" : cat;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`pill ${activa ? "active" : ""}`}
          >
            [ {label} ]
          </button>
        );
      })}
    </div>
  );
}
