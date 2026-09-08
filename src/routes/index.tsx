import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  Handshake,
  Headset,
  Home as HomeIcon,
  MapPin,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import catCars from "@/assets/cat-cars.jpg";
import catHouses from "@/assets/cat-houses.jpg";
import ctaBg from "@/assets/cta-bg.jpg";
import { ListingCard } from "@/components/ListingCard";
import { SearchPanel } from "@/components/SearchPanel";
import { SITE, whatsappLink } from "@/lib/config";
import { useLoja } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "G&C Solutions — Carros e Casas em Angola" },
      {
        name: "description",
        content:
          "Encontre os melhores negócios em Angola: carros e imóveis com segurança, qualidade e confiança.",
      },
      { property: "og:title", content: "G&C Solutions — Carros e Casas em Angola" },
      {
        property: "og:description",
        content: "Pesquise, compare e contacte vendedores de carros e imóveis em todo o país.",
      },
    ],
  }),
  component: Inicio,
});

const CONFIANCA = [
  { Icone: ShieldCheck, titulo: "Negócios Seguros", texto: "Anúncios verificados e confiáveis" },
  { Icone: Handshake, titulo: "Fácil de Usar", texto: "Procure, compare e encontre o melhor" },
  { Icone: Headset, titulo: "Suporte ao Cliente", texto: "Estamos sempre disponíveis" },
  { Icone: MapPin, titulo: "Em Todo o País", texto: "Angola, em todas as províncias" },
];

function Inicio() {
  const { anuncios } = useLoja();
  const carros = anuncios.filter((a) => a.categoria === "carro" && a.estado === "activo");
  const imoveis = anuncios.filter((a) => a.categoria === "imovel" && a.estado === "activo");

  return (
    <>
      <section className="relative">
        <img
          src={heroImg}
          alt="Carro premium e moradia moderna ao pôr do sol em Angola"
          width={1920}
          height={912}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-dark/65" />
        <div className="relative mx-auto max-w-[1280px] px-4 pb-40 pt-16 text-center sm:px-6 sm:pt-24 md:pb-48">
          <h1 className="fade-up text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl md:text-5xl">
            O seu próximo
            <span className="mt-1 block text-4xl sm:text-6xl md:text-7xl">
              <span className="text-gold">Carro</span> ou <span className="text-gold">Casa</span>
            </span>
            <span className="mt-1 block">está aqui!</span>
          </h1>
          <p className="fade-up mx-auto mt-5 max-w-xl text-sm text-white/85 sm:text-base">
            Encontre os melhores negócios em Angola.
            <br className="hidden sm:block" /> Carros e imóveis com segurança, qualidade e confiança.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-32 max-w-[1200px] px-4 sm:px-6 md:-mt-36">
        <SearchPanel />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { to: "/carros", img: catCars, Icone: Car, titulo: "Ver Carros", sub: `${carros.length}+ anúncios disponíveis` },
            { to: "/casas", img: catHouses, Icone: HomeIcon, titulo: "Ver Casas", sub: `${imoveis.length}+ anúncios disponíveis` },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl bg-navy p-5 sm:p-6"
            >
              <img
                src={c.img}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/20" />
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/10">
                <c.Icone className="h-7 w-7 text-white" />
              </span>
              <span className="relative min-w-0">
                <span className="block truncate text-lg font-extrabold text-white">{c.titulo}</span>
                <span className="block text-sm text-white/70">{c.sub}</span>
              </span>
              <span className="relative ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
          <div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="inline-flex min-w-0 items-center gap-2.5 text-xl font-extrabold text-navy sm:text-2xl">
                <Car className="h-6 w-6 shrink-0" /> <span className="truncate">Carros em Destaque</span>
              </h2>
              <Link to="/carros" className="shrink-0 text-xs font-semibold text-muted-foreground hover:text-gold-strong">
                Ver todos os carros →
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {carros.slice(0, 4).map((a) => (
                <ListingCard key={a.id} anuncio={a} />
              ))}
            </div>
          </div>

          <div className="lg:border-l lg:border-border lg:pl-8">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="inline-flex min-w-0 items-center gap-2.5 text-xl font-extrabold text-navy sm:text-2xl">
                <HomeIcon className="h-6 w-6 shrink-0" />{" "}
                <span className="truncate">Casas e Imóveis em Destaque</span>
              </h2>
              <Link to="/casas" className="shrink-0 text-xs font-semibold text-muted-foreground hover:text-gold-strong">
                Ver todos os imóveis →
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {imoveis.slice(0, 4).map((a) => (
                <ListingCard key={a.id} anuncio={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-10">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {CONFIANCA.map(({ Icone, titulo, texto }) => (
            <div key={titulo} className="flex items-start gap-3">
              <Icone className="h-8 w-8 shrink-0 text-navy" strokeWidth={1.8} />
              <div className="min-w-0">
                <h3 className="font-bold text-navy">{titulo}</h3>
                <p className="text-sm text-muted-foreground">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy">
        <img src={ctaBg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Tem um carro ou imóvel para vender?
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Publique o seu anúncio e alcance milhares de pessoas em todo o país.
            </p>
            <Link
              to="/anunciar"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-navy-dark transition-colors hover:bg-gold-strong"
            >
              <PlusCircle className="h-5 w-5" /> Publicar Anúncio
            </Link>
          </div>

          <div className="flex items-center gap-4 lg:justify-end">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-whatsapp">
              <MessageCircle className="h-7 w-7 text-white" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/85">Fale connosco pelo WhatsApp</p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl font-extrabold text-white hover:text-gold"
              >
                {SITE.telefone}
              </a>
              <p className="text-xs text-white/60">Estamos prontos para ajudar!</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
