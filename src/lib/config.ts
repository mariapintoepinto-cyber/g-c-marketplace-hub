// Configuração central da G&C Solutions
export const SITE = {
  nome: "G&C Solutions",
  posicionamento: "CARROS • CASAS • NEGÓCIOS",
  // Número de WhatsApp do negócio (formato internacional, sem espaços)
  whatsapp: "+244925649926",
  telefone: "+244 925 649 926",
  email: "geral@gcsolutions.ao",
  endereco: "Luanda, Angola",
  redes: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    youtube: "https://youtube.com",
  },
};

export function whatsappLink(titulo?: string) {
  const numero = SITE.whatsapp.replace(/\D/g, "");
  const base = "Olá, estou interessado neste anúncio publicado na G&C Solutions.";
  const msg = titulo ? `${base} Anúncio: ${titulo}.` : base;
  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
}
