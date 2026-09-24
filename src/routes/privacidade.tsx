import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Shield, Eye, Database, KeyRound, MessageCircle, CheckCircle2 } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/config";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — G&C Solutions" },
      {
        name: "description",
        content:
          "Conheça a Política de Privacidade e Protecção de Dados da G&C Solutions em Angola. Saiba como recolhemos, protegemos e utilizamos as suas informações.",
      },
      { property: "og:title", content: "Política de Privacidade — G&C Solutions" },
      {
        property: "og:description",
        content: "Compromisso com a protecção de dados pessoais e privacidade dos nossos utilizadores em Angola.",
      },
    ],
  }),
  component: PaginaPrivacidade,
});

function PaginaPrivacidade() {
  return (
    <div className="bg-surface pb-16">
      {/* Header */}
      <section className="bg-navy py-12 text-white">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold">
            <Lock className="h-3.5 w-3.5" /> Segurança e Protecção
          </div>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-4xl">Política de Privacidade</h1>
          <p className="mt-2 text-sm text-white/75 sm:text-base">
            O seu direito à privacidade e à segurança dos seus dados é a nossa prioridade em Angola.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="mx-auto mt-8 max-w-[1000px] px-4 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs sm:p-10">
          <div className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <div>
              <h2 className="text-lg font-bold text-navy sm:text-xl">1. Informações que Recolhemos</h2>
              <p className="mt-2">
                A <strong>G&C Solutions</strong> recolhe apenas as informações necessárias para assegurar a boa
                prestação do serviço de marketplace e a segurança das negociações:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>
                  <strong>Dados de Registo:</strong> Nome, apelido, endereço de e-mail e número de telefone com indicativo de Angola (+244).
                </li>
                <li>
                  <strong>Dados dos Anúncios:</strong> Fotografias, especificações técnicas da viatura ou imóvel, preço em Kwanzas (Kz), localização (bairro e província).
                </li>
                <li>
                  <strong>Dados de Sessão e Interacção:</strong> Anúncios guardados nos favoritos, mensagens trocadas na plataforma e registo de visualizações para fins estatísticos.
                </li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">2. Como Utilizamos os seus Dados</h2>
              <p className="mt-2">Os dados recolhidos destinam-se exclusivamente às seguintes finalidades:</p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Permitir o início de sessão seguro e a gestão do seu painel pessoal de anúncios.</li>
                <li>Facilitar o contacto directo entre compradores e vendedores através do WhatsApp e telefone.</li>
                <li>Verificação e moderação editorial de anúncios para prevenir burlas e perfis falsos.</li>
                <li>Melhoria contínua da velocidade de pesquisa e da experiência de utilizador na plataforma.</li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">3. Partilha e Sigilo de Informações</h2>
              <p className="mt-2">
                A G&C Solutions <strong>nunca vende, aluga ou cede</strong> os seus dados pessoais ou listas de contactos a entidades terceiras para fins comerciais ou publicitários.
              </p>
              <p className="mt-2">
                Ao publicar um anúncio, o utilizador autoriza que o seu nome de vendedor e o contacto telefónico fornecido fiquem visíveis na página do anúncio para viabilizar as propostas de negócio.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">4. Segurança e Infraestrutura Tecnológica</h2>
              <p className="mt-2">
                Os dados são armazenados em infraestrutura segura com base de dados PostgreSQL e autenticação robusta
                providenciada por tecnologia Supabase, com suporte a Row Level Security (RLS) e encriptação SSL/TLS em
                todas as comunicações entre o seu navegador e os nossos servidores.
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">5. Os Seus Direitos</h2>
              <p className="mt-2">Em conformidade com as boas práticas e regulamentação angolana, tem o direito de:</p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Aceder e rectificar a qualquer momento os seus dados pessoais no seu Painel de Utilizador.</li>
                <li>Solicitar a eliminação definitiva da sua conta e de todos os dados e anúncios associados.</li>
                <li>Desactivar ou pausar a visibilidade dos seus anúncios a qualquer instante.</li>
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-navy sm:text-xl">6. Contacto do Responsável de Privacidade</h2>
              <p className="mt-2">
                Para exercer qualquer um dos seus direitos ou colocar questões sobre o tratamento das suas informações,
                contacte a nossa equipa através de <span className="font-semibold text-navy">{SITE.email}</span> ou pelo
                WhatsApp oficial da plataforma.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-navy">
              <CheckCircle2 className="h-4 w-4 text-whatsapp" /> Encriptação de ponta a ponta e RLS activo
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-whatsapp px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Esclarecer dúvidas de privacidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}