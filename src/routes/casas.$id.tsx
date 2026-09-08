import { createFileRoute } from "@tanstack/react-router";
import { DetailView } from "@/components/DetailView";
import { useLoja } from "@/lib/store";

export const Route = createFileRoute("/casas/$id")({
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
  const anuncio = anuncios.find((a) => a.id === id && a.categoria === "imovel");

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
