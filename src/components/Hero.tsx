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
      <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden border-2 border-gray-200">
        <Image
          src="/logo.webp"
          alt="Foto de perfil"
          fill
          className="object-cover"
        />
      </div>

      <h1 className="mt-4 text-xl md:text-2xl font-bold">ShadowEZ</h1>
      <a
        href="mailto:guillmhbusiness@gmail.com"
        className="mt-1 text-sm md:text-base text-muted max-w-xs hover:text-ink transition-colors"
      >
        guillmhbusiness@gmail.com
      </a>

      <div className="flex gap-4 mt-4">
        {socialLinks.map(({ nombre, url, Icono }) => (
          <a
            key={nombre}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            aria-label={nombre}
          >
            <Icono size={20} className="text-gray-700" />
          </a>
        ))}
      </div>
    </section>
  );
}
