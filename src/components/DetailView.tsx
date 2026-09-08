import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import type { Anuncio } from "@/data/listings";
import { SITE, whatsappLink } from "@/lib/config";
import { formatKm, formatPreco } from "@/lib/format";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DetailView({ anuncio }: { anuncio: Anuncio }) {
  const [activa, setActiva] = useState(0);
  const { alternarFavorito, eFavorito } = useLoja();
  const favorito = eFavorito(anuncio.id);
  const carro = anuncio.categoria === "carro";

  const info: [string, string][] = carro && anuncio.veiculo
    ? [
        ["Ano", String(anuncio.veiculo.ano)],
        ["Marca", anuncio.veiculo.marca],
        ["Modelo", anuncio.veiculo.modelo],
        ["Quilometragem", formatKm(anuncio.veiculo.quilometragem)],
        ["Combustível", anuncio.veiculo.combustivel],
        ["Transmissão", anuncio.veiculo.transmissao],
        ["Tracção", anuncio.veiculo.tracao],
        ["Cor", anuncio.veiculo.cor],
        ["Localização", `${anuncio.bairro} - ${anuncio.provincia}`],
      ]
    : anuncio.imovel
      ? [
          ["Tipo de imóvel", anuncio.imovel.tipo],
          ["Finalidade", anuncio.imovel.finalidade],
          ["Quartos", String(anuncio.imovel.quartos)],
          ["Casas de banho", String(anuncio.imovel.casasBanho)],
          ["Área", `${anuncio.imovel.area} m²`],
          ["Estacionamento", `${anuncio.imovel.estacionamento} lugares`],
          ["Localização", `${anuncio.bairro} - ${anuncio.provincia}`],
        ]
      : [];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <nav className="mb-5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-gold-strong">
          Início
        </Link>{" "}
        /{" "}
        <Link to={carro ? "/carros" : "/casas"} className="hover:text-gold-strong">
          {carro ? "Carros" : "Casas e Imóveis"}
        </Link>{" "}
        / <span className="text-navy">{anuncio.titulo}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div>
          <div className="overflow-hidden rounded-xl border border-border">
            <img
              src={anuncio.imagens[activa]}
              alt={anuncio.titulo}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          {anuncio.imagens.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {anuncio.imagens.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiva(i)}
                  className={cn(
                    "h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    i === activa ? "border-gold" : "border-transparent",
                  )}
                >
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-extrabold text-navy">Descrição</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{anuncio.descricao}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-extrabold text-navy">Informações</h2>
            <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {info.map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-2 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-semibold text-navy">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {anuncio.caracteristicas && anuncio.caracteristicas.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-extrabold text-navy">Características</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {anuncio.caracteristicas.map((c) => (
                  <li key={c} className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-navy">
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h1 className="text-xl font-extrabold text-navy">{anuncio.titulo}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {anuncio.bairro} - {anuncio.provincia}
            </p>
            <p className="mt-3 text-3xl font-extrabold text-navy">
              {formatPreco(anuncio.preco, anuncio.imovel?.finalidade)}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href={whatsappLink(anuncio.titulo)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-bold text-white hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Contactar pelo WhatsApp
              </a>
              <a
                href={`tel:${SITE.whatsapp}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-bold text-white hover:bg-navy-dark"
              >
                <Phone className="h-4 w-4" /> Ligar
              </a>
              <button
                onClick={() => alternarFavorito(anuncio.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-bold text-navy hover:bg-surface"
              >
                <Heart className={cn("h-4 w-4", favorito && "fill-destructive text-destructive")} />
                {favorito ? "Nos favoritos" : "Adicionar aos favoritos"}
              </button>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vendedor</p>
              <p className="mt-1 font-bold text-navy">{anuncio.vendedor.nome}</p>
              <p className="text-sm text-muted-foreground">{anuncio.vendedor.tipo}</p>
              <p className="text-sm text-muted-foreground">{anuncio.vendedor.telefone}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
