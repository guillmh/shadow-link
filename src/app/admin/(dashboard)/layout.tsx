import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="admin-header">
        <div className="admin-width flex items-center justify-between gap-2 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Image src="/logo.webp" alt="" width={36} height={36} className="shrink-0 rounded-sm" />
            <span className="font-semibold">ShadowEZ</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Ver sitio <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <LogoutButton />
          </div>
        </div>
        <AdminNav />
      </header>

      <main className="admin-width admin-content">{children}</main>
    </>
  );
}
