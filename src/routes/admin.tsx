import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  Eye,
  FileText,
  Filter,
  History,
  LayoutDashboard,
  Lock,
  Pause,
  Play,
  PlusCircle,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserCheck,
  UserMinus,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Anuncio } from "@/data/listings";
import { formatPreco } from "@/lib/format";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  approveListing,
  deleteListingAdmin,
  fetchActivityLogsAdmin,
  fetchAllListingsAdmin,
  fetchAdminStats,
  fetchSiteSettings,
  fetchUsersAdmin,
  rejectListing,
  toggleFeaturedListing,
  toggleUserActiveAdmin,
  updateSiteSetting,
  updateUserRoleAdmin,
  type AdminStats,
} from "@/services/admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel de Administração — G&C Solutions" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PaginaAdmin,
});

type AbaAdmin = "visao-geral" | "anuncios" | "utilizadores" | "definicoes" | "logs";

function PaginaAdmin() {
  const navigate = useNavigate();
  const { utilizador, carregandoAuth } = useLoja();

  const [aba, setAba] = useState<AbaAdmin>("visao-geral");
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 14,
    totalListings: 8,
    pendingListings: 1,
    publishedListings: 7,
    soldListings: 1,
    totalViews: 8240,
  });

  // Anúncios
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("all");
  const [filtroCategoria, setFiltroCategoria] = useState("all");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Modais de Anúncio
  const [modalRejeitar, setModalRejeitar] = useState<string | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [anuncioAEliminar, setAnuncioAEliminar] = useState<string | null>(null);

  // Utilizadores
  const [utilizadores, setUtilizadores] = useState<any[]>([]);

  // Logs e Definições
  const [logs, setLogs] = useState<any[]>([]);
  const [definicoes, setDefinicoes] = useState<any>({
    siteName: "G&C Solutions",
    whatsapp: "244925649926",
    email: "geral@gcsolutions.ao",
    phone: "+244 925 649 926",
    requireApproval: true,
    maxImages: 10,
  });

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const s = await fetchAdminStats();
      setStats(s);

      const { data: listaAnuncios } = await fetchAllListingsAdmin(filtroEstado);
      setAnuncios(listaAnuncios);

      const { data: listaUsers } = await fetchUsersAdmin();
      setUtilizadores(listaUsers);

      const { data: listaLogs } = await fetchActivityLogsAdmin(25);
      setLogs(listaLogs);

      const { data: settings } = await fetchSiteSettings();
      if (settings.general) {
        setDefinicoes((prev: any) => ({ ...prev, ...settings.general }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [filtroEstado]);

  // Verificação de Autorização: Apenas admin ou moderator
  if (!carregandoAuth && (!utilizador || (utilizador.role !== "admin" && utilizador.role !== "moderator"))) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-surface px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-card p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-navy">Acesso Não Autorizado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Apenas utilizadores com permissão de <strong>Administrador</strong> ou <strong>Moderador</strong> podem
            aceder a esta área de gestão da G&C Solutions.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-dark"
            >
              Voltar à Página Principal
            </Link>
            {!utilizador && (
              <Link
                to="/entrar"
                className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
              >
                Entrar com Conta de Administrador
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Ações de moderação
  const handleAprovar = async (id: string) => {
    await approveListing(utilizador?.id || "admin", id);
    toast.success("Anúncio aprovado e publicado com sucesso!");
    carregarDados();
  };

  const handleRejeitar = async () => {
    if (!modalRejeitar || !motivoRejeicao.trim()) {
      toast.error("Por favor indique o motivo da rejeição.");
      return;
    }
    await rejectListing(utilizador?.id || "admin", modalRejeitar, motivoRejeicao.trim());
    toast.success("Anúncio rejeitado.");
    setModalRejeitar(null);
    setMotivoRejeicao("");
    carregarDados();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await toggleFeaturedListing(utilizador?.id || "admin", id, current);
    toast.success(!current ? "Anúncio adicionado aos destaques!" : "Destaque removido.");
    carregarDados();
  };

  const handleEliminar = async () => {
    if (!anuncioAEliminar) return;
    await deleteListingAdmin(utilizador?.id || "admin", anuncioAEliminar);
    toast.success("Anúncio eliminado definitivamente.");
    setAnuncioAEliminar(null);
    carregarDados();
  };

  const handleSalvarDefinicoes = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSetting("general", definicoes);
    toast.success("Definições da plataforma salvas com sucesso!");
  };

  const anunciosFiltrados = anuncios.filter((a) => {
    if (filtroCategoria !== "all" && a.category !== filtroCategoria) return false;
    if (buscaTexto.trim()) {
      const q = buscaTexto.toLowerCase();
      return (
        a.title?.toLowerCase().includes(q) ||
        a.neighborhood?.toLowerCase().includes(q) ||
        a.province?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-[85vh] bg-surface pb-16">
      {/* Top Banner Admin */}
      <section className="bg-navy-dark py-8 text-white">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-navy-dark">
                <Shield className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold sm:text-2xl">Painel de Administração</h1>
                  <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-extrabold text-gold uppercase">
                    {utilizador?.role}
                  </span>
                </div>
                <p className="text-xs text-white/70">
                  Gestão global de anúncios, utilizadores e configurações da G&C Solutions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={carregarDados}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/20"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", carregando && "animate-spin")} /> Atualizar Dados
              </button>
              <Link
                to="/painel"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-navy-dark hover:bg-gold-strong"
              >
                Ver Minha Conta →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navegação por Abas */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6">
          <nav className="flex space-x-6 overflow-x-auto py-3">
            {[
              { id: "visao-geral", icone: LayoutDashboard, label: "Visão Geral" },
              { id: "anuncios", icone: ShoppingBag, label: "Gestão de Anúncios", badge: stats.pendingListings },
              { id: "utilizadores", icone: Users, label: "Utilizadores", badge: stats.totalUsers },
              { id: "definicoes", icone: Settings, label: "Definições da Plataforma" },
              { id: "logs", icone: History, label: "Registo de Atividades" },
            ].map((item) => {
              const Icone = item.icone;
              const activo = aba === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAba(item.id as AbaAdmin)}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-2 text-xs font-extrabold transition-all",
                    activo
                      ? "border-gold text-navy"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-navy",
                  )}
                >
                  <Icone className={cn("h-4 w-4", activo ? "text-gold-strong" : "text-muted-foreground")} />
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                        item.id === "anuncios" && stats.pendingListings > 0
                          ? "bg-amber-500 text-white"
                          : "bg-navy/10 text-navy",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Conteúdo da Aba */}
      <div className="mx-auto max-w-[1340px] px-4 pt-8 sm:px-6">
        {/* ABA: VISÃO GERAL */}
        {aba === "visao-geral" && (
          <div className="flex flex-col gap-8">
            {/* 6 Cards Estatísticos */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground">Total Utilizadores</p>
                <p className="mt-2 text-2xl font-extrabold text-navy">{stats.totalUsers}</p>
                <span className="text-[10px] font-semibold text-emerald-600">Registados</span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground">Total Anúncios</p>
                <p className="mt-2 text-2xl font-extrabold text-navy">{stats.totalListings}</p>
                <span className="text-[10px] font-semibold text-navy/70">Carros e Imóveis</span>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
                <p className="text-xs font-bold text-amber-800">Pendentes de Moderação</p>
                <p className="mt-2 text-2xl font-extrabold text-amber-700">{stats.pendingListings}</p>
                <span className="text-[10px] font-extrabold text-amber-600">Aguardam aprovação</span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
                <p className="text-xs font-bold text-emerald-800">Publicados no Site</p>
                <p className="mt-2 text-2xl font-extrabold text-emerald-700">{stats.publishedListings}</p>
                <span className="text-[10px] font-semibold text-emerald-600">Visíveis a todos</span>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
                <p className="text-xs font-bold text-blue-800">Vendidos / Concluídos</p>
                <p className="mt-2 text-2xl font-extrabold text-blue-700">{stats.soldListings}</p>
                <span className="text-[10px] font-semibold text-blue-600">Negócios fechados</span>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground">Visualizações Totais</p>
                <p className="mt-2 text-2xl font-extrabold text-navy">{stats.totalViews.toLocaleString("pt-PT")}</p>
                <span className="text-[10px] font-semibold text-muted-foreground">Alcance total</span>
              </div>
            </div>

            {/* Ações Rápidas de Moderação */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-navy">Anúncios que Precisam de Aprovação Imediata</h2>
                  <p className="text-xs text-muted-foreground">
                    Revise os dados antes de publicar os anúncios para os compradores em Angola.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFiltroEstado("pending");
                    setAba("anuncios");
                  }}
                  className="text-xs font-bold text-gold-strong hover:underline"
                >
                  Ver todos os pendentes →
                </button>
              </div>

              {anuncios.filter((a) => a.status === "pending").length === 0 ? (
                <div className="mt-6 rounded-xl bg-surface p-8 text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-emerald-600" />
                  <p className="mt-2 text-sm font-bold text-navy">Nenhum anúncio pendente no momento!</p>
                  <p className="text-xs text-muted-foreground">Todos os anúncios enviados foram moderados.</p>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-border">
                  {anuncios
                    .filter((a) => a.status === "pending")
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-800">
                            Pendente ({item.category === "vehicle" ? "Veículo" : "Imóvel"})
                          </span>
                          <h3 className="mt-1 font-bold text-sm text-navy">{item.title}</h3>
                          <p className="text-xs font-extrabold text-navy">{formatPreco(item.price)}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {item.neighborhood} — {item.province} • Vendedor: {item.profiles?.full_name || "Particular"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAprovar(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Aprovar
                          </button>
                          <button
                            type="button"
                            onClick={() => setModalRejeitar(item.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Rejeitar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: GESTÃO DE ANÚNCIOS */}
        {aba === "anuncios" && (
          <div className="flex flex-col gap-6">
            {/* Barra de Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Filtrar por título, bairro..."
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                    className="rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-xs text-navy outline-none focus:border-gold w-60"
                  />
                </div>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-navy outline-none focus:border-gold"
                >
                  <option value="all">Todos os Estados</option>
                  <option value="pending">Pendentes</option>
                  <option value="published">Publicados</option>
                  <option value="rejected">Rejeitados</option>
                  <option value="sold">Vendidos</option>
                </select>

                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-navy outline-none focus:border-gold"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="vehicle">Carros</option>
                  <option value="property">Casas / Imóveis</option>
                </select>
              </div>

              <span className="text-xs font-bold text-muted-foreground">
                {anunciosFiltrados.length} anúncios listados
              </span>
            </div>

            {/* Tabela de Anúncios */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-border bg-surface font-extrabold uppercase text-navy/70">
                    <tr>
                      <th className="px-4 py-3">Anúncio</th>
                      <th className="px-4 py-3">Categoria</th>
                      <th className="px-4 py-3">Preço</th>
                      <th className="px-4 py-3">Localização</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Destaque</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {anunciosFiltrados.map((item) => (
                      <tr key={item.id} className="hover:bg-surface/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-14 rounded-lg bg-navy/10 overflow-hidden shrink-0">
                              {item.listing_images?.[0]?.image_url ? (
                                <img
                                  src={item.listing_images[0].image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  Sem foto
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-navy line-clamp-1">{item.title}</p>
                              <p className="text-[11px] text-muted-foreground">
                                Vendedor: {item.profiles?.full_name || "G&C Solutions"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-semibold text-navy">
                          {item.category === "vehicle" ? "Carro" : "Imóvel"}
                        </td>

                        <td className="px-4 py-3.5 font-extrabold text-navy">
                          {formatPreco(item.price)}
                        </td>

                        <td className="px-4 py-3.5 text-muted-foreground">
                          {item.neighborhood} — {item.province}
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[10px] font-extrabold uppercase",
                              item.status === "published"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : item.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800",
                            )}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item.id, Boolean(item.featured))}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors",
                              item.featured
                                ? "bg-gold text-navy-dark shadow-sm"
                                : "bg-surface text-muted-foreground hover:bg-gold/20",
                            )}
                          >
                            <Sparkles className="h-3 w-3" /> {item.featured ? "Destaque" : "Normal"}
                          </button>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {item.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAprovar(item.id)}
                                  className="rounded bg-emerald-600 p-1.5 text-white hover:bg-emerald-700"
                                  title="Aprovar"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setModalRejeitar(item.id)}
                                  className="rounded bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
                                  title="Rejeitar"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}

                            <Link
                              to={item.category === "vehicle" ? `/carros/$id` : `/casas/$id`}
                              params={{ id: item.id }}
                              className="rounded border border-border p-1.5 text-navy hover:bg-surface"
                              title="Ver anúncio público"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setAnuncioAEliminar(item.id)}
                              className="rounded border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA: UTILIZADORES */}
        {aba === "utilizadores" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-surface px-6 py-4">
              <h2 className="text-base font-extrabold text-navy">Utilizadores Registados na Plataforma</h2>
              <p className="text-xs text-muted-foreground">Gestão de acessos, verificação e permissões de segurança.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface font-extrabold uppercase text-navy/70">
                  <tr>
                    <th className="px-4 py-3">Nome / Perfil</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Papel (Role)</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {utilizadores.map((u) => (
                    <tr key={u.id} className="hover:bg-surface/60 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-navy">
                        {u.full_name || `${u.first_name || ""} ${u.last_name || ""}` || "Utilizador"}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{u.phone || "—"}</td>
                      <td className="px-4 py-3.5">
                        <select
                          value={u.role}
                          onChange={async (e) => {
                            await updateUserRoleAdmin(utilizador?.id || "", u.id, e.target.value as any);
                            toast.success("Papel do utilizador alterado!");
                            carregarDados();
                          }}
                          className="rounded border border-border bg-surface px-2 py-1 text-xs font-bold text-navy"
                        >
                          <option value="user">Utilizador</option>
                          <option value="moderator">Moderador</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-extrabold",
                            u.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800",
                          )}
                        >
                          {u.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={async () => {
                            await toggleUserActiveAdmin(utilizador?.id || "", u.id, Boolean(u.is_active));
                            toast.success(u.is_active ? "Conta desativada." : "Conta ativada.");
                            carregarDados();
                          }}
                          className="rounded border border-border px-2.5 py-1 text-xs font-semibold text-navy hover:bg-surface"
                        >
                          {u.is_active ? "Desativar" : "Ativar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA: DEFINIÇÕES DA PLATAFORMA */}
        {aba === "definicoes" && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm max-w-2xl">
            <h2 className="text-lg font-extrabold text-navy">Definições Centrais da G&C Solutions</h2>
            <p className="text-xs text-muted-foreground">
              Configurações de contactos, moderação automática e regras de publicação.
            </p>

            <form onSubmit={handleSalvarDefinicoes} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">Nome do Marketplace</label>
                <input
                  type="text"
                  value={definicoes.siteName || ""}
                  onChange={(e) => setDefinicoes({ ...definicoes, siteName: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy">WhatsApp Comercial</label>
                  <input
                    type="text"
                    value={definicoes.whatsapp || ""}
                    onChange={(e) => setDefinicoes({ ...definicoes, whatsapp: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy">Telefone de Apoio</label>
                  <input
                    type="text"
                    value={definicoes.phone || ""}
                    onChange={(e) => setDefinicoes({ ...definicoes, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">Email Oficial</label>
                <input
                  type="email"
                  value={definicoes.email || ""}
                  onChange={(e) => setDefinicoes({ ...definicoes, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              <div className="border-t border-border pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(definicoes.requireApproval)}
                    onChange={(e) => setDefinicoes({ ...definicoes, requireApproval: e.target.checked })}
                    className="h-4 w-4 accent-gold cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-navy">Exigir aprovação prévia dos anúncios</p>
                    <p className="text-[11px] text-muted-foreground">
                      Quando ativo, todos os anúncios entram em estado Pendente antes de aparecer no site.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy-dark hover:bg-gold-strong w-fit"
              >
                <Save className="h-4 w-4" /> Guardar Definições
              </button>
            </form>
          </div>
        )}

        {/* ABA: LOGS DE AUDITORIA */}
        {aba === "logs" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-surface px-6 py-4">
              <h2 className="text-base font-extrabold text-navy">Histórico de Atividades Administrativas</h2>
              <p className="text-xs text-muted-foreground">Registo de aprovações, rejeições e alterações de papéis.</p>
            </div>

            <div className="divide-y divide-border">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">Nenhuma atividade registada.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 text-xs">
                    <div>
                      <span className="font-bold text-navy uppercase text-[10px] bg-navy/10 px-2 py-0.5 rounded mr-2">
                        {log.action}
                      </span>
                      <span className="text-navy">{log.description}</span>
                    </div>
                    <span className="text-muted-foreground text-[11px]">
                      {new Date(log.created_at).toLocaleString("pt-PT")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Rejeitar Anúncio */}
      {modalRejeitar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-navy">Motivo da Rejeição do Anúncio</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Indique ao utilizador a razão pela qual o anúncio foi rejeitado para que possa corrigir.
            </p>

            <textarea
              rows={3}
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              placeholder="Ex.: Fotografias com baixa qualidade, documentação incompleta ou preço incorreto..."
              className="mt-4 w-full rounded-lg border border-border bg-surface p-3 text-xs text-navy outline-none focus:border-gold"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalRejeitar(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-navy"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRejeitar}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Rejeitar Anúncio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminação */}
      {anuncioAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 text-center shadow-xl">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
            <h3 className="mt-3 text-base font-extrabold text-navy">Tem a certeza de que pretende eliminar este anúncio?</h3>
            <p className="mt-1 text-xs text-muted-foreground">Esta ação é irreversível e removerá todos os dados e fotos.</p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setAnuncioAEliminar(null)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-navy"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleEliminar}
                className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
