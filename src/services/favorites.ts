import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function fetchUserFavoriteIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured || !userId) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao buscar favoritos:", error);
    return [];
  }

  return (data || []).map((f) => f.listing_id);
}

export async function toggleFavoriteInDb(userId: string, listingId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !userId) return false;

  // Verifica se já é favorito
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (data) {
    // Remover
    await supabase.from("favorites").delete().eq("id", data.id);
    return false; // Agora não é favorito
  } else {
    // Adicionar
    await supabase.from("favorites").insert({
      user_id: userId,
      listing_id: listingId,
    });
    return true; // Agora é favorito
  }
}
