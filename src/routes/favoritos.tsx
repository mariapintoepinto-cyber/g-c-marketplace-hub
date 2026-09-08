import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Heart, Home as HomeIcon, LogIn } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { useLoja } from "@/lib/store";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Os Meus Favoritos — G&C Solutions" },
      {
        name: "description",
        content: "Consulte e gira os seus carros e imóveis guardados nos favoritos na G&C Solutions.",
      },
    ],
  }),
  component: PaginaFavoritos,
});

function PaginaFavoritos() {
  const { favoritos, anuncios, utilizador } = useLoja();

  const salvos = anuncios.filter((a) => favoritos.includes(a.id));

  return (
    <div className="min-h-[75vh] bg-surface pb-16">
      {/* Header */}
      <section className="bg-navy py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold">
              <Heart className="h-6 w-6 fill-gold" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Os Meus Favoritos</h1>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                {salvos.length} {salvos.length === 1 ? "anúncio guardado" : "anúncios guardados"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6">
        {!utilizador ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-navy">
              <LogIn className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-navy">Inicie sessão para aceder aos seus favoritos</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Guarde viaturas e imóveis que mais lhe interessam para consultar a qualquer momento e receber novidades.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/entrar"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy-dark hover:bg-gold-strong"
              >
                <LogIn className="h-4 w-4" /> Entrar na Conta
              </Link>
              <Link
                to="/registar"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-bold text-navy hover:bg-surface"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        ) : salvos.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy/5 text-muted-foreground">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-navy">Ainda não guardou nenhum anúncio</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Clique no ícone de coração em qualquer anúncio para salvá-lo nesta lista e consultá-lo facilmente mais
              tarde.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/carros"
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-dark"
              >
                <Car className="h-4 w-4" /> Explorar Carros
              </Link>
              <Link
                to="/casas"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark hover:bg-gold-strong"
              >
                <HomeIcon className="h-4 w-4" /> Explorar Casas
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {salvos.map((anuncio) => (
              <ListingCard key={anuncio.id} anuncio={anuncio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
