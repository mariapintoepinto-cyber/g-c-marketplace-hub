import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ANUNCIOS, type Anuncio, type Estado } from "@/data/listings";

interface Utilizador {
  id: string;
  nome: string;
  apelido: string;
  email: string;
  telefone: string;
}

interface Loja {
  anuncios: Anuncio[];
  favoritos: string[];
  utilizador: Utilizador | null;
  alternarFavorito: (id: string) => void;
  eFavorito: (id: string) => boolean;
  entrar: (email: string, palavraPasse: string) => boolean;
  registar: (dados: Omit<Utilizador, "id">) => void;
  sair: () => void;
  criarAnuncio: (a: Omit<Anuncio, "id" | "userId" | "criadoEm" | "visualizacoes" | "estado">) => string;
  actualizarEstado: (id: string, estado: Estado) => void;
  removerAnuncio: (id: string) => void;
}

const Ctx = createContext<Loja | null>(null);
const CHAVE_FAV = "gc-favoritos";
const CHAVE_USER = "gc-utilizador";
const CHAVE_ANUNCIOS = "gc-anuncios";

export function LojaProvider({ children }: { children: ReactNode }) {
  const [anuncios, setAnuncios] = useState<Anuncio[]>(ANUNCIOS);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);

  useEffect(() => {
    try {
      const f = localStorage.getItem(CHAVE_FAV);
      if (f) setFavoritos(JSON.parse(f));
      const u = localStorage.getItem(CHAVE_USER);
      if (u) setUtilizador(JSON.parse(u));
      const a = localStorage.getItem(CHAVE_ANUNCIOS);
      if (a) setAnuncios([...(JSON.parse(a) as Anuncio[]), ...ANUNCIOS]);
    } catch {
      /* ignorar */
    }
  }, []);

  const guardarProprios = useCallback((lista: Anuncio[]) => {
    const proprios = lista.filter((a) => !ANUNCIOS.some((o) => o.id === a.id));
    localStorage.setItem(CHAVE_ANUNCIOS, JSON.stringify(proprios));
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
      alternarFavorito,
      eFavorito: (id) => favoritos.includes(id),
      entrar: (email) => {
        if (!email) return false;
        const u: Utilizador = {
          id: "u-local",
          nome: email.split("@")[0] ?? "Utilizador",
          apelido: "",
          email,
          telefone: "",
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
      actualizarEstado: (id, estado) =>
        setAnuncios((prev) => {
          const lista = prev.map((a) => (a.id === id ? { ...a, estado } : a));
          guardarProprios(lista);
          return lista;
        }),
      removerAnuncio: (id) =>
        setAnuncios((prev) => {
          const lista = prev.filter((a) => a.id !== id);
          guardarProprios(lista);
          return lista;
        }),
    }),
    [anuncios, favoritos, utilizador, alternarFavorito, guardarProprios],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useLoja() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLoja precisa do LojaProvider");
  return ctx;
}
