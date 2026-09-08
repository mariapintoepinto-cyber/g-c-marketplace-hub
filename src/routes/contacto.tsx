import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SITE, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — G&C Solutions" },
      {
        name: "description",
        content:
          "Entre em contacto com a G&C Solutions pelo WhatsApp, telefone ou email. Estamos disponíveis para esclarecer dúvidas e ajudar no seu anúncio em Angola.",
      },
      { property: "og:title", content: "Contacto — G&C Solutions Angola" },
      { property: "og:description", content: "Fale connosco pelo WhatsApp +244 925 649 926 ou envie a sua mensagem." },
    ],
  }),
  component: PaginaContacto,
});

const FAQS = [
  {
    pergunta: "Como posso publicar um anúncio de carro ou casa?",
    resposta:
      "Basta clicar no botão amarelo 'Publicar Anúncio' no topo do site, escolher a categoria (Carro ou Imóvel), preencher as características, preço em Kz, localização e adicionar fotos.",
  },
  {
    pergunta: "Os anúncios são verificados antes de serem exibidos?",
    resposta:
      "Sim. A nossa equipa revê as informações fornecidas e a documentação para garantir a máxima segurança e confiabilidade nas negociações.",
  },
  {
    pergunta: "Como entro em contacto direto com o vendedor?",
    resposta:
      "Em cada página de anúncio encontra o botão verde 'Contactar pelo WhatsApp' e o número de telefone do vendedor para negociação direta e imediata.",
  },
  {
    pergunta: "Quais são as províncias atendidas pela plataforma?",
    resposta:
      "Operamos em todo o território nacional de Angola, com maior volume em Luanda, Benguela, Huíla, Huambo e Cabinda.",
  },
];

function PaginaContacto() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "Dúvida geral",
    mensagem: "",
  });
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.telefone || !form.mensagem) {
      toast.error("Por favor preencha todos os campos obrigatórios.");
      return;
    }
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      toast.success("Mensagem enviada com sucesso! A nossa equipa entrará em contacto muito em breve.");
      setForm({
        nome: "",
        email: "",
        telefone: "",
        assunto: "Dúvida geral",
        mensagem: "",
      });
    }, 600);
  };

  return (
    <div className="bg-surface">
      {/* Header */}
      <section className="bg-navy py-12 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gold">
            Apoio ao Cliente e Suporte
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Entre em <span className="text-gold">Contacto</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Estamos prontos para responder às suas questões, apoiar a publicação do seu anúncio ou orientar nas suas
            negociações em Angola.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <div className="mx-auto -mt-6 max-w-[1280px] px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-whatsapp/15 text-whatsapp">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-bold text-navy">WhatsApp</h3>
            <p className="text-xs text-muted-foreground">Atendimento rápido em tempo real</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-extrabold text-navy hover:text-gold-strong"
            >
              {SITE.telefone} →
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/10 text-navy">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-bold text-navy">Telefone</h3>
            <p className="text-xs text-muted-foreground">Linha de apoio comercial</p>
            <a
              href={`tel:${SITE.telefone.replace(/\s+/g, "")}`}
              className="mt-3 inline-block text-sm font-extrabold text-navy hover:text-gold-strong"
            >
              {SITE.telefone} →
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/10 text-navy">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-bold text-navy">Email</h3>
            <p className="text-xs text-muted-foreground">Envie questões ou propostas</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 inline-block text-sm font-extrabold text-navy hover:text-gold-strong"
            >
              {SITE.email} →
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy/10 text-navy">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-bold text-navy">Localização</h3>
            <p className="text-xs text-muted-foreground">Sede em Angola</p>
            <p className="mt-3 text-sm font-extrabold text-navy">{SITE.endereco}</p>
          </div>
        </div>
      </div>

      {/* Form and Schedule */}
      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Envie-nos uma Mensagem</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Preencha o formulário e responderemos o mais breve possível.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="nome">
                    Nome Completo *
                  </label>
                  <input
                    id="nome"
                    required
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Ex.: António Manuel"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="telefone">
                    Telemóvel / WhatsApp *
                  </label>
                  <input
                    id="telefone"
                    required
                    type="tel"
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    placeholder="+244 9XX XXX XXX"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="email">
                    Endereço de Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="exemplo@dominio.ao"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="assunto">
                    Assunto
                  </label>
                  <select
                    id="assunto"
                    value={form.assunto}
                    onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-navy outline-none focus:border-gold"
                  >
                    <option value="Dúvida geral">Dúvida geral</option>
                    <option value="Apoio a anúncio">Apoio com o meu anúncio</option>
                    <option value="Parceria comercial">Parceria comercial / Stand / Imobiliária</option>
                    <option value="Denúncia de anúncio">Reportar anúncio irregular</option>
                    <option value="Outro">Outro assunto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-navy" htmlFor="mensagem">
                  Mensagem *
                </label>
                <textarea
                  id="mensagem"
                  required
                  rows={4}
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  placeholder="Escreva a sua mensagem em detalhe..."
                  className="w-full resize-y rounded-lg border border-border bg-surface p-3 text-sm text-navy outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-navy-dark transition-all hover:bg-gold-strong disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> {enviando ? "A enviar..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          {/* Horários e Informações */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-gold-strong" />
                <h3 className="font-extrabold text-navy">Horário de Atendimento</h3>
              </div>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Segunda a Sexta</span>
                  <span className="font-semibold text-navy">08:00 – 18:00</span>
                </li>
                <li className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">Sábado</span>
                  <span className="font-semibold text-navy">08:30 – 13:00</span>
                </li>
                <li className="flex justify-between pb-1">
                  <span className="text-muted-foreground">Domingo e Feriados</span>
                  <span className="font-semibold text-muted-foreground">WhatsApp de Plantão</span>
                </li>
              </ul>

              <div className="mt-6 rounded-xl bg-whatsapp/10 p-4">
                <p className="text-xs font-bold text-whatsapp">Resposta imediata por WhatsApp</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  A forma mais rápida de falar connosco é através da nossa linha de WhatsApp oficial.
                </p>
                <a
                  href={whatsappLink("Gostaria de obter suporte")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" /> Iniciar conversa no WhatsApp
                </a>
              </div>
            </div>

            {/* Caixa Suporte Comercial */}
            <div className="rounded-2xl bg-navy p-6 text-white shadow-sm">
              <h3 className="font-extrabold">É um Stand de Automóveis ou Imobiliária?</h3>
              <p className="mt-2 text-xs text-white/80">
                Dispomos de planos e pacotes especiais de destaque e publicação em massa para profissionais do setor em
                Angola.
              </p>
              <a
                href={whatsappLink("Interesse em planos profissionais para stands e imobiliárias")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-xs font-bold text-navy-dark hover:bg-gold-strong"
              >
                Falar com consultor comercial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-card py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-strong">Tire as suas dúvidas</span>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">Perguntas Frequentes</h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {FAQS.map((faq) => (
              <div key={faq.pergunta} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 shrink-0 text-navy" />
                  <div>
                    <h3 className="font-bold text-navy">{faq.pergunta}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{faq.resposta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
