import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SponsorForm from "@/components/admin/SponsorForm";

export default async function EditarSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sponsor } = await supabase
    .from("sponsors")
    .select("*")
    .eq("id", id)
    .single();

  if (!sponsor) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Editar sponsor</h1>
      <SponsorForm sponsorExistente={sponsor} />
    </div>
  );
}
