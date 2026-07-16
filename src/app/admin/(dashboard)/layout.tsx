import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-hairline">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-ink">
            [ Panel Admin ]
          </span>
          <LogoutButton />
        </div>
        <nav className="max-w-4xl mx-auto px-4 pb-3 flex gap-4">
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors"
          >
            Productos
          </Link>
          <Link
            href="/admin/sponsors"
            className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors"
          >
            Sponsors
          </Link>
          <Link
            href="/admin/video"
            className="font-mono text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors"
          >
            Video
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
