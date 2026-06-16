import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";

export function Nav() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#7C5BFF] flex items-center justify-center text-white font-bold text-[15px]">
            N
          </span>
          <span className="font-extrabold tracking-tight text-[18px]">Nishu</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-[#0B1020]/80 hover:text-[#0B1020]">
            Deals
          </Link>
          <button
            aria-label="Account"
            className="w-9 h-9 rounded-lg border border-black/10 flex items-center justify-center text-[#0B1020]/70 hover:bg-black/5 transition"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
