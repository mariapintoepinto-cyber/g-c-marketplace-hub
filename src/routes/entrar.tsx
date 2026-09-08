import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, KeyRound, Lock, LogIn, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLoja } from "@/lib/store";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar na Conta — G&C Solutions" },
      {
        name: "description",
        content: "Aceda à sua conta na G&C Solutions para gerir anúncios de viaturas e imóveis, ver estatísticas e favoritos.",
      },
    ],
  }),
  component: PaginaEntrar,
});

function PaginaEntrar() {
  const navigate = useNavigate();
  const { entrar, utilizador } = useLoja();
  const [email, setEmail] = useState("");
  const [palavraPasse, setPalavraPasse] = useState("");
  const [modalEsqueci, setModalEsqueci] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !palavraPasse) {
      toast.error("Por favor introduza o seu email e palavra-passe.");
      return;
    }

    const ok = entrar(email, palavraPasse);
    if (ok) {
      toast.success("Sessão iniciada com sucesso!");
      navigate({ to: "/painel" });
    } else {
      toast.error("Credenciais inválidas. Verifique os dados e tente novamente.");
    }
  };

  const handleRecuperacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecuperacao) {
      toast.error("Introduza o seu email.");
      return;
    }
    toast.success("Enviámos as instruções de recuperação para o seu email.");
    setModalEsqueci(false);
    setEmailRecuperacao("");
  };

  if (utilizador) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-strong">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold text-navy">Já tem sessão iniciada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Está conectado como <strong className="text-navy">{utilizador.email}</strong>.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/painel"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark hover:bg-gold-strong"
            >
              Ir para o Meu Painel <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
              <LogIn className="h-6 w-6" />
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-navy">Entrar na sua Conta</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Aceda aos seus anúncios, mensagens de compradores e favoritos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="email">
                Endereço de Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-semibold text-navy" htmlFor="password">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={() => setModalEsqueci(true)}
                  className="text-xs font-semibold text-gold-strong hover:underline"
                >
                  Esqueci-me da palavra-passe
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  value={palavraPasse}
                  onChange={(e) => setPalavraPasse(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-sm font-bold text-navy-dark transition-all hover:bg-gold-strong active:scale-[0.99]"
            >
              <LogIn className="h-4 w-4" /> Entrar
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center">
            <p className="text-xs text-muted-foreground">Ainda não tem conta na G&C Solutions?</p>
            <Link
              to="/registar"
              className="mt-2 inline-block text-sm font-extrabold text-navy hover:text-gold-strong hover:underline"
            >
              Criar Conta Gratuita →
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Esqueci-me da palavra-passe */}
      {modalEsqueci && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold-strong">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="mt-3 text-xl font-extrabold text-navy">Recuperar Palavra-passe</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Introduza o endereço de email associado à sua conta para receber uma ligação de recuperação.
            </p>

            <form onSubmit={handleRecuperacao} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="email-recuperacao">
                  Email registado
                </label>
                <input
                  id="email-recuperacao"
                  type="email"
                  required
                  value={emailRecuperacao}
                  onChange={(e) => setEmailRecuperacao(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalEsqueci(false)}
                  className="rounded-lg border border-border px-4 py-2 text-xs font-bold text-navy hover:bg-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gold px-4 py-2 text-xs font-bold text-navy-dark hover:bg-gold-strong"
                >
                  Enviar Instruções
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
