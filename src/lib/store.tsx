import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ANUNCIOS, type Anuncio, type Estado } from "@/data/listings";
import { isSupabaseConfigured, supabase, type ProfileRecord, type UserRole } from "@/lib/supabase";
import { signIn, signOut, signUp, updateProfile, getProfile } from "@/services/auth";
import { fetchUserFavoriteIds, toggleFavoriteInDb } from "@/services/favorites";

export interface Utilizador {
  id: string;
  nome: string;
  apelido: string;
  email: string;
  telefone: string;
  role: UserRole;
  avatarUrl?: string | null;
  isVerified?: boolean;
}

export interface Mensagem {
  id: string;
  remetente: string;
  telefone: string;
  anuncioTitulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
}

const MENSAGENS_EXEMPLO: Mensagem[] = [
  {
    id: "m1",
    remetente: "Manuel dos Santos",
    telefone: "+244 923 112 334",
    anuncioTitulo: "Toyota Land Cruiser Prado",
    mensagem: "Boa tarde, a viatura ainda está disponível para visita este sábado?",
    data: "Hoje, 10:24",
    lida: false,
  },
  {
    id: "m2",
    remetente: "Ana Paula Silva",
    telefone: "+244 912 884 991",
    anuncioTitulo: "Moradia T3 - Maianga",
    mensagem: "Olá! O valor é negociável para pagamento por transferência bancária imediata?",
    data: "Ontem, 16:45",
    lida: true,
  },
];

interface Loja {
  anuncios: Anuncio[];
  favoritos: string[];
  utilizador: Utilizador | null;
  mensagens: Mensagem[];
  carregandoAuth: boolean;
  alternarFavorito: (id: string) => Promise<void>;
  eFavorito: (id: string) => boolean;
  entrar: (email: string, palavraPasse?: string) => Promise<boolean>;
  registar: (dados: { nome: string; apelido?: string; email: string; telefone?: string; palavraPasse?: string }) => Promise<boolean>;
  actualizarUtilizador: (dados: Partial<Utilizador>) => Promise<void>;
  sair: () => Promise<void>;
  criarAnuncio: (a: Omit<Anuncio, "id" | "userId" | "criadoEm" | "visualizacoes" | "estado">) => string;
  editarAnuncio: (id: string, dados: Partial<Anuncio>) => void;
  actualizarEstado: (id: string, estado: Estado) => void;
  removerAnuncio: (id: string) => void;
  marcarMensagemLida: (id: string) => void;
}

const Ctx = createContext<Loja | null>(null);
const CHAVE_FAV = "gc-favoritos";
const CHAVE_USER = "gc-utilizador";
const CHAVE_ANUNCIOS = "gc-anuncios";
const CHAVE_MSG = "gc-mensagens";

