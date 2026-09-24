import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DetailView } from "@/components/DetailView";
import { useLoja } from "@/lib/store";
import { fetchListingByIdOrSlug } from "@/services/listings";
import type { Anuncio } from "@/data/listings";

export const Route = createFileRoute("/carros/$id")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Detalhes do carro — G&C Solutions" },
      { name: "description", content: "Veja fotografias, características e contacte o vendedor da viatura." },
      { property: "og:title", content: "Detalhes do carro — G&C Solutions" },
      { property: "og:description", content: "Fotografias, ficha técnica e contacto directo pelo WhatsApp." },
    ],
  }),
  component: DetalheCarro,
});

function DetalheCarro() {
  const { id } = Route.useParams();
  const { anuncios } = useLoja();
  const [anuncio, setAnuncio] = useState<Anuncio | null>(() => {
    return anuncios.find((a) => (a.id === id || (a as any).slug === id) && a.categoria === "carro") || null;
  });
  const [carregando, setCarregando] = useState(!anuncio);

  useEffect(() => {
    let ativo = true;
    const existente = anuncios.find((a) => (a.id === id || (a as any).slug === id) && a.categoria === "carro");
    if (existente) {
      setAnuncio(existente);
      setCarregando(false);
      return;
    }

    async function carregar() {
      setCarregando(true);
      const { data } = await fetchListingByIdOrSlug(id);
      if (ativo && data && data.categoria === "carro") {
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
          Este anúncio pode ter sido removido ou vendido.
        </p>
      </div>
    );
  }

  return <DetailView anuncio={anuncio} />;
}
