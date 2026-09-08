import { useNavigate } from "@tanstack/react-router";
import { Car, Home, MapPin, Search, Tag } from "lucide-react";
import { useState } from "react";
import { FAIXAS_PRECO, PROVINCIAS } from "@/data/listings";
import { cn } from "@/lib/utils";

export function SearchPanel({
  categoriaInicial = "carro",
  q: qInicial = "",
  local: localInicial = "Todas",
  faixa: faixaInicial = 0,
}: {
  categoriaInicial?: "carro" | "imovel";
  q?: string;
  local?: string;
  faixa?: number;
}) {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState<"carro" | "imovel">(categoriaInicial);
  const [q, setQ] = useState(qInicial);
  const [local, setLocal] = useState(localInicial);
  const [faixa, setFaixa] = useState(faixaInicial);

  function pesquisar(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: categoria === "carro" ? "/carros" : "/casas",
      search: { q, local, faixa },
    });
  }

  return (
    <form
      onSubmit={pesquisar}
      className="panel-shadow rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex gap-2">
        {(
          [
            { valor: "carro", label: "Carros", Icone: Car },
            { valor: "imovel", label: "Casas", Icone: Home },
          ] as const
        ).map(({ valor, label, Icone }) => (
          <button
            key={valor}
            type="button"
            onClick={() => setCategoria(valor)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors",
              categoria === valor
                ? "bg-navy text-white"
                : "bg-surface text-navy hover:bg-muted",
            )}
          >
            <Icone className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
        <label className="flex min-w-0 flex-col rounded-lg border border-border px-3 py-2 focus-within:border-gold">
          <span className="sr-only">O que procura</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="O que procura? (ex.: Toyota, apartamento, etc...)"
            className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-muted-foreground"
          />
        </label>

        <label className="flex min-w-0 items-center gap-2 rounded-lg border border-border px-3 py-2 focus-within:border-gold">
          <MapPin className="h-4 w-4 shrink-0 text-navy" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-muted-foreground">Localização</span>
            <select
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-navy outline-none"
            >
              <option value="Todas">Todas</option>
              {PROVINCIAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="flex min-w-0 items-center gap-2 rounded-lg border border-border px-3 py-2 focus-within:border-gold">
          <Tag className="h-4 w-4 shrink-0 text-navy" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] text-muted-foreground">Preço</span>
            <select
              value={faixa}
              onChange={(e) => setFaixa(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-semibold text-navy outline-none"
            >
              {FAIXAS_PRECO.map((f, i) => (
                <option key={f.label} value={i}>
                  {f.label}
                </option>
              ))}
            </select>
          </span>
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-navy-dark transition-colors hover:bg-gold-strong"
        >
          <Search className="h-4 w-4" /> Pesquisar
        </button>
      </div>
    </form>
  );
}
