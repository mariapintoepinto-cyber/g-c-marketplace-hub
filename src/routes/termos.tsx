import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldAlert, Scale, CheckCircle2, MessageCircle, HelpCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos e Condições — G&C Solutions" },
      {
        name: "description",
        content:
          "Leia os Termos e Condições de Uso da plataforma G&C Solutions. Conheça os direitos e deveres dos utilizadores ao comprar e vender em Angola.",
      },
      { property: "og:title", content: "Termos e Condições — G&C Solutions" },
      {
        property: "og:description",
        content: "Condições gerais de utilização da plataforma líder de carros e imóveis em Angola.",
      },
    ],
  }),
  component: PaginaTermos,
});

function PaginaTermos() {
  return (
    <div className="bg-surface pb-16">
      {/* Header */}
      <section className="bg-navy py-12 text-white">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold">
            <Scale className="h-3.5 w-3.5" /> Regulamento da Plataforma
          </div>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">Termos e Condições de Uso</h1>
          <p className="mt-2 text-sm text-white/75 sm:text-base">
            Última actualização: Março de 2026 • Aplicável a todos os utilizadores em Angola.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="mx-auto mt-8 max-w-[1000px] px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs sm:p-10">
          <div className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <div>
              <h2 className="text-lg font-bold text-navy sm:text-xl">1. Âmbito e Aceitação</h2>
              <p className="mt-2">
                A <strong>G&C Solutions</strong> disponibiliza uma plataforma online dedicada à aproximação entre
                anunciantes e potenciais compradores ou arrendatários de viaturas e imóveis na República de Angola. Ao
                aceder ao sítio web, criar conta ou publicar anúncios, o utilizador concorda expressamente com os
                presentes Termos e Condições e com a legislação angolana em vigor.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">2. Natureza do Serviço e Mediação</h2>
              <p className="mt-2">
                A G&C Solutions actua como intermediária de divulgação publicitária e tecnológica. A plataforma{" "}
                <strong>não é proprietária</strong> da maioria dos bens anunciados por particulares e stands terceiros,
                nem actua como parte contratante nas transacções finais de compra, venda ou arrendamento celebradas
                entre os utilizadores.
              </p>
              <div className="mt-4 rounded-lg bg-surface p-4 text-xs sm:text-sm">
                <span className="font-semibold text-navy">Nota importante:</span> A verificação física das viaturas,
                vistorias mecânicas e a confirmação jurídica dos títulos de propriedade predial junto das conservatórias
                competentes são da inteira responsabilidade dos intervenientes na transacção.
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">3. Regras para os Anunciantes</h2>
              <p className="mt-2">Todos os anunciantes comprometem-se a:</p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Fornecer dados fidedignos, actualizados e exactos relativamente ao bem anunciado.</li>
                <li>Indicar valores transparentes na moeda oficial de Angola — <strong>Kwanzas (Kz / AOA)</strong>.</li>
                <li>Utilizar fotografias reais e recentes do veículo ou imóvel em questão.</li>
                <li>Garantir que detêm legitimidade jurídica ou autorização expressa para comercializar o bem.</li>
                <li>Actualizar ou remover o anúncio prontamente assim que a viatura ou imóvel for vendido ou arrendado.</li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">4. Moderação e Remoção de Anúncios</h2>
              <p className="mt-2">
                A equipa de moderação da G&C Solutions reserva-se o direito de analisar, suspender, rejeitar ou remover
                definitivamente anúncios que violem as normas da comunidade, apresentem indícios de burla, preços
                manifestamente fraudulentos, documentação irregular ou fotografias enganosas, sem prejuízo da
                comunicação às autoridades policiais competentes.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">5. Propriedade Intelectual</h2>
              <p className="mt-2">
                Todos os logótipos, marcas comerciais, grafismos, código-fonte e elementos de interface da G&C Solutions
                constituem propriedade exclusiva da G&C Solutions e encontram-se protegidos pelas leis de propriedade
                intelectual e direitos de autor em Angola.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">6. Contacto e Resolução de Litígios</h2>
              <p className="mt-2">
                Para qualquer esclarecimento sobre os nossos Termos ou suporte na plataforma, contacte-nos directamente
                pelo WhatsApp oficial ou através da nossa página de contacto. Os litígios decorrentes do uso da
                plataforma serão dirimidos ao abrigo da legislação da República de Angola e pelos tribunais da Comarca
                de Luanda.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-navy">
              <CheckCircle2 className="h-4 w-4 text-whatsapp" /> Plataforma auditada e em conformidade
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Dúvidas? Fale connosco no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}