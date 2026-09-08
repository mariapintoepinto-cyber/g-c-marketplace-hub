import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Music2, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SITE } from "@/lib/config";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/carros", label: "Carros" },
  { to: "/casas", label: "Casas" },
  { to: "/anunciar", label: "Anunciar" },
  { to: "/sobre", label: "Sobre Nós" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Footer() {
  return (
    <footer className="bg-navy-dark">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Logo />

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                className="text-sm font-semibold text-white/75 transition-colors hover:text-gold"
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={SITE.redes.facebook} aria-label="Facebook" className="text-white/80 hover:text-gold">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={SITE.redes.instagram} aria-label="Instagram" className="text-white/80 hover:text-gold">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={SITE.redes.tiktok} aria-label="TikTok" className="text-white/80 hover:text-gold">
              <Music2 className="h-5 w-5" />
            </a>
            <a href={SITE.redes.youtube} aria-label="YouTube" className="text-white/80 hover:text-gold">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/55 lg:text-right">
          © 2026 {SITE.nome}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
