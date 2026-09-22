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
  if (!isSupabaseConfigured) {
    // Fallback local caso Supabase ainda não esteja ligado com chaves reais
    return { data: { user: { id: "u-local", email } }, error: null };
  }

  const fullName = `${nome} ${apelido || ""}`.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome,
        apelido: apelido || "",
        full_name: fullName,
        telefone: telefone || "",
      },
    },
  });

  if (error) {
    console.error("Erro no registo Supabase:", error);
    return { data: null, error: error.message };
  }

  // Tenta criar/assegurar o perfil se o utilizador foi criado
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      first_name: nome,
      last_name: apelido || "",
      phone: telefone || "",
      role: "user",
      is_active: true,
      updated_at: new Date().toISOString(),
    });
  }

  return { data, error: null };
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured) {
    return { data: { user: { id: "u-local", email } }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Erro no login Supabase:", error);
    return { data: null, error: error.message };
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
  if (!isSupabaseConfigured) {
    return null;
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Erro ao obter perfil:", error);
    return null;
  }
  return data as ProfileRecord;
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
