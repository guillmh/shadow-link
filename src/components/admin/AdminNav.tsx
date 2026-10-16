"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const enlaces = [
  { href: "/admin", label: "Productos" },
  { href: "/admin/sponsors", label: "Sponsors" },
  { href: "/admin/video", label: "Video" },
];

export default function AdminNav() {
  const pathname = usePathname();

  function estaActivo(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="max-w-4xl mx-auto px-4 pb-3 flex gap-2 flex-wrap">
      {enlaces.map(({ href, label }) => {
        const activo = estaActivo(href);
        return (
          <Link
            key={href}
            href={href}
            className={`nav-link${activo ? " active" : ""}`}
            aria-current={activo ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
