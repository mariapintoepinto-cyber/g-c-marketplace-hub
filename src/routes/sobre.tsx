import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Building2,
  Car,
  CheckCircle2,
  Globe2,
  Handshake,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import ctaBg from "@/assets/cta-bg.jpg";
import { SITE, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre Nós — G&C Solutions" },
      {
        name: "description",
        content:
          "Conheça a G&C Solutions, a plataforma líder em Angola para compra, venda e arrendamento de viaturas e imóveis com total segurança e confiança.",
      },
      { property: "og:title", content: "Sobre a G&C Solutions — Carros • Casas • Negócios" },
      {
        property: "og:description",
        content: "O marketplace angolano moderno e seguro para quem quer comprar ou vender.",
      },
    ],
  }),
  component: PaginaSobre,
});

const PILARES = [
  {
    icone: ShieldCheck,
    titulo: "Segurança e Confiança",
    descricao:
      "Verificamos rigorosamente os detalhes dos anúncios para assegurar que compradores e vendedores façam negócios transparentes e protegidos.",
  },
  {
    icone: Handshake,
    titulo: "Contacto Direto e Sem Complicações",
    descricao:
      "Facilitamos a ponte imediata entre comprador e proprietário através do WhatsApp e chamadas diretas, agilizando visitas e acordos.",
  },
  {
    icone: Globe2,
    titulo: "Cobertura em Todo o País",
    descricao:
      "De Luanda a Benguela, Huíla, Cabinda, Huambo e demais províncias, conectamos angolanos de norte a sul para os melhores negócios.",
  },
  {
    icone: Award,
    titulo: "Experiência Moderna e Rápida",
    descricao:
      "Uma plataforma desenhada com filtros inteligentes, galerias de alta resolução e navegação intuitiva pensada para o mercado local.",
  },
];

const ESTATISTICAS = [
  { valor: "+10.000", label: "Utilizadores Activos", sub: "em todas as províncias" },
  { valor: "+2.500", label: "Anúncios Publicados", sub: "carros e imóveis" },
  { valor: "18", label: "Províncias de Angola", sub: "alcance nacional" },
  { valor: "98%", label: "Negócios Concluídos", sub: "com alta satisfação" },
];

function PaginaSobre() {
  return (
    <div className="bg-surface">
      {/* Header Banner */}
      <section className="bg-navy py-14 sm:py-20">
        <div className="mx-auto max-w-[1280px] px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-gold">
            A Nossa História e Compromisso
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Sobre a <span className="text-gold">G&C Solutions</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            A sua plataforma de referência em Angola para compra, venda e arrendamento de viaturas, imóveis e
            oportunidades comerciais.
          </p>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-strong">Quem Somos</span>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
              Conectamos compradores e vendedores de carros e casas em Angola com rigor e confiança.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Fundada com o propósito de modernizar e democratizar o mercado de compra e venda em Angola, a{" "}
              <strong className="text-navy">G&C Solutions</strong> combina tecnologia de ponta com um profundo
              conhecimento das necessidades do mercado angolano.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Quer procure um SUV fiável para os seus trajetos diários, uma moradia familiar num condomínio fechado em
              Talatona, ou um apartamento acolhedor no centro de Luanda, criámos o ambiente ideal para negociar sem
              intermediários desnecessários.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {[
                "Atendimento e suporte dedicado através do WhatsApp",
                "Preços transparentes em Kwanzas (Kz)",
                "Filtros específicos para viaturas e imóveis em Angola",
                "Plataforma rápida, moderna e adaptada a telemóveis e computadores",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-strong" />
                  <span className="text-sm font-semibold text-navy">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cards Missão e Visão */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-navy">A Nossa Missão</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Proporcionar aos angolanos um espaço digital seguro, intuitivo e eficaz para encontrar o carro dos seus
                sonhos ou o imóvel perfeito para a sua família ou negócio, valorizando o tempo e os recursos de cada
                utilizador.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-navy-dark">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-extrabold text-navy">A Nossa Visão</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Ser o ecossistema comercial e marketplace mais respeitado e utilizado em Angola, conhecido pela
                excelência do serviço, verificação de dados e impacto positivo no desenvolvimento económico nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="border-y border-border bg-card py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {ESTATISTICAS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-navy sm:text-4xl md:text-5xl">{stat.valor}</p>
                <p className="mt-1 text-sm font-bold text-navy">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-strong">O que nos diferencia</span>
          <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">Porquê Escolher a G&C Solutions?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Desenhámos cada funcionalidade a pensar na segurança e comodidade dos utilizadores em Angola.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map(({ icone: Icone, titulo, descricao }) => (
            <div
              key={titulo}
              className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-navy/5 text-navy">
                <Icone className="h-6 w-6 text-navy" />
              </div>
              <h3 className="mt-4 font-bold text-navy">{titulo}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative overflow-hidden bg-navy">
        <img src={ctaBg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative mx-auto max-w-[1280px] px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Pronto para encontrar ou vender hoje?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
            Junte-se a milhares de compradores e vendedores em Angola. É simples, rápido e seguro.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/anunciar"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-navy-dark shadow transition-transform hover:bg-gold-strong active:scale-95"
            >
              <PlusCircle className="h-4 w-4" /> Publicar Anúncio Grátis
            </Link>
            <a
              href={whatsappLink("Informações sobre a G&C Solutions")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4 text-whatsapp" /> Falar com Atendimento
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
