import { createFileRoute } from "@tanstack/react-router";
import { DetailView } from "@/components/DetailView";
import { useLoja } from "@/lib/store";

export const Route = createFileRoute("/carros/$id")({
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
  const anuncio = anuncios.find((a) => a.id === id && a.categoria === "carro");

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
