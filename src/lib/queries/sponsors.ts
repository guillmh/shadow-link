import { supabase } from "@/lib/supabase";
import { Sponsor } from "@/types/sponsor";

export async function fetchSponsors(): Promise<Sponsor[]> {
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("fecha_inicio", { ascending: false });

  if (error) {
    console.error("Error cargando sponsors:", error);
    return [];
  }

  return data as Sponsor[];
}
