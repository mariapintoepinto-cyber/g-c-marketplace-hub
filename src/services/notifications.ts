import { supabase, isSupabaseConfigured, type NotificationRecord } from "@/lib/supabase";

export async function fetchUserNotifications(userId: string): Promise<NotificationRecord[]> {
  if (!isSupabaseConfigured || !userId) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar notificações:", error);
    return [];
  }

  return (data as NotificationRecord[]) || [];
}

export async function markNotificationAsRead(notificationId: string) {
  if (!isSupabaseConfigured) return;

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
}

export async function createNotification(userId: string, title: string, message: string, type = "info") {
  if (!isSupabaseConfigured) return;

  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
  });
}
