import Link from "next/link";
import Image from "next/image";

type MoreProductProps = {
  categoria: string;
  cantidadRestante: number;
  imagenesPreview: string[];
};

export default function MoreProduct({
  categoria,
  cantidadRestante,
  imagenesPreview,
}: MoreProductProps) {
  const href =
    categoria === "todos" ? "/productos" : `/productos?categoria=${categoria}`;

  return (
    <Link
      href={href}
      className="shrink-0 w-[42vw] md:w-[220px] snap-start flex flex-col items-center justify-center gap-3 aspect-square border border-hairline bg-surface hover:border-ink transition-colors"
    >
      <div className="relative w-16 h-16">
        {imagenesPreview.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full overflow-hidden border-2 border-surface blur-[1px]"
            style={{
              transform: `translateX(${i * 10}px)`,
              zIndex: imagenesPreview.length - i,
            }}
          >
            <Image src={img} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
      <span className="font-mono text-xs uppercase tracking-wider text-ink">
        +{cantidadRestante} más
      </span>
    </Link>
  );
}
