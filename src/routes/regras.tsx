import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, CheckCircle2, Car, Home as HomeIcon, PhoneCall, HelpCircle, Eye, MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/regras")({
  head: () => ({
    meta: [
      { title: "Regras de Publicação e Segurança — G&C Solutions" },
      {
        name: "description",
        content:
          "Consulte as regras para publicação de anúncios e as melhores práticas de segurança para comprar e vender carros e casas com tranquilidade em Angola.",
      },
      { property: "og:title", content: "Regras e Segurança — G&C Solutions" },
      {
        property: "og:description",
        content: "Dicas essenciais para negociações seguras e directas no mercado angolano.",
      },
    ],
  }),
  component: PaginaRegras,
});

function PaginaRegras() {
  return (
    <div className="bg-surface pb-16">
      {/* Header */}
      <section className="bg-navy py-12 text-white">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold">
            <ShieldCheck className="h-3.5 w-3.5" /> Boas Práticas e Segurança
          </div>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">Regras de Publicação & Dicas de Segurança</h1>
          <p className="mt-2 text-sm text-white/75 sm:text-base">
            O nosso compromisso para manter a comunidade angolana protegida contra burlas e fraudes.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="mx-auto mt-8 max-w-[1000px] px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs sm:p-10">
          <div className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {/* Seção 1: Regras de Publicação */}
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy sm:text-xl">
                <CheckCircle2 className="h-5 w-5 text-whatsapp" /> 1. Regras para Publicar Anúncios
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface p-4">
                  <h3 className="font-bold text-navy">Fotografias Autênticas</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Utilize apenas fotos reais tiradas à própria viatura ou imóvel em território nacional. É proibido o
                    uso de fotos de catálogo de concessionárias ou imagens baixadas da internet.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4">
                  <h3 className="font-bold text-navy">Preços Reais em Kwanzas</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Todos os preços devem corresponder ao valor real pretendido em Kwanzas (Kz / AOA). Preços simbólicos
                    como "1 Kz" ou "123 Kz" são rejeitados na moderação.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4">
                  <h3 className="font-bold text-navy">Descrição Fidedigna</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Informe honestamente o ano de fabrico, a quilometragem exacta, o estado mecânico e os eventuais
                    detalhes de pintura ou reparações pendentes.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-4">
                  <h3 className="font-bold text-navy">Localização Exacta</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Seleccione a província correta e identifique o município/bairro (ex.: Talatona, Maianga, Viana,
                    Lobito, Lubango) para facilitar o encontro com compradores sérios.
                  </p>
                </div>
              </div>
            </div>

            {/* Seção 2: Conteúdos Proibidos */}
            <div className="border-t border-border pt-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-red-600 sm:text-xl">
                <AlertTriangle className="h-5 w-5 text-red-500" /> 2. O que é Estritamente Proibido
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Viaturas com ordem judicial de apreensão, sem registo ou roubadas.</li>
                <li>Imóveis ou terrenos com litígios de posse, sem termo de quitação ou registo regularizado.</li>
                <li>Anúncios duplicados da mesma viatura ou imóvel na mesma província.</li>
                <li>Cobrança de taxas antecipadas para "reservar" a viatura antes de qualquer visita física.</li>
                <li>Linguagem ofensiva, difamatória ou conteúdo alheio ao sector de viaturas e propriedades.</li>
              </ul>
            </div>

            {/* Seção 3: Dicas de Segurança para Angola */}
            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">
                3. Guia de Segurança para Compradores e Vendedores em Angola
              </h2>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border-l-4 border-gold bg-surface p-4">
                  <h3 className="font-bold text-navy">1. Nunca faça pagamentos antecipados por transferência</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Desconfie de qualquer vendedor que solicite adiantamentos por Multicaixa Express ou transferência
                    bancária para "segurar a viatura" ou "pagar despesas de transporte". Pague apenas após ver o bem ao
                    vivo e validar os documentos.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-navy bg-surface p-4">
                  <h3 className="font-bold text-navy">2. Marque encontros sempre em locais públicos e iluminados</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Para inspeccionar o carro ou conversar com o vendedor, combine em bombas de combustível conhecidas,
                    parques de centros comerciais (ex.: Belas Shopping, Shopping Avennida) ou próximo a postos
                    policiais durante o dia.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-whatsapp bg-surface p-4">
                  <h3 className="font-bold text-navy">3. Faça uma vistoria mecânica e confirme os documentos</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Leve um mecânico de confiança para inspecionar o motor, caixa de velocidades e suspensão. Compare o
                    número de chassi gravado na carroçaria com os dados descritos no Livrete e no Título de Registo de
                    Propriedade Automóvel da DNVT.
                  </p>
                </div>

                <div className="rounded-lg border-l-4 border-gold bg-surface p-4">
                  <h3 className="font-bold text-navy">4. Cuidados essenciais na compra de Imóveis</h3>
                  <p className="mt-1 text-xs sm:text-sm">
                    Solicite sempre a Certidão de Teor na Conservatória do Registo Predial para confirmar se o imóvel não
                    tem hipotecas ou penhoras e verifique a Certidão Matricial junto da Administração Geral Tributária
                    (AGT).
                  </p>
                </div>
              </div>
            </div>

            {/* Seção 4: Denúncia */}
            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">4. Encontrou um anúncio suspeito?</h2>
              <p className="mt-2">
                A sua cooperação ajuda a proteger todos os cidadãos em Angola. Se identificar qualquer anúncio com preço
                irrealista, contacto fraudulento ou documentação duvidosa, avise imediatamente a nossa moderação através
                do WhatsApp com o link do anúncio.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <Link
              to="/anunciar"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-xs font-bold text-navy-dark transition-colors hover:bg-gold-strong"
            >
              Publicar Anúncio com Segurança
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Reportar Anúncio Suspeito
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}