export function LojaProvider({ children }: { children: ReactNode }) {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(ANUNCIOS);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>(MENSAGENS_EXEMPLO);
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  // Sincronização inicial com Supabase ou LocalStorage
  useEffect(() => {
    let unsubscribe = () => {};

    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            const profile = await getProfile(data.session.user.id);
            const userObj: Utilizador = {
              id: data.session.user.id,
              email: data.session.user.email || "",
              nome: profile?.first_name || profile?.full_name?.split(" ")[0] || "Utilizador",
              apelido: profile?.last_name || "",
              telefone: profile?.phone || "",
              role: profile?.role || "user",
              avatarUrl: profile?.avatar_url ?? null,
              isVerified: profile?.is_verified ?? false,

            };
            setUtilizador(userObj);

            // Carrega favoritos do banco
            const userFavs = await fetchUserFavoriteIds(data.session.user.id);
            setFavoritos(userFavs);
          }

          // Listener de mudanças na sessão
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              const p = await getProfile(session.user.id);
              setUtilizador({
                id: session.user.id,
                email: session.user.email || "",
                nome: p?.first_name || p?.full_name?.split(" ")[0] || "Utilizador",
                apelido: p?.last_name || "",
                telefone: p?.phone || "",
                role: p?.role || "user",
                avatarUrl: p?.avatar_url ?? null,
                isVerified: p?.is_verified ?? false,

              });
              const favs = await fetchUserFavoriteIds(session.user.id);
              setFavoritos(favs);
            } else if (event === "SIGNED_OUT") {
              setUtilizador(null);
              setFavoritos([]);
            }
          });
          unsubscribe = () => authListener.subscription.unsubscribe();
        } catch (err) {
          console.error("Erro na inicialização de autenticação:", err);
        } finally {
          setCarregandoAuth(false);
        }
      } else {
        // Fallback local
        try {
          const f = localStorage.getItem(CHAVE_FAV);
          if (f) setFavoritos(JSON.parse(f));
          const u = localStorage.getItem(CHAVE_USER);
          if (u) setUtilizador(JSON.parse(u));
          const a = localStorage.getItem(CHAVE_ANUNCIOS);
          if (a) setAnuncios([...(JSON.parse(a) as Anuncio[]), ...ANUNCIOS]);
          const m = localStorage.getItem(CHAVE_MSG);
          if (m) setMensagens(JSON.parse(m));
        } catch {
          /* ignorar */
        }
        setCarregandoAuth(false);
      }
    }

    initAuth();
    return () => unsubscribe();
  }, []);

  const guardarProprios = useCallback((lista: Anuncio[]) => {
    const proprios = lista.filter((a) => !ANUNCIOS.some((o) => o.id === a.id));
    localStorage.setItem(CHAVE_ANUNCIOS, JSON.stringify(proprios));
  }, []);

  const guardarMensagens = useCallback((msgs: Mensagem[]) => {
    localStorage.setItem(CHAVE_MSG, JSON.stringify(msgs));
  }, []);

  const alternarFavorito = useCallback(
    async (id: string) => {
      if (!utilizador) {
        toast.error("Inicie sessão para adicionar aos favoritos.");
        return;
      }

      if (isSupabaseConfigured) {
        const isNowFav = await toggleFavoriteInDb(utilizador.id, id);
        setFavoritos((prev) => (isNowFav ? [...prev, id] : prev.filter((x) => x !== id)));
        toast.success(isNowFav ? "Adicionado aos favoritos." : "Removido dos favoritos.");
      } else {
        setFavoritos((prev) => {
          const novo = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
          localStorage.setItem(CHAVE_FAV, JSON.stringify(novo));
          toast.success(prev.includes(id) ? "Removido dos favoritos." : "Adicionado aos favoritos.");
          return novo;
        });
      }
    },
    [utilizador],
  );

  const valor = useMemo<Loja>(
    () => ({
      anuncios,
      favoritos,
      utilizador,
      mensagens,
      carregandoAuth,
      alternarFavorito,
      eFavorito: (id) => favoritos.includes(id),
      entrar: async (email, palavraPasse) => {
        if (!email) return false;
        if (isSupabaseConfigured && palavraPasse) {
          const { error } = await signIn(email, palavraPasse);
          if (error) {
            toast.error(error);
            return false;
          }
          toast.success("Sessão iniciada com sucesso!");
          return true;
        }

        // Modo Demonstração / Fallback
        const demoRole: UserRole = email.includes("admin") ? "admin" : "user";
        const u: Utilizador = {
          id: "u-local",
          nome: email.split("@")[0] ?? "Utilizador",
          apelido: "",
          email,
          telefone: "+244 925 000 000",
          role: demoRole,
          isVerified: true,
        };
        setUtilizador(u);
        localStorage.setItem(CHAVE_USER, JSON.stringify(u));
        return true;
      },
      registar: async ({ nome, apelido, email, telefone, palavraPasse }) => {
        if (isSupabaseConfigured && palavraPasse) {
          const { error } = await signUp({ email, password: palavraPasse, nome, apelido: apelido ?? "", telefone: telefone ?? "" });
          if (error) {
            toast.error(error);
            return false;
          }
          toast.success("Conta criada com sucesso!");
          return true;
        }

        const u: Utilizador = {
          id: "u-local",
          nome,
          apelido: apelido || "",
          email,
          telefone: telefone || "+244 925 000 000",
          role: "user",
          isVerified: false,
        };
        setUtilizador(u);
        localStorage.setItem(CHAVE_USER, JSON.stringify(u));
        return true;
      },
      actualizarUtilizador: async (novosDados) => {
        if (!utilizador) return;
        if (isSupabaseConfigured) {
          await updateProfile(utilizador.id, {
            first_name: novosDados.nome ?? utilizador.nome,
            last_name: novosDados.apelido ?? utilizador.apelido,
            phone: novosDados.telefone ?? utilizador.telefone,
          });

        }
        setUtilizador((prev) => {
          if (!prev) return null;
          const u = { ...prev, ...novosDados };
          localStorage.setItem(CHAVE_USER, JSON.stringify(u));
          toast.success("Perfil atualizado com sucesso!");
          return u;
        });
      },
      sair: async () => {
        if (isSupabaseConfigured) {
          await signOut();
        }
        setUtilizador(null);
        localStorage.removeItem(CHAVE_USER);
        toast.success("Sessão terminada.");
      },
      criarAnuncio: (dados) => {
        const id = `n${Date.now()}`;
        const novo: Anuncio = {
          ...dados,
          id,
          userId: utilizador?.id ?? "u-local",
          criadoEm: new Date().toISOString().slice(0, 10),
          visualizacoes: 0,
          estado: "activo",
        };
        setAnuncios((prev) => {
          const lista = [novo, ...prev];
          guardarProprios(lista);
          return lista;
        });
        return id;
      },
      editarAnuncio: (id, alteracoes) => {
        setAnuncios((prev) => {
          const lista = prev.map((a) => (a.id === id ? { ...a, ...alteracoes } : a));
          guardarProprios(lista);
          return lista;
        });
        toast.success("Anúncio atualizado com sucesso!");
      },
      actualizarEstado: (id, estado) =>
        setAnuncios((prev) => {
          const lista = prev.map((a) => (a.id === id ? { ...a, estado } : a));
          guardarProprios(lista);
          const estadoMsg =
            estado === "activo" ? "ativado" : estado === "vendido" ? "marcado como vendido" : "pausado";
          toast.success(`Anúncio ${estadoMsg} com sucesso.`);
          return lista;
        }),
      removerAnuncio: (id) =>
        setAnuncios((prev) => {
          const lista = prev.filter((a) => a.id !== id);
          guardarProprios(lista);
          toast.success("Anúncio removido.");
          return lista;
        }),
      marcarMensagemLida: (id) => {
        setMensagens((prev) => {
          const actualizadas = prev.map((m) => (m.id === id ? { ...m, lida: true } : m));
          guardarMensagens(actualizadas);
          return actualizadas;
        });
      },
    }),
    [anuncios, favoritos, utilizador, mensagens, carregandoAuth, alternarFavorito, guardarProprios, guardarMensagens],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useLoja() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoja precisa do LojaProvider");
  return ctx;
}
