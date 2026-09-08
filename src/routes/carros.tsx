import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import { MARCAS, PROVINCIAS } from "@/data/listings";
import { filtrar } from "@/lib/filter";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Busca {
  q: string;
  local: string;
  faixa: number;
  marca: string;
  precoMin: number;
  precoMax: number;
  ano: number;
  kmMax: number;
  combustivel: string;
  transmissao: string;
  ordenar: string;
}

export const Route = createFileRoute("/carros")({
  validateSearch: (s: Record<string, unknown>): Busca => ({
    q: (s.q as string) ?? "",
    local: (s.local as string) ?? "Todas",
    faixa: Number(s.faixa) || 0,
    marca: (s.marca as string) ?? "Todas",
    precoMin: Number(s.precoMin) || 0,
    precoMax: Number(s.precoMax) || 0,
    ano: Number(s.ano) || 0,
    kmMax: Number(s.kmMax) || 0,
    combustivel: (s.combustivel as string) ?? "Todos",
    transmissao: (s.transmissao as string) ?? "Todas",
    ordenar: (s.ordenar as string) ?? "recentes",
  }),
  head: () => ({
    meta: [
      { title: "Carros à Venda em Angola — G&C Solutions" },
      {
        name: "description",
        content: "Veja carros à venda em Angola. Filtre por marca, preço, ano, combustível e localização.",
      },
      { property: "og:title", content: "Carros à Venda em Angola" },
      { property: "og:description", content: "Compare viaturas e contacte o vendedor pelo WhatsApp." },
    ],
  }),
  component: PaginaCarros,
});

const CAMPO = "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-navy outline-none focus:border-gold";
const ETIQUETA = "mb-1 block text-xs font-semibold text-navy";

function PaginaCarros() {
  const busca = Route.useSearch();
  const navigate = useNavigate({ from: "/carros" });
  const { anuncios } = useLoja();
  const [vista, setVista] = useState<"grelha" | "lista">("grelha");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const set = (v: Partial<Busca>) => navigate({ search: (p) => ({ ...p, ...v }) });
  const lista = filtrar(
    anuncios.filter((a) => a.categoria === "carro"),
    busca,
  );

  return (
    <div className="bg-surface">
      <div className="bg-navy py-10">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Carros à Venda em Angola</h1>
          <p className="mt-2 text-sm text-white/75">
            {lista.length} {lista.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <button
          onClick={() => setFiltrosAbertos((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-navy lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> {filtrosAbertos ? "Ocultar filtros" : "Mostrar filtros"}
        </button>

        <aside
          className={cn(
            "h-fit rounded-xl border border-border bg-card p-5",
            filtrosAbertos ? "block" : "hidden lg:block",
          )}
        >
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-navy">Filtros</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={ETIQUETA} htmlFor="q">
                Pesquisar
              </label>
              <input
                id="q"
                value={busca.q}
                onChange={(e) => set({ q: e.target.value })}
                placeholder="Toyota, Hilux..."
                className={CAMPO}
              />
            </div>
            <div>
              <label className={ETIQUETA} htmlFor="marca">
                Marca
              </label>
              <select id="marca" value={busca.marca} onChange={(e) => set({ marca: e.target.value })} className={CAMPO}>
                <option value="Todas">Todas</option>
                {MARCAS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={ETIQUETA} htmlFor="precoMin">
                  Preço mínimo
                </label>
                <input
                  id="precoMin"
                  type="number"
                  min={0}
                  value={busca.precoMin || ""}
                  onChange={(e) => set({ precoMin: Number(e.target.value) })}
                  placeholder="0 Kz"
                  className={CAMPO}
                />
              </div>
              <div>
                <label className={ETIQUETA} htmlFor="precoMax">
                  Preço máximo
                </label>
                <input
                  id="precoMax"
                  type="number"
                  min={0}
                  value={busca.precoMax || ""}
                  onChange={(e) => set({ precoMax: Number(e.target.value) })}
                  placeholder="Sem limite"
                  className={CAMPO}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={ETIQUETA} htmlFor="ano">
                  Ano (a partir de)
                </label>
                <input
                  id="ano"
                  type="number"
                  value={busca.ano || ""}
                  onChange={(e) => set({ ano: Number(e.target.value) })}
                  placeholder="2015"
                  className={CAMPO}
                />
              </div>
              <div>
                <label className={ETIQUETA} htmlFor="kmMax">
                  Quilometragem máx.
                </label>
                <input
                  id="kmMax"
                  type="number"
                  value={busca.kmMax || ""}
                  onChange={(e) => set({ kmMax: Number(e.target.value) })}
                  placeholder="150000"
                  className={CAMPO}
                />
              </div>
            </div>
            <div>
              <label className={ETIQUETA} htmlFor="combustivel">
                Combustível
              </label>
              <select
                id="combustivel"
                value={busca.combustivel}
                onChange={(e) => set({ combustivel: e.target.value })}
                className={CAMPO}
              >
                {["Todos", "Gasolina", "Diesel", "Híbrido", "Elétrico"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={ETIQUETA} htmlFor="transmissao">
                Transmissão
              </label>
              <select
                id="transmissao"
                value={busca.transmissao}
                onChange={(e) => set({ transmissao: e.target.value })}
                className={CAMPO}
              >
                {["Todas", "Manual", "Automática"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={ETIQUETA} htmlFor="local">
                Localização
              </label>
              <select id="local" value={busca.local} onChange={(e) => set({ local: e.target.value })} className={CAMPO}>
                <option value="Todas">Todas</option>
                {PROVINCIAS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() =>
                navigate({
                  search: {
                    q: "",
                    local: "Todas",
                    faixa: 0,
                    marca: "Todas",
                    precoMin: 0,
                    precoMax: 0,
                    ano: 0,
                    kmMax: 0,
                    combustivel: "Todos",
                    transmissao: "Todas",
                    ordenar: "recentes",
                  },
                })
              }
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-bold text-navy hover:bg-surface"
            >
              Limpar filtros
            </button>
          </div>
        </aside>

        <section>
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-3">
            <select
              value={busca.ordenar}
              onChange={(e) => set({ ordenar: e.target.value })}
              className="min-w-0 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-navy outline-none"
              aria-label="Ordenar"
            >
              <option value="recentes">Mais recentes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="mais-vistos">Mais vistos</option>
            </select>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => setVista("grelha")}
                aria-label="Ver em grelha"
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg",
                  vista === "grelha" ? "bg-navy text-white" : "text-navy hover:bg-surface",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVista("lista")}
                aria-label="Ver em lista"
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-lg",
                  vista === "lista" ? "bg-navy text-white" : "text-navy hover:bg-surface",
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {lista.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <p className="font-bold text-navy">Não encontrámos anúncios com estes critérios.</p>
              <button
                onClick={() =>
                  navigate({
                    search: {
                      q: "",
                      local: "Todas",
                      faixa: 0,
                      marca: "Todas",
                      precoMin: 0,
                      precoMax: 0,
                      ano: 0,
                      kmMax: 0,
                      combustivel: "Todos",
                      transmissao: "Todas",
                      ordenar: "recentes",
                    },
                  })
                }
                className="mt-4 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4",
                vista === "grelha" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:max-w-2xl",
              )}
            >
              {lista.map((a) => (
                <ListingCard key={a.id} anuncio={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
