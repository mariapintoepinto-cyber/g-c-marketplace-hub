import { supabase, isSupabaseConfigured, type ProfileRecord } from "@/lib/supabase";

export async function signUp({
  email,
  password,
  nome,
  apelido,
  telefone,
}: {
  email: string;
  password: string;
  nome: string;
  apelido?: string;
  telefone?: string;
}) {

  const fullName = `${nome} ${apelido || ""}`.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/entrar`,
      data: {
        nome,
        apelido: apelido || "",
        full_name: fullName,
        telefone: telefone || "",
      },
    },
  });

  if (error) {
    return { data: null, error: traduzirErro(error.message) };
  }
  return { data, error: null };
}

export function traduzirErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Email ou palavra-passe incorrectos.";
  if (m.includes("email not confirmed")) return "Confirme o seu email antes de entrar. Verifique a sua caixa de correio.";
  if (m.includes("already registered") || m.includes("already exists")) return "Já existe uma conta com este email.";
  if (m.includes("password")) return "A palavra-passe não cumpre os requisitos (mínimo 6 caracteres).";
  if (m.includes("rate limit")) return "Demasiadas tentativas. Tente novamente mais tarde.";
  return "Ocorreu um erro. Tente novamente.";
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { data: null, error: traduzirErro(error.message) };
  }
  return { data, error: null };
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  if (!isSupabaseConfigured) {
    return { error: null };
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/entrar`,
  });
  return { error };
}

export async function getProfile(userId: string): Promise<ProfileRecord | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("Erro ao obter perfil:", error);
    return null;
  }
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const lista = ((roles ?? []) as { role: string }[]).map((r) => r.role);
  const role = lista.includes("admin") ? "admin" : lista.includes("moderator") ? "moderator" : "user";
  if (!data) return null;
  return { ...(data as ProfileRecord), role } as ProfileRecord;
}

export async function updateProfile(userId: string, updates: Partial<ProfileRecord>) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  // Impedir que o utilizador altere o seu próprio papel de segurança
  const safeUpdates = { ...updates };
  delete safeUpdates.role;
  delete safeUpdates.id;
  delete safeUpdates.created_at;

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...safeUpdates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Erro ao carregar avatar:", uploadError);
    return null;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
}
