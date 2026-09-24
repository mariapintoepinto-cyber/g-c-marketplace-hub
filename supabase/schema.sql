-- =================================================================
-- G&C Solutions Marketplace - Esquema PostgreSQL / Supabase
-- Carros • Casas • Negócios em Angola
-- =================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE PERFIS DE UTILIZADORES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABELA PRINCIPAL DE ANÚNCIOS (LISTINGS)
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('vehicle', 'property')),
  listing_type TEXT NOT NULL DEFAULT 'sale' CHECK (listing_type IN ('sale', 'rent')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price > 0),
  currency TEXT NOT NULL DEFAULT 'AOA',
  province TEXT NOT NULL,
  municipality TEXT,
  neighborhood TEXT NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'published', 'rejected', 'sold', 'rented', 'archived')),
  rejection_reason TEXT,
  featured BOOLEAN DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- 3. TABELA DE ESPECIFICAÇÕES DE VEÍCULOS
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL UNIQUE REFERENCES public.listings(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year INTEGER NOT NULL,
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Gasolina', 'Diesel', 'Híbrido', 'Elétrico')),
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automática')),
  drive_type TEXT DEFAULT '4x2',
  color TEXT,
  engine TEXT,
  doors INTEGER DEFAULT 4,
  seats INTEGER DEFAULT 5,
  condition TEXT DEFAULT 'Usado'
);

-- 4. TABELA DE ESPECIFICAÇÕES DE IMÓVEIS
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL UNIQUE REFERENCES public.listings(id) ON DELETE CASCADE,
  property_type TEXT NOT NULL CHECK (property_type IN ('Moradia', 'Apartamento', 'Terreno', 'Escritório', 'Loja', 'Armazém')),
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area_m2 NUMERIC,
  parking_spaces INTEGER DEFAULT 0,
  furnished BOOLEAN DEFAULT false,
  condominium BOOLEAN DEFAULT false,
  floor INTEGER,
  total_floors INTEGER,
  construction_year INTEGER
);

-- 5. TABELA DE FOTOGRAFIAS DO ANÚNCIO
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. TABELA DE FAVORITOS
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_listing_favorite UNIQUE (user_id, listing_id)
);

-- 7. TABELA DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. TABELA DE DEFINIÇÕES DA PLATAFORMA (SITE SETTINGS)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. TABELA DE LOGS DE AUDITORIA DE ADMINISTRAÇÃO
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ÍNDICES DE PERFORMANCE PARA BUSCA E FILTROS RÁPIDOS
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_province ON public.listings(province);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON public.listings(featured);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON public.vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- =================================================================
-- FUNÇÕES E TRIGGERS AUTOMÁTICOS
-- =================================================================

-- Função auxiliar de verificação de permissão de admin / moderador
CREATE OR REPLACE FUNCTION public.is_admin_or_moderator(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente aquando do registo no Supabase Auth
-- O primeiro utilizador a registar-se na plataforma torna-se ADMINISTRADOR automaticamente!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_count integer;
  assigned_role public.user_role;
BEGIN
  -- Se for o primeiro registo na base de dados, atribui papel de 'admin' automaticamente
  SELECT count(*) INTO profile_count FROM public.profiles;
  IF profile_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'user';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    first_name,
    last_name,
    phone,
    role,
    is_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'apelido', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.raw_user_meta_data->>'telefone', ''),
    assigned_role,
    CASE WHEN assigned_role = 'admin' THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função RPC para incrementar visualizações com segurança
CREATE OR REPLACE FUNCTION public.increment_listing_views(target_listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.listings
  SET views_count = views_count + 1
  WHERE id = target_listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- CONFIGURAÇÃO DOS BUCKETS DE STORAGE
-- =================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('listing-images', 'listing-images', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- =================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. Políticas de PROFILES
CREATE POLICY "Perfis públicos são visíveis por todos"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Utilizadores podem atualizar apenas o seu perfil (sem alterar papel)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins têm controlo total sobre perfis"
  ON public.profiles FOR ALL
  USING (public.is_admin_or_moderator(auth.uid()));

-- 2. Políticas de LISTINGS
CREATE POLICY "Anúncios publicados e vendidos são visíveis para todos"
  ON public.listings FOR SELECT
  USING (status IN ('published', 'sold', 'rented') OR auth.uid() = user_id OR public.is_admin_or_moderator(auth.uid()));

CREATE POLICY "Utilizadores autenticados podem criar anúncios"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilizadores podem editar os seus anúncios"
  ON public.listings FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin_or_moderator(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin_or_moderator(auth.uid()));

CREATE POLICY "Utilizadores podem eliminar os seus anúncios"
  ON public.listings FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin_or_moderator(auth.uid()));

-- 3. Políticas de VEHICLES e PROPERTIES
CREATE POLICY "Veículos visíveis se anúncio visível"
  ON public.vehicles FOR SELECT
  USING (true);

CREATE POLICY "Utilizadores podem gerir veículos do seu anúncio"
  ON public.vehicles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (user_id = auth.uid() OR public.is_admin_or_moderator(auth.uid())))
  );

CREATE POLICY "Imóveis visíveis se anúncio visível"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Utilizadores podem gerir imóveis do seu anúncio"
  ON public.properties FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (user_id = auth.uid() OR public.is_admin_or_moderator(auth.uid())))
  );

-- 4. Políticas de LISTING_IMAGES
CREATE POLICY "Imagens públicas para visualização"
  ON public.listing_images FOR SELECT
  USING (true);

CREATE POLICY "Utilizadores podem gerir imagens dos seus anúncios"
  ON public.listing_images FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND (user_id = auth.uid() OR public.is_admin_or_moderator(auth.uid())))
  );

-- 5. Políticas de FAVORITES
CREATE POLICY "Utilizadores gerem os seus próprios favoritos"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Políticas de NOTIFICATIONS
CREATE POLICY "Utilizadores consultam as suas notificações"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Políticas de SITE_SETTINGS
CREATE POLICY "Definições públicas visíveis para todos"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Apenas admins alteram definições"
  ON public.site_settings FOR ALL
  USING (public.is_admin_or_moderator(auth.uid()));

-- 8. Políticas de ADMIN_ACTIVITY_LOGS
CREATE POLICY "Apenas administradores consultam logs"
  ON public.admin_activity_logs FOR SELECT
  USING (public.is_admin_or_moderator(auth.uid()));

CREATE POLICY "Admins podem registar ações"
  ON public.admin_activity_logs FOR INSERT
  WITH CHECK (public.is_admin_or_moderator(auth.uid()));

-- =================================================================
-- POLÍTICAS DE STORAGE (BUCKETS)
-- =================================================================
CREATE POLICY "Imagens de anúncios são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

CREATE POLICY "Utilizadores autenticados podem carregar imagens de anúncios"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Utilizadores podem remover imagens enviadas por si"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Avatares são públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Utilizadores atualizam o seu avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
