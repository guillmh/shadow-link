import Image from "next/image";
import { Mail } from "lucide-react";
import { FaYoutube, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";

const correoContacto = "contacto@shadowez.com";

const socialLinks = [
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

export default function Hero({ portadaUrl }: { portadaUrl: string }) {
  return (
    <header className="creator-header">
      <div className="creator-cover" aria-hidden="true">
        <Image
          src={portadaUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          preload
        />
      </div>
      <div className="creator-profile">
        <Image
          src="/logo.webp"
          alt="Perfil de ShadowEZ"
          width={112}
          height={112}
          className="creator-avatar"
        />
        <h1 className="font-display">ShadowEZ</h1>
        <a href={`mailto:${correoContacto}`} className="creator-email">
          <Mail size={15} aria-hidden="true" />
          <span>
            <small>Negocios y colaboraciones</small>{correoContacto}
          </span>
        </a>
        <nav className="creator-socials" aria-label="Redes sociales">
          {socialLinks.map(({ nombre, url, Icono }) => (
            <a
              key={nombre}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${nombre} (abre en otra pestaña)`}
              title={nombre}
            >
              <Icono size={20} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
