import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCircle,
  Clock,
  Eye,
  Heart,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  MoreVertical,
  Pause,
  Pencil,
  Phone,
  Play,
  PlusCircle,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ListingCard } from "@/components/ListingCard";
import type { Anuncio } from "@/data/listings";
import { SITE, whatsappLink } from "@/lib/config";
import { formatPreco } from "@/lib/format";
import { useLoja } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel do Utilizador — G&C Solutions" },
      {
        name: "description",
        content: "Gira os seus anúncios de viaturas e imóveis, consulte estatísticas, mensagens e favoritos.",
      },
    ],
  }),
  component: PaginaPainel,
});

type Aba = "visao-geral" | "meus-anuncios" | "favoritos" | "mensagens" | "perfil" | "definicoes";

function PaginaPainel() {
  const navigate = useNavigate();
  const {
    utilizador,
    sair,
    anuncios,
    favoritos,
    mensagens,
    actualizarEstado,
    removerAnuncio,
    editarAnuncio,
    actualizarUtilizador,
    marcarMensagemLida,
    entrar,
  } = useLoja();

  const [aba, setAba] = useState<Aba>("visao-geral");

  // Edição de anúncio modal
  const [anuncioAEditar, setAnuncioAEditar] = useState<Anuncio | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editPreco, setEditPreco] = useState<number | "">("");
  const [editDescricao, setEditDescricao] = useState("");

  // Edição de Perfil
  const [perfilNome, setPerfilNome] = useState(utilizador?.nome ?? "");
  const [perfilApelido, setPerfilApelido] = useState(utilizador?.apelido ?? "");
  const [perfilTelefone, setPerfilTelefone] = useState(utilizador?.telefone ?? "");
  const [perfilEmail, setPerfilEmail] = useState(utilizador?.email ?? "");

  // Anúncios do utilizador (se u-local ou pertencentes ao user)
  const meusAnuncios = anuncios.filter(
    (a) => a.userId === (utilizador?.id ?? "u-local") || a.userId === "u1",
  );

  const activos = meusAnuncios.filter((a) => a.estado === "activo");
  const vendidos = meusAnuncios.filter((a) => a.estado === "vendido");
  const totalViews = meusAnuncios.reduce((acc, a) => acc + (a.visualizacoes || 0), 0);
  const anunciosFavoritos = anuncios.filter((a) => favoritos.includes(a.id));

  const abrirEdicao = (a: Anuncio) => {
    setAnuncioAEditar(a);
    setEditTitulo(a.titulo);
    setEditPreco(a.preco);
    setEditDescricao(a.descricao);
  };

  const guardarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anuncioAEditar) return;
    if (!editTitulo || !editPreco) {
      toast.error("Preencha o título e o preço.");
      return;
    }

    editarAnuncio(anuncioAEditar.id, {
      titulo: editTitulo,
      preco: Number(editPreco),
      descricao: editDescricao,
    });
    setAnuncioAEditar(null);
  };

  const salvarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    actualizarUtilizador({
      nome: perfilNome,
      apelido: perfilApelido,
      telefone: perfilTelefone,
      email: perfilEmail,
    });
  };

  if (!utilizador) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-strong">
            <User className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold text-navy">Acesso ao Painel do Utilizador</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicie sessão na sua conta ou entre no modo de demonstração para gerir anúncios, ver estatísticas e
            mensagens.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/entrar"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark hover:bg-gold-strong"
            >
              Entrar na Minha Conta
            </Link>
            <button
              type="button"
              onClick={() => {
                entrar("utilizador@gcsolutions.ao");
                toast.success("Conectado como utilizador de demonstração!");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:bg-surface"
            >
              Entrar com Conta de Demonstração
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-surface pb-16">
      {/* Header do Painel */}
      <section className="bg-navy py-8 sm:py-12">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold font-extrabold text-navy-dark text-xl shadow">
                {utilizador.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-white sm:text-2xl">
                    {utilizador.nome} {utilizador.apelido}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verificado
                  </span>
                </div>
                <p className="text-xs text-white/70">{utilizador.email} • {utilizador.telefone || "+244 925 649 926"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/anunciar"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-xs font-extrabold text-navy-dark hover:bg-gold-strong"
              >
                <PlusCircle className="h-4 w-4" /> Publicar Anúncio
              </Link>
              <button
                type="button"
                onClick={() => {
                  sair();
                  toast.success("Sessão terminada.");
                  navigate({ to: "/" });
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-xs font-bold text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Navegação Lateral */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-3 shadow-sm">
            <nav className="flex flex-col gap-1">
              {[
                { id: "visao-geral", icone: LayoutDashboard, label: "Visão Geral" },
                { id: "meus-anuncios", icone: ShoppingBag, label: "Meus Anúncios", badge: meusAnuncios.length },
                { id: "favoritos", icone: Heart, label: "Favoritos", badge: favoritos.length },
                { id: "mensagens", icone: MessageCircle, label: "Mensagens", badge: mensagens.filter((m) => !m.lida).length },
                { id: "perfil", icone: User, label: "Perfil" },
                { id: "definicoes", icone: Settings, label: "Definições" },
              ].map((item) => {
                const Icone = item.icone;
                const activo = aba === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAba(item.id as Aba)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                      activo
                        ? "bg-navy text-white shadow-sm"
                        : "text-navy hover:bg-surface text-left",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icone className={cn("h-4 w-4", activo ? "text-gold" : "text-muted-foreground")} />
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                          activo ? "bg-gold text-navy-dark" : "bg-navy/10 text-navy",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="my-2 border-t border-border" />

              <button
                type="button"
                onClick={() => {
                  sair();
                  toast.success("Sessão terminada.");
                  navigate({ to: "/" });
                }}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 text-left transition-colors"
              >
                <LogOut className="h-4 w-4" /> Terminar sessão
              </button>
            </nav>
          </aside>

          {/* Área Principal de Conteúdo */}
          <main className="flex flex-col gap-6">
            {/* ABA: VISÃO GERAL */}
            {aba === "visao-geral" && (
              <>
                {/* 4 Cards de Estatísticas */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Anúncios Activos</span>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                        <ShoppingBag className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-extrabold text-navy">{activos.length}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">visíveis aos compradores</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Anúncios Vendidos</span>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-100 text-blue-700">
                        <CheckCircle className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-extrabold text-navy">{vendidos.length}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">negócios concluídos</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Total Visualizações</span>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-amber-700">
                        <Eye className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-extrabold text-navy">{totalViews.toLocaleString("pt-PT")}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">alcance acumulado</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground">Favoritos Guardados</span>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-100 text-rose-700">
                        <Heart className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-extrabold text-navy">{favoritos.length}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">veículos e imóveis salvos</p>
                  </div>
                </div>

                {/* Anúncios Recentes */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-navy">Os Meus Anúncios Recentes</h2>
                    <button
                      type="button"
                      onClick={() => setAba("meus-anuncios")}
                      className="text-xs font-bold text-gold-strong hover:underline"
                    >
                      Ver todos ({meusAnuncios.length}) →
                    </button>
                  </div>

                  {meusAnuncios.length === 0 ? (
                    <div className="mt-6 py-8 text-center">
                      <p className="text-sm text-muted-foreground">Ainda não publicou nenhum anúncio.</p>
                      <Link
                        to="/anunciar"
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-navy-dark"
                      >
                        <PlusCircle className="h-4 w-4" /> Publicar Primeiro Anúncio
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-4 divide-y divide-border">
                      {meusAnuncios.slice(0, 3).map((a) => (
                        <div key={a.id} className="flex items-center justify-between py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={a.imagens[0]}
                              alt={a.titulo}
                              className="h-14 w-20 rounded-lg object-cover"
                            />
                            <div>
                              <Link
                                to={a.categoria === "carro" ? `/carros/$id` : `/casas/$id`}
                                params={{ id: a.id }}
                                className="font-bold text-sm text-navy hover:text-gold-strong line-clamp-1"
                              >
                                {a.titulo}
                              </Link>
                              <p className="text-xs font-extrabold text-navy">{formatPreco(a.preco)}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {a.bairro} • {a.visualizacoes} visualizações
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase",
                                a.estado === "activo"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : a.estado === "vendido"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-700",
                              )}
                            >
                              {a.estado}
                            </span>
                            <button
                              type="button"
                              onClick={() => abrirEdicao(a)}
                              className="rounded-lg border border-border p-1.5 text-navy hover:bg-surface"
                              title="Editar"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mensagens Recentes */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-navy">Mensagens Recentes de Compradores</h2>
                    <button
                      type="button"
                      onClick={() => setAba("mensagens")}
                      className="text-xs font-bold text-gold-strong hover:underline"
                    >
                      Ver todas ({mensagens.length}) →
                    </button>
                  </div>

                  <div className="mt-4 divide-y divide-border">
                    {mensagens.slice(0, 2).map((m) => (
                      <div key={m.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm text-navy">{m.remetente}</p>
                          <span className="text-[11px] text-muted-foreground">{m.data}</span>
                        </div>
                        <p className="text-xs font-semibold text-gold-strong mt-0.5">Re: {m.anuncioTitulo}</p>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.mensagem}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ABA: MEUS ANÚNCIOS */}
            {aba === "meus-anuncios" && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-navy">Gestão de Anúncios</h2>
                    <p className="text-xs text-muted-foreground">
                      Pode editar valores, marcar como vendido, pausar ou remover os seus anúncios.
                    </p>
                  </div>
                  <Link
                    to="/anunciar"
                    className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-navy-dark hover:bg-gold-strong"
                  >
                    <PlusCircle className="h-4 w-4" /> Criar Novo Anúncio
                  </Link>
                </div>

                {meusAnuncios.length === 0 ? (
                  <div className="mt-8 py-12 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-3 text-base font-bold text-navy">Sem anúncios publicados</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Publique o seu primeiro anúncio em poucos passos.</p>
                    <Link
                      to="/anunciar"
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gold px-5 py-2 text-xs font-bold text-navy-dark"
                    >
                      <PlusCircle className="h-4 w-4" /> Publicar Agora
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col gap-4">
                    {meusAnuncios.map((a) => (
                      <div
                        key={a.id}
                        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={a.imagens[0]}
                            alt={a.titulo}
                            className="h-20 w-28 rounded-lg object-cover shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "rounded px-2 py-0.5 text-[10px] font-extrabold uppercase",
                                  a.estado === "activo"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : a.estado === "vendido"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-200 text-gray-700",
                                )}
                              >
                                {a.estado}
                              </span>
                              <span className="text-[11px] text-muted-foreground">Criado em {a.criadoEm}</span>
                            </div>
                            <h3 className="mt-1 font-bold text-navy text-sm">{a.titulo}</h3>
                            <p className="text-sm font-extrabold text-navy">{formatPreco(a.preco)}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {a.bairro} • {a.visualizacoes} visualizações
                            </p>
                          </div>
                        </div>

                        {/* Ações de Gestão */}
                        <div className="flex flex-wrap items-center gap-2 sm:justify-end border-t border-border/60 pt-3 sm:border-0 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(a)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-navy hover:bg-surface"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>

                          {a.estado === "activo" ? (
                            <button
                              type="button"
                              onClick={() => actualizarEstado(a.id, "pausado")}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50"
                            >
                              <Pause className="h-3.5 w-3.5" /> Pausar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => actualizarEstado(a.id, "activo")}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                            >
                              <Play className="h-3.5 w-3.5" /> Ativar
                            </button>
                          )}

                          {a.estado !== "vendido" && (
                            <button
                              type="button"
                              onClick={() => actualizarEstado(a.id, "vendido")}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                            >
                              <CheckCircle className="h-3.5 w-3.5" /> Vendido
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja eliminar este anúncio?")) {
                                removerAnuncio(a.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ABA: FAVORITOS */}
            {aba === "favoritos" && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-navy">Anúncios Guardados nos Favoritos</h2>
                  <span className="text-xs text-muted-foreground">{favoritos.length} itens</span>
                </div>

                {anunciosFavoritos.length === 0 ? (
                  <div className="mt-8 py-12 text-center">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Não tem nenhum favorito guardado de momento.</p>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {anunciosFavoritos.map((a) => (
                      <ListingCard key={a.id} anuncio={a} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ABA: MENSAGENS */}
            {aba === "mensagens" && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-extrabold text-navy">Mensagens Recebidas</h2>
                    <p className="text-xs text-muted-foreground">
                      Contactos e perguntas enviadas por compradores através da plataforma.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  {mensagens.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "rounded-xl border p-4 transition-colors",
                        msg.lida ? "border-border bg-surface" : "border-gold/60 bg-gold/5 shadow-sm",
                      )}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-navy">{msg.remetente}</span>
                            {!msg.lida && (
                              <span className="rounded bg-gold px-1.5 py-0.5 text-[9px] font-extrabold text-navy-dark">
                                Nova
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-gold-strong">Anúncio: {msg.anuncioTitulo}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{msg.data}</span>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-navy bg-card p-3 rounded-lg border border-border">
                        "{msg.mensagem}"
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Telefone: <strong className="text-navy">{msg.telefone}</strong>
                        </span>
                        <div className="flex gap-2">
                          {!msg.lida && (
                            <button
                              type="button"
                              onClick={() => marcarMensagemLida(msg.id)}
                              className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold text-navy hover:bg-surface"
                            >
                              Marcar como lida
                            </button>
                          )}
                          <a
                            href={`https://wa.me/${msg.telefone.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Olá ${msg.remetente}, estou a responder sobre o anúncio ${msg.anuncioTitulo} na G&C Solutions.`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
                          >
                            <MessageCircle className="h-3.5 w-3.5" /> Responder no WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA: PERFIL */}
            {aba === "perfil" && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-extrabold text-navy">Editar Perfil Pessoal</h2>
                <p className="text-xs text-muted-foreground">
                  Actualize os seus dados de contacto para que os compradores o identifiquem corretamente.
                </p>

                <form onSubmit={salvarPerfil} className="mt-6 flex flex-col gap-4 max-w-xl">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-navy">Nome</label>
                      <input
                        type="text"
                        value={perfilNome}
                        onChange={(e) => setPerfilNome(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-navy">Apelido</label>
                      <input
                        type="text"
                        value={perfilApelido}
                        onChange={(e) => setPerfilApelido(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Endereço de Email</label>
                    <input
                      type="email"
                      value={perfilEmail}
                      onChange={(e) => setPerfilEmail(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-navy">Telemóvel / WhatsApp de Contacto</label>
                    <input
                      type="tel"
                      value={perfilTelefone}
                      onChange={(e) => setPerfilTelefone(e.target.value)}
                      placeholder="+244 9XX XXX XXX"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy-dark hover:bg-gold-strong w-fit"
                  >
                    Guardar Alterações
                  </button>
                </form>
              </div>
            )}

            {/* ABA: DEFINIÇÕES */}
            {aba === "definicoes" && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-extrabold text-navy">Definições da Conta</h2>
                <p className="text-xs text-muted-foreground">Personalize a sua experiência e notificações.</p>

                <div className="mt-6 flex flex-col gap-4 max-w-xl">
                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                    <div>
                      <p className="font-bold text-sm text-navy">Alertas por WhatsApp</p>
                      <p className="text-xs text-muted-foreground">Receba aviso imediato quando um comprador demonstrar interesse.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-gold cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                    <div>
                      <p className="font-bold text-sm text-navy">Notificações por Email</p>
                      <p className="text-xs text-muted-foreground">Resumo semanal de visualizações dos seus anúncios.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-gold cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                    <div>
                      <p className="font-bold text-sm text-navy">Privacidade do Número</p>
                      <p className="text-xs text-muted-foreground">Exibir número de telefone apenas para utilizadores autenticados.</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4 accent-gold cursor-pointer" />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal de Edição de Anúncio */}
      {anuncioAEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl sm:p-8">
            <h2 className="text-xl font-extrabold text-navy">Editar Anúncio</h2>
            <p className="mt-1 text-xs text-muted-foreground">Actualize as informações principais do anúncio.</p>

            <form onSubmit={guardarEdicao} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">Título</label>
                <input
                  type="text"
                  required
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">Preço (Kz)</label>
                <input
                  type="number"
                  required
                  value={editPreco}
                  onChange={(e) => setEditPreco(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy font-bold outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy">Descrição</label>
                <textarea
                  rows={4}
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAnuncioAEditar(null)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-navy hover:bg-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gold px-5 py-2 text-xs font-bold text-navy-dark hover:bg-gold-strong"
                >
                  Guardar Modificações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
