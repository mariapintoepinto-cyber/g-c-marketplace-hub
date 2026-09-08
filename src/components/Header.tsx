import { Link } from "@tanstack/react-router";
import { Heart, Menu, PlusCircle, User, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useLoja } from "@/lib/store";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/carros", label: "Carros" },
  { to: "/casas", label: "Casas" },
  { to: "/anunciar", label: "Anunciar" },
  { to: "/sobre", label: "Sobre Nós" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [aberto, setAberto] = useState(false);
  const { utilizador, favoritos } = useLoja();

  return (
    <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="mx-auto hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="relative py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white data-[status=active]:text-gold"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-full scale-x-0 bg-gold transition-transform data-[status=active]:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:ml-0">
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative grid h-10 w-10 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Heart className="h-5 w-5" />
            {favoritos.length > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy-dark">
                {favoritos.length}
              </span>
            )}
          </Link>

          <Link
            to={utilizador ? "/painel" : "/entrar"}
            className="hidden items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-white/85 transition-colors hover:text-white sm:flex"
          >
            <User className="h-5 w-5" />
            <span className="hidden md:inline">{utilizador ? utilizador.nome : "Entrar"}</span>
          </Link>

          <Link
            to="/anunciar"
            className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-bold text-navy-dark shadow-sm transition-transform hover:bg-gold-strong active:scale-[0.98] sm:flex"
          >
            <PlusCircle className="h-4 w-4" /> Publicar Anúncio
          </Link>

          <button
            onClick={() => setAberto((v) => !v)}
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            className="grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {aberto && (
        <div className="border-t border-white/10 bg-navy lg:hidden">
          <nav className="mx-auto flex max-w-[1280px] flex-col px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setAberto(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="border-b border-white/5 py-3 text-base font-semibold text-white/85 last:border-0 data-[status=active]:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 py-3">
              <Link
                to={utilizador ? "/painel" : "/entrar"}
                onClick={() => setAberto(false)}
                className="rounded-lg border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                {utilizador ? "A minha conta" : "Entrar"}
              </Link>
              <Link
                to="/anunciar"
                onClick={() => setAberto(false)}
                className="rounded-lg bg-gold px-4 py-2.5 text-center text-sm font-bold text-navy-dark"
              >
                Publicar Anúncio
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
