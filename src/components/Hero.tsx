import Image from "next/image";
import { FaYoutube, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";

type SocialLink = {
  nombre: string;
  url: string;
  Icono: React.ElementType;
};

const socialLinks: SocialLink[] = [
  {
    nombre: "YouTube",
    url: "https://youtube.com/@shadowez9",
    Icono: FaYoutube,
  },
  {
    nombre: "Instagram",
    url: "https://instagram.com/shadowez9",
    Icono: FaInstagram,
  },
  { nombre: "TikTok", url: "https://tiktok.com/@shadowez9", Icono: FaTiktok },
  {
    nombre: "Facebook",
    url: "https://facebook.com/@shadowez9",
    Icono: FaFacebook,
  },
];

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-4 pt-10 pb-6">
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md border-[3px] border-solid border-transparent bg-gradient-to-br from-accent/50 to-[#7c5cf0]/50">
        <Image
          src="/logo.webp"
          alt="Foto de perfil"
          fill
          sizes="(max-width: 768px) 96px, 128px"
          className="object-cover"
          priority
        />
      </div>

      <h1 className="mt-4 font-display text-xl md:text-2xl font-bold tracking-tight">ShadowEZ</h1>
      <a
        href="mailto:guillmhbusiness@gmail.com"
        className="mt-1 text-sm md:text-base text-muted max-w-xs rounded-sm transition-colors hover:text-ink focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
      >
        📧contacto@shadowez.com
      </a>

      <div className="flex gap-4 mt-4">
        {socialLinks.map(({ nombre, url, Icono }) => (
          <a
            key={nombre}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-10 h-10 flex items-center justify-center rounded-full glass card-interactive transition hover:-translate-y-0.5"
            aria-label={nombre}
          >
            <Icono size={20} className="text-ink transition-colors group-hover:text-accent" />
          </a>
        ))}
      </div>
    </section>
  );
}
