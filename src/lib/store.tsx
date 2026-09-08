import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ANUNCIOS, type Anuncio, type Estado } from "@/data/listings";

export interface Utilizador {
  id: string;
  nome: string;
  apelido: string;
  email: string;
  telefone: string;
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
  alternarFavorito: (id: string) => void;
  eFavorito: (id: string) => boolean;
  entrar: (email: string, palavraPasse?: string) => boolean;
  registar: (dados: Omit<Utilizador, "id">) => void;
  actualizarUtilizador: (dados: Partial<Utilizador>) => void;
  sair: () => void;
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

  useEffect(() => {
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
  }, []);

  const guardarProprios = useCallback((lista: Anuncio[]) => {
    const proprios = lista.filter((a) => !ANUNCIOS.some((o) => o.id === a.id));
    localStorage.setItem(CHAVE_ANUNCIOS, JSON.stringify(proprios));
  }, []);

  const guardarMensagens = useCallback((msgs: Mensagem[]) => {
    localStorage.setItem(CHAVE_MSG, JSON.stringify(msgs));
  }, []);

  const alternarFavorito = useCallback(
    (id: string) => {
      if (!utilizador) {
        toast.error("Precisa de entrar na sua conta para guardar favoritos.");
        return;
      }
      setFavoritos((prev) => {
        const novo = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        localStorage.setItem(CHAVE_FAV, JSON.stringify(novo));
        toast.success(prev.includes(id) ? "Removido dos favoritos." : "Adicionado aos favoritos.");
        return novo;
      });
    },
    [utilizador],
  );

  const valor = useMemo<Loja>(
    () => ({
      anuncios,
      favoritos,
      utilizador,
      mensagens,
      alternarFavorito,
      eFavorito: (id) => favoritos.includes(id),
      entrar: (email) => {
        if (!email) return false;
        const u: Utilizador = {
          id: "u-local",
          nome: email.split("@")[0] ?? "Utilizador",
          apelido: "",
          email,
          telefone: "+244 925 000 000",
        };
        setUtilizador(u);
        localStorage.setItem(CHAVE_USER, JSON.stringify(u));
        return true;
      },
      registar: (dados) => {
        const u: Utilizador = { id: "u-local", ...dados };
        setUtilizador(u);
        localStorage.setItem(CHAVE_USER, JSON.stringify(u));
      },
      actualizarUtilizador: (novosDados) => {
        setUtilizador((prev) => {
          if (!prev) return null;
          const u = { ...prev, ...novosDados };
          localStorage.setItem(CHAVE_USER, JSON.stringify(u));
          toast.success("Perfil atualizado com sucesso!");
          return u;
        });
      },
      sair: () => {
        setUtilizador(null);
        localStorage.removeItem(CHAVE_USER);
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
    [anuncios, favoritos, utilizador, mensagens, alternarFavorito, guardarProprios, guardarMensagens],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useLoja() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoja precisa do LojaProvider");
  return ctx;
}
