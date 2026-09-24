import { supabase, isSupabaseConfigured, type ListingRecord } from "@/lib/supabase";
import { ANUNCIOS, type Anuncio, type Estado } from "@/data/listings";
import carPrado from "@/assets/car-prado.jpg";
import casaT3 from "@/assets/house-moradia-t3.jpg";

export function mapSupabaseListingToAnuncio(row: any): Anuncio {
  const isVehicle = row.category === "vehicle";
  const vehicleData = Array.isArray(row.vehicles) ? row.vehicles[0] : row.vehicles;
  const propertyData = Array.isArray(row.properties) ? row.properties[0] : row.properties;

  let imagens: string[] = [];
  if (Array.isArray(row.listing_images) && row.listing_images.length > 0) {
    imagens = [...row.listing_images]
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((img: any) => img.image_url)
      .filter(Boolean);
  }
  if (imagens.length === 0) {
    imagens = [isVehicle ? carPrado : casaT3];
  }

  const profile = row.profiles;
  const vendedor = {
    nome:
      profile?.full_name ||
      (profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}`.trim() : "Vendedor G&C"),
    telefone: profile?.phone || "+244 925 649 926",
    tipo: profile?.role === "dealer" ? "Stand Profissional" : "Vendedor verificado",
  };

  const estado: Estado =
    row.status === "published" ? "activo" : row.status === "sold" ? "vendido" : "pausado";

  const veiculo =
    isVehicle && vehicleData
      ? {
          marca: vehicleData.brand || "Toyota",
          modelo: vehicleData.model || row.title,
          ano: Number(vehicleData.year) || 2021,
          quilometragem: Number(vehicleData.mileage) || 0,
          combustivel: (vehicleData.fuel_type || "Gasolina") as any,
          transmissao: (vehicleData.transmission || "Automática") as any,
          tracao: vehicleData.drive_type || "4x2",
          cor: vehicleData.color || "Branco",
        }
      : undefined;

  const imovel =
    !isVehicle && propertyData
      ? {
          tipo: (propertyData.property_type || "Moradia") as any,
          quartos: Number(propertyData.bedrooms) || 0,
          casasBanho: Number(propertyData.bathrooms) || 0,
          area: Number(propertyData.area_m2) || 120,
          finalidade: (row.listing_type === "rent" ? "Arrendamento" : "Venda") as any,
          estacionamento: Number(propertyData.parking_spaces) || 0,
        }
      : undefined;

  return {
    id: row.id,
    userId: row.user_id || "u-local",
    categoria: isVehicle ? "carro" : "imovel",
    titulo: row.title || "",
    descricao: row.description || "",
    preco: Number(row.price) || 0,
    bairro: row.neighborhood || "Talatona",
    provincia: row.province || "Luanda",
    estado,
    visualizacoes: Number(row.views_count) || 0,
    criadoEm: row.created_at
      ? new Date(row.created_at).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    imagens,
    vendedor,
    veiculo,
    imovel,
    caracteristicas: Array.isArray(row.features) ? row.features : [],
    destaque: Boolean(row.featured),
  };
}

export interface ListingFilterOptions {
  category?: "vehicle" | "property";
  query?: string;
  brand?: string;
  model?: string;
  propertyType?: string;
  listingType?: "sale" | "rent";
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  maxKm?: number;
  fuelType?: string;
  transmission?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  status?: string;
  featured?: boolean;
  sortBy?: "recentes" | "menor-preco" | "maior-preco" | "mais-vistos";
  page?: number;
  pageSize?: number;
}

export async function fetchListings(options: ListingFilterOptions = {}) {
  const {
    category,
    query,
    brand,
    model,
    propertyType,
    listingType,
    province,
    minPrice,
    maxPrice,
    year,
    fuelType,
    transmission,
    bedrooms,
    status = "published",
    featured,
    sortBy = "recentes",
    page = 1,
    pageSize = 12,
  } = options;

  if (!isSupabaseConfigured) {
    // Modo fallback com dados de demonstração
    let resultado = [...ANUNCIOS];
    if (category) {
      const catVal = category === "vehicle" ? "carro" : "imovel";
      resultado = resultado.filter((a) => a.categoria === catVal);
    }
    if (province && province !== "Todas") {
      resultado = resultado.filter((a) => a.provincia === province);
    }
    if (minPrice && minPrice > 0) {
      resultado = resultado.filter((a) => a.preco >= minPrice);
    }
    if (maxPrice && maxPrice > 0) {
      resultado = resultado.filter((a) => a.preco <= maxPrice);
    }
    if (brand && brand !== "Todas") {
      resultado = resultado.filter((a) => a.veiculo?.marca === brand);
    }
    if (fuelType && fuelType !== "Todos") {
      resultado = resultado.filter((a) => a.veiculo?.combustivel === fuelType);
    }
    if (transmission && transmission !== "Todas") {
      resultado = resultado.filter((a) => a.veiculo?.transmissao === transmission);
    }
    if (propertyType && propertyType !== "Todos") {
      resultado = resultado.filter((a) => a.imovel?.tipo === propertyType);
    }
    if (listingType) {
      const fin = listingType === "rent" ? "Arrendamento" : "Venda";
      resultado = resultado.filter((a) => a.imovel?.finalidade === fin);
    }
    if (query) {
      const q = query.toLowerCase();
      resultado = resultado.filter(
        (a) => a.titulo.toLowerCase().includes(q) || a.descricao.toLowerCase().includes(q),
      );
    }
    if (featured !== undefined) {
      // All dummy listings or first few can count as featured
      resultado = resultado.slice(0, 4);
    }

    // Ordenação
    if (sortBy === "menor-preco") resultado.sort((a, b) => a.preco - b.preco);
    else if (sortBy === "maior-preco") resultado.sort((a, b) => b.preco - a.preco);
    else if (sortBy === "mais-vistos") resultado.sort((a, b) => b.visualizacoes - a.visualizacoes);

    return { data: resultado, count: resultado.length, error: null };
  }

  let req = supabase
    .from("listings")
    .select(
      `
      *,
      profiles(id, full_name, phone, avatar_url, is_verified),
      vehicles(*),
      properties(*),
      listing_images(*)
    `,
      { count: "exact" },
    );

  // Status
  if (status !== "all") {
    req = req.eq("status", status);
  }

  // Categoria
  if (category) {
    req = req.eq("category", category);
  }

  // Tipo (venda / arrendamento)
  if (listingType) {
    req = req.eq("listing_type", listingType);
  }

  // Destaque
  if (featured !== undefined) {
    req = req.eq("featured", featured);
  }

  // Província
  if (province && province !== "Todas") {
    req = req.eq("province", province);
  }

  // Preço
  if (minPrice && minPrice > 0) {
    req = req.gte("price", minPrice);
  }
  if (maxPrice && maxPrice > 0) {
    req = req.lte("price", maxPrice);
  }

  // Busca textual
  if (query && query.trim()) {
    req = req.or(`title.ilike.%${query}%,description.ilike.%${query}%,neighborhood.ilike.%${query}%`);
  }

  // Ordenação no PostgreSQL
  switch (sortBy) {
    case "menor-preco":
      req = req.order("price", { ascending: true });
      break;
    case "maior-preco":
      req = req.order("price", { ascending: false });
      break;
    case "mais-vistos":
      req = req.order("views_count", { ascending: false });
      break;
    case "recentes":
    default:
      req = req.order("created_at", { ascending: false });
      break;
  }

  // Paginação
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  req = req.range(from, to);

  const { data, count, error } = await req;

  if (error) {
    console.error("Erro ao procurar anúncios no Supabase:", error);
    return { data: [], count: 0, error: error.message };
  }

  const listings: Anuncio[] = (data || []).map(mapSupabaseListingToAnuncio);
  return { data: listings, count: count || listings.length, error: null };
}

export async function fetchListingByIdOrSlug(identifier: string) {
  if (!isSupabaseConfigured) {
    const a = ANUNCIOS.find((item) => item.id === identifier);
    return { data: a || null, error: null };
  }

  // Tenta buscar por UUID ou por Slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  let query = supabase
    .from("listings")
    .select(
      `
      *,
      profiles(id, full_name, first_name, last_name, email, phone, avatar_url, is_verified),
      vehicles(*),
      properties(*),
      listing_images(*)
    `,
    );

  if (isUuid) {
    query = query.eq("id", identifier);
  } else {
    query = query.eq("slug", identifier);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Erro ao buscar detalhes do anúncio:", error);
    return { data: null, error: error.message };
  }

  if (!data) {
    // Tenta fallback com anúncios em cache/seed se não encontrado
    const fallback = ANUNCIOS.find((item) => item.id === identifier);
    return { data: fallback || null, error: null };
  }

  return { data: mapSupabaseListingToAnuncio(data), error: null };
}

export async function uploadListingPhoto(userId: string, file: File): Promise<{ url: string; path: string } | null> {
  if (!isSupabaseConfigured) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("listing-images")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error("Erro ao carregar imagem para o Storage:", uploadError);
    return null;
  }

  const { data } = supabase.storage.from("listing-images").getPublicUrl(filePath);
  return { url: data.publicUrl, path: filePath };
}

export async function createListing(dados: {
  userId: string;
  category: "vehicle" | "property";
  listingType: "sale" | "rent";
  title: string;
  description: string;
  price: number;
  province: string;
  neighborhood: string;
  features?: string[];
  vehicle?: any;
  property?: any;
  imageUrls?: string[];
}) {
  if (!isSupabaseConfigured) {
    return { data: { id: `local-${Date.now()}` }, error: null };
  }

  // Gera slug amigável único
  const baseSlug = dados.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

  // 1. Inserir anúncio principal
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .insert({
      user_id: dados.userId,
      category: dados.category,
      listing_type: dados.listingType,
      title: dados.title,
      slug,
      description: dados.description,
      price: dados.price,
      currency: "AOA",
      province: dados.province,
      neighborhood: dados.neighborhood,
      status: "pending", // Requer aprovação do admin por padrão
      featured: false,
      views_count: 0,
      features: dados.features || [],
    })
    .select()
    .single();

  if (listingError || !listing) {
    console.error("Erro ao criar anúncio:", listingError);
    return { data: null, error: listingError?.message || "Erro ao guardar anúncio" };
  }

  // 2. Inserir especificações
  if (dados.category === "vehicle" && dados.vehicle) {
    await supabase.from("vehicles").insert({
      listing_id: listing.id,
      brand: dados.vehicle.brand,
      model: dados.vehicle.model,
      version: dados.vehicle.version || null,
      year: Number(dados.vehicle.year),
      mileage: Number(dados.vehicle.mileage || 0),
      fuel_type: dados.vehicle.fuelType,
      transmission: dados.vehicle.transmission,
      drive_type: dados.vehicle.driveType || "4x2",
      color: dados.vehicle.color || null,
    });
  } else if (dados.category === "property" && dados.property) {
    await supabase.from("properties").insert({
      listing_id: listing.id,
      property_type: dados.property.propertyType,
      bedrooms: Number(dados.property.bedrooms || 0),
      bathrooms: Number(dados.property.bathrooms || 0),
      area_m2: Number(dados.property.area || 0),
      parking_spaces: Number(dados.property.parkingSpaces || 0),
      furnished: Boolean(dados.property.furnished),
      condominium: Boolean(dados.property.condominium),
    });
  }

  // 3. Inserir imagens
  if (dados.imageUrls && dados.imageUrls.length > 0) {
    const imagesToInsert = dados.imageUrls.map((url, idx) => ({
      listing_id: listing.id,
      image_url: url,
      display_order: idx,
      is_cover: idx === 0,
    }));
    await supabase.from("listing_images").insert(imagesToInsert);
  }

  return { data: listing, error: null };
}

export async function incrementListingViews(listingId: string) {
  if (!isSupabaseConfigured) return;

  // Evita incrementar repetições consecutivas na mesma sessão com localStorage
  const viewedKey = `viewed_listing_${listingId}`;
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem(viewedKey)) return;
    sessionStorage.setItem(viewedKey, "1");
  }

  // Chama a função RPC segura criada no schema
  const { error } = await supabase.rpc("increment_listing_views", {
    target_listing_id: listingId,
  });

  if (error) {
    // Alternativa direta se RPC não estiver ativo
    await supabase
      .from("listings")
      .update({ views_count: supabase.rpc("views_count + 1" as any) })
      .eq("id", listingId);
  }
}
