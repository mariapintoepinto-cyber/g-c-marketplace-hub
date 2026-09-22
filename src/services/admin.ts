import { supabase, isSupabaseConfigured, type ListingRecord, type ProfileRecord, type UserRole } from "@/lib/supabase";

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  pendingListings: number;
  publishedListings: number;
  soldListings: number;
  totalViews: number;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured) {
    return {
      totalUsers: 14,
      totalListings: 8,
      pendingListings: 1,
      publishedListings: 7,
      soldListings: 1,
      totalViews: 8240,
    };
  }

  const [usersRes, listingsRes, pendingRes, publishedRes, soldRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id, views_count"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "sold"),
  ]);

  const totalViews = (listingsRes.data || []).reduce((acc, curr) => acc + (curr.views_count || 0), 0);

  return {
    totalUsers: usersRes.count || 0,
    totalListings: listingsRes.data?.length || 0,
    pendingListings: pendingRes.count || 0,
    publishedListings: publishedRes.count || 0,
    soldListings: soldRes.count || 0,
    totalViews,
  };
}

export async function fetchAllListingsAdmin(statusFilter?: string) {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }

  let req = supabase
    .from("listings")
    .select(`
      *,
      profiles(id, full_name, email, phone, role),
      vehicles(*),
      properties(*),
      listing_images(*)
    `)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    req = req.eq("status", statusFilter);
  }

  const { data, error } = await req;
  return { data: (data as any[]) || [], error: error?.message || null };
}

export async function approveListing(adminId: string, listingId: string) {
  if (!isSupabaseConfigured) return { error: null };

  const { error } = await supabase
    .from("listings")
    .update({
      status: "published",
      rejection_reason: null,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (!error) {
    await logAdminAction(adminId, "approve", "listing", listingId, "Anúncio aprovado e publicado");
  }

  return { error: error?.message || null };
}

export async function rejectListing(adminId: string, listingId: string, reason: string) {
  if (!isSupabaseConfigured) return { error: null };

  const { error } = await supabase
    .from("listings")
    .update({
      status: "rejected",
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (!error) {
    await logAdminAction(adminId, "reject", "listing", listingId, `Anúncio rejeitado: ${reason}`);
  }

  return { error: error?.message || null };
}

export async function toggleFeaturedListing(adminId: string, listingId: string, currentFeatured: boolean) {
  if (!isSupabaseConfigured) return { error: null };

  const newFeatured = !currentFeatured;
  const { error } = await supabase
    .from("listings")
    .update({
      featured: newFeatured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (!error) {
    await logAdminAction(
      adminId,
      newFeatured ? "feature" : "unfeature",
      "listing",
      listingId,
      newFeatured ? "Anúncio marcado como Destaque" : "Destaque removido do anúncio",
    );
  }

  return { error: error?.message || null };
}

export async function deleteListingAdmin(adminId: string, listingId: string) {
  if (!isSupabaseConfigured) return { error: null };

  const { error } = await supabase.from("listings").delete().eq("id", listingId);

  if (!error) {
    await logAdminAction(adminId, "delete", "listing", listingId, "Anúncio eliminado pelo administrador");
  }

  return { error: error?.message || null };
}

export async function fetchUsersAdmin() {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return { data: (data as ProfileRecord[]) || [], error: error?.message || null };
}

export async function updateUserRoleAdmin(adminId: string, targetUserId: string, newRole: UserRole) {
  if (!isSupabaseConfigured) return { error: null };

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq("id", targetUserId);

  if (!error) {
    await logAdminAction(adminId, "change_role", "user", targetUserId, `Papel alterado para ${newRole}`);
  }

  return { error: error?.message || null };
}

export async function toggleUserActiveAdmin(adminId: string, targetUserId: string, currentActive: boolean) {
  if (!isSupabaseConfigured) return { error: null };

  const newActive = !currentActive;
  const { error } = await supabase
    .from("profiles")
    .update({ is_active: newActive, updated_at: new Date().toISOString() })
    .eq("id", targetUserId);

  if (!error) {
    await logAdminAction(
      adminId,
      newActive ? "activate" : "deactivate",
      "user",
      targetUserId,
      newActive ? "Utilizador ativado" : "Utilizador desativado",
    );
  }

  return { error: error?.message || null };
}

export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  description: string,
) {
  if (!isSupabaseConfigured) return;

  await supabase.from("admin_activity_logs").insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    description,
  });
}

export async function fetchActivityLogsAdmin(limit = 20) {
  if (!isSupabaseConfigured) return { data: [], error: null };

  const { data, error } = await supabase
    .from("admin_activity_logs")
    .select(`
      *,
      profiles(id, full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: data || [], error: error?.message || null };
}

export async function fetchSiteSettings() {
  if (!isSupabaseConfigured) return { data: {}, error: null };

  const { data, error } = await supabase.from("site_settings").select("*");
  const settingsMap: Record<string, any> = {};
  (data || []).forEach((row) => {
    settingsMap[row.key] = row.value;
  });

  return { data: settingsMap, error: error?.message || null };
}

export async function updateSiteSetting(key: string, value: Record<string, any>) {
  if (!isSupabaseConfigured) return { error: null };

  const { error } = await supabase.from("site_settings").upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  });

  return { error: error?.message || null };
}
