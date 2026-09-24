import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DetailView } from "@/components/DetailView";
import { useLoja } from "@/lib/store";
import { fetchListingByIdOrSlug } from "@/services/listings";
import type { Anuncio } from "@/data/listings";

export const Route = createFileRoute("/casas/$id")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Detalhes do imóvel — G&C Solutions" },
      { name: "description", content: "Fotografias, características e contacto directo do vendedor do imóvel." },
      { property: "og:title", content: "Detalhes do imóvel — G&C Solutions" },
      { property: "og:description", content: "Quartos, área, preço e contacto pelo WhatsApp." },
    ],
  }),
  component: DetalheImovel,
});

function DetalheImovel() {
  const { id } = Route.useParams();
  const { anuncios } = useLoja();
  const [anuncio, setAnuncio] = useState<Anuncio | null>(() => {
    return anuncios.find((a) => (a.id === id || (a as any).slug === id) && a.categoria === "imovel") || null;
  });
  const [carregando, setCarregando] = useState(!anuncio);

  useEffect(() => {
    let ativo = true;
    const existente = anuncios.find((a) => (a.id === id || (a as any).slug === id) && a.categoria === "imovel");
    if (existente) {
      setAnuncio(existente);
      setCarregando(false);
      return;
    }

    async function carregar() {
      setCarregando(true);
      const { data } = await fetchListingByIdOrSlug(id);
      if (ativo && data && data.categoria === "imovel") {
        setAnuncio(data);
      }
      if (ativo) setCarregando(false);
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [id, anuncios]);

  if (carregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!anuncio) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-navy">Anúncio não disponível</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este anúncio pode ter sido removido ou já foi ocupado.
        </p>
      </div>
    );
  }

  return <DetailView anuncio={anuncio} />;
}
