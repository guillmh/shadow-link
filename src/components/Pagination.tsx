type PaginationProps = {
  paginaActual: number;
  totalPaginas: number;
  onChange: (pagina: number) => void;
};

export default function Pagination({
  paginaActual,
  totalPaginas,
  onChange,
}: PaginationProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 px-4">
      <button
        onClick={() => onChange(Math.max(1, paginaActual - 1))}
        disabled={paginaActual === 1}
        className="font-mono text-xs uppercase tracking-wider text-ink disabled:text-muted disabled:cursor-not-allowed hover:underline"
      >
        Anterior
      </button>

      <span className="font-mono text-xs text-muted">
        {paginaActual} / {totalPaginas}
      </span>

      <button
        onClick={() => onChange(Math.min(totalPaginas, paginaActual + 1))}
        disabled={paginaActual === totalPaginas}
        className="font-mono text-xs uppercase tracking-wider text-ink disabled:text-muted disabled:cursor-not-allowed hover:underline"
      >
        Siguiente
      </button>
    </div>
  );
}
