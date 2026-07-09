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
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm transition ${
            categoriaActiva === cat
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat === "todos"
            ? "Todos"
            : cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
}
