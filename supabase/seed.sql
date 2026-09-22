-- =================================================================
-- Seed Data para G&C Solutions Marketplace
-- Carros • Casas • Negócios em Angola
-- =================================================================

-- Inserir definições padrão da plataforma
INSERT INTO public.site_settings (key, value)
VALUES
  ('general', '{"name": "G&C Solutions", "tagline": "CARROS • CASAS • NEGÓCIOS", "email": "geral@gcsolutions.ao", "phone": "+244 925 649 926", "whatsapp": "244925649926", "address": "Luanda, Angola"}'::jsonb),
  ('listings', '{"require_approval": true, "allow_auto_publish": false, "max_images_per_listing": 10}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Criar perfil de sistema/demonstração se não existir
-- (UUID fixo para o utilizador padrão de demonstração)
DO $$
DECLARE
  demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
  l1 UUID := '10000000-0000-0000-0000-000000000001';
  l2 UUID := '10000000-0000-0000-0000-000000000002';
  l3 UUID := '10000000-0000-0000-0000-000000000003';
  l4 UUID := '10000000-0000-0000-0000-000000000004';
  l5 UUID := '20000000-0000-0000-0000-000000000001';
  l6 UUID := '20000000-0000-0000-0000-000000000002';
  l7 UUID := '20000000-0000-0000-0000-000000000003';
  l8 UUID := '20000000-0000-0000-0000-000000000004';
BEGIN
  -- 1. Inserir Perfil Demo
  INSERT INTO public.profiles (id, full_name, first_name, last_name, email, phone, role, is_verified)
  VALUES (demo_user_id, 'G&C Solutions Stand', 'G&C', 'Solutions', 'admin@gcsolutions.ao', '+244 925 649 926', 'admin', true)
  ON CONFLICT (id) DO NOTHING;

  -- 2. CARROS
  -- 2.1 Toyota Land Cruiser Prado
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l1, demo_user_id, 'vehicle', 'sale', 'Toyota Land Cruiser Prado', 'toyota-land-cruiser-prado-2021',
    'Viatura em excelente estado, manutenção sempre feita em oficina autorizada. Interior em pele, sistema multimédia, câmara de marcha-atrás e pneus novos.',
    54000000, 'Luanda', 'Talatona', 'published', true, 1240, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.vehicles (listing_id, brand, model, version, year, mileage, fuel_type, transmission, drive_type, color)
  VALUES (l1, 'Toyota', 'Land Cruiser Prado', 'TXL', 2021, 45000, 'Diesel', 'Automática', '4x4', 'Preto')
  ON CONFLICT (listing_id) DO NOTHING;

  -- 2.2 Toyota Hilux
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l2, demo_user_id, 'vehicle', 'sale', 'Toyota Hilux 2.8 GD-6', 'toyota-hilux-2019',
    'Carrinha robusta e fiável, perfeita para todo-o-terreno ou trabalho em Angola. Ar condicionado em excelente estado, revisões em dia.',
    32500000, 'Luanda', 'Maianga', 'published', true, 980, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.vehicles (listing_id, brand, model, version, year, mileage, fuel_type, transmission, drive_type, color)
  VALUES (l2, 'Toyota', 'Hilux', '2.8 GD-6', 2019, 120000, 'Diesel', 'Manual', '4x4', 'Branco')
  ON CONFLICT (listing_id) DO NOTHING;

  -- 2.3 Hyundai Tucson
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l3, demo_user_id, 'vehicle', 'sale', 'Hyundai Tucson 2.0', 'hyundai-tucson-2022',
    'SUV moderna, extremamente económica e confortável. Apenas 25.000 km rodados, teto panorâmico e sistema de som premium.',
    28000000, 'Luanda', 'Kilamba', 'published', true, 760, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.vehicles (listing_id, brand, model, version, year, mileage, fuel_type, transmission, drive_type, color)
  VALUES (l3, 'Hyundai', 'Tucson', '2.0 Confort', 2022, 25000, 'Gasolina', 'Automática', '4x2', 'Cinzento')
  ON CONFLICT (listing_id) DO NOTHING;

  -- 2.4 BMW 320i
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l4, demo_user_id, 'vehicle', 'sale', 'BMW 320i Sedan', 'bmw-320i-2018',
    'Berlina desportiva executiva em ótimo estado. Bancos elétricos com memória, sensores dianteiros e traseiros.',
    24500000, 'Luanda', 'Benfica', 'published', true, 640, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.vehicles (listing_id, brand, model, version, year, mileage, fuel_type, transmission, drive_type, color)
  VALUES (l4, 'BMW', '320i', 'Sport', 2018, 80000, 'Gasolina', 'Automática', '4x2', 'Azul')
  ON CONFLICT (listing_id) DO NOTHING;

  -- 3. IMÓVEIS
  -- 3.1 Moradia T3
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l5, demo_user_id, 'property', 'sale', 'Moradia T3 no Bairro da Maianga', 'moradia-t3-maianga',
    'Excelente moradia com 3 suítes, sala ampla para dois ambientes, cozinha mobilada e quintal espaçoso com churrasqueira e anexo.',
    45000000, 'Luanda', 'Maianga', 'published', true, 1420, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.properties (listing_id, property_type, bedrooms, bathrooms, area_m2, parking_spaces, furnished, condominium)
  VALUES (l5, 'Moradia', 3, 3, 200, 2, true, false)
  ON CONFLICT (listing_id) DO NOTHING;

  -- 3.2 Apartamento T2 Talatona
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l6, demo_user_id, 'property', 'rent', 'Apartamento T2 em Talatona', 'apartamento-t2-talatona',
    'Apartamento moderno em condomínio fechado com piscina, ginásio e segurança 24 horas. Gerador e tanque de água incluídos.',
    1200000, 'Luanda', 'Talatona', 'published', true, 1180, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.properties (listing_id, property_type, bedrooms, bathrooms, area_m2, parking_spaces, furnished, condominium)
  VALUES (l6, 'Apartamento', 2, 2, 120, 2, true, true)
  ON CONFLICT (listing_id) DO NOTHING;

  -- 3.3 Moradia T4 Kilamba
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l7, demo_user_id, 'property', 'sale', 'Moradia T4 no Kilamba', 'moradia-t4-kilamba',
    'Vivenda ampla com acabamentos nobres, piscina privativa, 4 quartos (2 suítes) e garagem para 3 viaturas.',
    70000000, 'Luanda', 'Kilamba', 'published', true, 890, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.properties (listing_id, property_type, bedrooms, bathrooms, area_m2, parking_spaces, furnished, condominium)
  VALUES (l7, 'Moradia', 4, 4, 300, 3, false, true)
  ON CONFLICT (listing_id) DO NOTHING;

  -- 3.4 Apartamento T3 Ingombota
  INSERT INTO public.listings (id, user_id, category, listing_type, title, slug, description, price, province, neighborhood, status, featured, views_count, published_at)
  VALUES (
    l8, demo_user_id, 'property', 'rent', 'Apartamento T3 na Ingombota', 'apartamento-t3-ingombota',
    'Vista deslumbrante para a Baía de Luanda. Apartamento com excelente iluminação natural, climatizado e com elevador funcional.',
    1500000, 'Luanda', 'Ingombota', 'published', true, 950, now()
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.properties (listing_id, property_type, bedrooms, bathrooms, area_m2, parking_spaces, furnished, condominium)
  VALUES (l8, 'Apartamento', 3, 2, 150, 1, true, true)
  ON CONFLICT (listing_id) DO NOTHING;
END $$;
