import { createClient } from "@supabase/supabase-js";

// Credenciais lidas a partir de variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Verificação de configuração do cliente
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://seu-projeto.supabase.co" &&
    !supabaseUrl.includes("seu-projeto"),
);

// Cliente Supabase com persistência de sessão no localStorage
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder-gc.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  },
);

// =================================================================
// Tipos TypeScript para o Banco de Dados do Supabase
// =================================================================

export type UserRole = "user" | "moderator" | "admin";

export interface ProfileRecord {
  id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ListingCategory = "vehicle" | "property";
export type ListingType = "sale" | "rent";
export type ListingStatus = "draft" | "pending" | "published" | "rejected" | "sold" | "rented" | "archived";

export interface ListingRecord {
  id: string;
  user_id: string;
  category: ListingCategory;
  listing_type: ListingType;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  province: string;
  municipality: string | null;
  neighborhood: string;
  location: string | null;
  status: ListingStatus;
  rejection_reason: string | null;
  featured: boolean;
  views_count: number;
  features: string[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  // Relações em JOIN
  profiles?: ProfileRecord;
  vehicles?: VehicleRecord | null;
  properties?: PropertyRecord | null;
  listing_images?: ListingImageRecord[];
}

export interface VehicleRecord {
  id: string;
  listing_id: string;
  brand: string;
  model: string;
  version: string | null;
  year: number;
  mileage: number;
  fuel_type: "Gasolina" | "Diesel" | "Híbrido" | "Elétrico";
  transmission: "Manual" | "Automática";
  drive_type: string | null;
  color: string | null;
  engine: string | null;
  doors: number | null;
  seats: number | null;
  condition: string | null;
}

export interface PropertyRecord {
  id: string;
  listing_id: string;
  property_type: "Moradia" | "Apartamento" | "Terreno" | "Escritório" | "Loja" | "Armazém";
  bedrooms: number;
  bathrooms: number;
  area_m2: number | null;
  parking_spaces: number;
  furnished: boolean;
  condominium: boolean;
  floor: number | null;
  total_floors: number | null;
  construction_year: number | null;
}

export interface ListingImageRecord {
  id: string;
  listing_id: string;
  image_url: string;
  storage_path: string | null;
  display_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface FavoriteRecord {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface SiteSettingsRecord {
  key: string;
  value: Record<string, any>;
  updated_at: string;
}

export interface AdminActivityLogRecord {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  description: string | null;
  created_at: string;
}
