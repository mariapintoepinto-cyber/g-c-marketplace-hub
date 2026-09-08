import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, Phone, ShieldCheck, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLoja } from "@/lib/store";

export const Route = createFileRoute("/registar")({
  head: () => ({
    meta: [
      { title: "Criar Conta Gratuita — G&C Solutions" },
      {
        name: "description",
        content: "Crie a sua conta na G&C Solutions para publicar anúncios de carros e casas em Angola com facilidade.",
      },
    ],
  }),
  component: PaginaRegistar,
});

function PaginaRegistar() {
  const navigate = useNavigate();
  const { registar, utilizador } = useLoja();

  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    email: "",
    telefone: "",
    palavraPasse: "",
    confirmarPalavraPasse: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.telefone || !form.palavraPasse) {
      toast.error("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    if (form.palavraPasse.length < 6) {
      toast.error("A palavra-passe deve ter no mínimo 6 caracteres.");
      return;
    }

    if (form.palavraPasse !== form.confirmarPalavraPasse) {
      toast.error("As palavras-passe não coincidem. Por favor verifique.");
      return;
    }

    registar({
      nome: form.nome,
      apelido: form.apelido,
      email: form.email,
      telefone: form.telefone,
    });

    toast.success("Conta criada com sucesso! Bem-vindo à G&C Solutions.");
    navigate({ to: "/painel" });
  };

  if (utilizador) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-surface px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-strong">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold text-navy">Já tem uma conta ativa</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Está conectado como <strong className="text-navy">{utilizador.nome} {utilizador.apelido}</strong>.
          </p>
          <div className="mt-6">
            <Link
              to="/painel"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark hover:bg-gold-strong"
            >
              Ir para o Meu Painel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] bg-surface py-12 sm:py-16">
      <div className="mx-auto max-w-lg px-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
              <UserPlus className="h-6 w-6" />
            </span>
            <h1 className="mt-3 text-2xl font-extrabold text-navy">Criar Nova Conta</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Publique anúncios em minutos e alcance milhares de compradores em Angola.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="nome">
                  Primeiro Nome *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="nome"
                    required
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex.: Manuel"
                    className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="apelido">
                  Apelido
                </label>
                <input
                  id="apelido"
                  type="text"
                  value={form.apelido}
                  onChange={(e) => setForm({ ...form, apelido: e.target.value })}
                  placeholder="Ex.: Silva"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="email">
                Endereço de Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="exemplo@email.com"
                  className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="telefone">
                Telemóvel / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  id="telefone"
                  required
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="+244 9XX XXX XXX"
                  className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Será o número de contacto apresentado nos seus anúncios para WhatsApp.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="palavraPasse">
                  Palavra-passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="palavraPasse"
                    required
                    type="password"
                    value={form.palavraPasse}
                    onChange={(e) => setForm({ ...form, palavraPasse: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="confirmar">
                  Confirmar Palavra-passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    id="confirmar"
                    required
                    type="password"
                    value={form.confirmarPalavraPasse}
                    onChange={(e) => setForm({ ...form, confirmarPalavraPasse: e.target.value })}
                    placeholder="Repita a palavra-passe"
                    className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-gold py-2.5 text-sm font-bold text-navy-dark transition-all hover:bg-gold-strong active:scale-[0.99]"
            >
              <UserPlus className="h-4 w-4" /> Criar Conta
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center">
            <p className="text-xs text-muted-foreground">Já tem uma conta na G&C Solutions?</p>
            <Link
              to="/entrar"
              className="mt-2 inline-block text-sm font-extrabold text-navy hover:text-gold-strong hover:underline"
            >
              Entrar na sua conta →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
