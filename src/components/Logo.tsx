import { Link } from "@tanstack/react-router";
import { Car, Home } from "lucide-react";
import { SITE } from "@/lib/config";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={SITE.nome}>
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15">
        <Car className="absolute left-1 top-2.5 h-5 w-5 text-gold" strokeWidth={2.4} />
        <Home className="absolute bottom-2 right-1 h-4 w-4 text-white" strokeWidth={2.4} />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-lg font-extrabold text-white sm:text-xl">
          <span className="text-gold">G&amp;C</span> Solutions
        </span>
        {!compact && (
          <span className="block text-[10px] font-semibold tracking-[0.18em] text-white/60">
            {SITE.posicionamento}
          </span>
        )}
      </span>
    </Link>
  );
}
