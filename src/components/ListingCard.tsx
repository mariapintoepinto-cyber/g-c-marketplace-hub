import { Link } from "@tanstack/react-router";
import {
  Bath,
  BedDouble,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  Maximize,
  MessageCircle,
} from "lucide-react";
import type { Anuncio } from "@/data/listings";
import { formatKm, formatPreco } from "@/lib/format";
import { whatsappLink } from "@/lib/config";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ListingCard({ anuncio }: { anuncio: Anuncio }) {
  const { alternarFavorito, eFavorito } = useLoja();
  const carro = anuncio.categoria === "carro";
  const favorito = eFavorito(anuncio.id);
  const badge = carro ? "Venda" : (anuncio.imovel?.finalidade ?? "Venda");

  return (
    <article className="card-elevated group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative">
        <Link
          to={carro ? "/carros/$id" : "/casas/$id"}
          params={{ id: anuncio.id }}
          className="block aspect-[4/3] overflow-hidden"
        >
          <img
            src={anuncio.imagens[0]}
            alt={anuncio.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <span
          className={cn(
            "absolute left-3 top-3 rounded-md px-2 py-1 text-[11px] font-bold uppercase tracking-wide",
            badge === "Arrendamento" ? "bg-navy text-white" : "bg-gold text-navy-dark",
          )}
        >
          {badge}
        </span>
        <button
          onClick={() => alternarFavorito(anuncio.id)}
          aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-navy shadow-sm transition-colors hover:bg-white"
        >
          <Heart className={cn("h-4 w-4", favorito && "fill-destructive text-destructive")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Link
          to={carro ? "/carros/$id" : "/casas/$id"}
          params={{ id: anuncio.id }}
          className="truncate text-[15px] font-bold text-navy hover:text-gold-strong"
        >
          {anuncio.titulo}
        </Link>

        {carro && anuncio.veiculo ? (
          <>
            <p className="text-xs text-muted-foreground">
              {anuncio.veiculo.ano} • {anuncio.veiculo.tracao} • {anuncio.veiculo.transmissao}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Fuel className="h-3.5 w-3.5" /> {anuncio.veiculo.combustivel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5" /> {formatKm(anuncio.veiculo.quilometragem)}
              </span>
            </div>
          </>
        ) : (
          anuncio.imovel && (
            <>
              <p className="text-xs text-muted-foreground">
                {anuncio.bairro} - {anuncio.provincia}
              </p>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                {anuncio.imovel.quartos > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <BedDouble className="h-3.5 w-3.5" /> {anuncio.imovel.quartos} quartos
                  </span>
                )}
                {anuncio.imovel.casasBanho > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Bath className="h-3.5 w-3.5" /> {anuncio.imovel.casasBanho} casas de banho
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Maximize className="h-3.5 w-3.5" /> {anuncio.imovel.area} m²
                </span>
              </div>
            </>
          )
        )}

        <p className="mt-1 text-lg font-extrabold text-navy">
          {formatPreco(anuncio.preco, anuncio.imovel?.finalidade)}
        </p>

        {carro && (
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {anuncio.provincia}
          </p>
        )}

        <a
          href={whatsappLink(anuncio.titulo)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> Contactar
        </a>
      </div>
    </article>
  );
}
