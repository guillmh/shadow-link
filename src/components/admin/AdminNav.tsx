"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Tags, Handshake, PlaySquare, Palette } from "lucide-react";

const enlaces = [
  { href: "/admin", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake },
  { href: "/admin/video", label: "Video", icon: PlaySquare },
  { href: "/admin/apariencia", label: "Apariencia", icon: Palette },
];

export default function AdminNav() {
  const pathname = usePathname();

  function estaActivo(href: string) {
    if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/productos/");
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav aria-label="Administración" className="admin-width admin-nav">
      {enlaces.map(({ href, label, icon: Icon }) => {
        const activo = estaActivo(href);
        return (
          <Link
            key={href}
            href={href}
            className={`nav-link${activo ? " active" : ""}`}
            aria-current={activo ? "page" : undefined}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
