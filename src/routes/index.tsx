import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Plane } from "lucide-react";

export type Deal = {
  id: string;
  origin: string;
  destination: string;
  origin_city: string;
  dest_city: string;
  price_inr: number;
  typical_inr: number | null;
  drop_pct: number | null;
  savings_inr: number | null;
  family_savings_inr: number | null;
  lowest_in_days: number | null;
  typical_source: "history" | "google";
  google_signal: "low" | "typical" | "high" | null;
  airline: string;
  stops: number;
  depart_date: string;
  return_date: string;
  google_flights_url: string;
};

export type DealsPayload = {
  generated_at: string;
  routes_watched: number;
  deals: Deal[];
};

const DUMMY_DEAL: Deal = {
  id: "featured-bom-cdg",
  origin: "BOM",
  destination: "CDG",
  origin_city: "Mumbai",
  dest_city: "Paris",
  price_inr: 38500,
  typical_inr: 72000,
  drop_pct: 47,
  savings_inr: 33500,
  family_savings_inr: 134000,
  lowest_in_days: 210,
  typical_source: "history",
  google_signal: null,
  airline: "Air India",
  stops: 1,
  depart_date: "Dec 20",
  return_date: "Jan 4",
  google_flights_url: "https://www.google.com/travel/flights",
};

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ------------------------------ Page ------------------------------ */

function Landing() {
  return (
    <div className="min-h-screen bg-[#F6F5FB] text-[#0B1020] font-sans antialiased">
      <Nav />
      <Hero />
      <Feed />
      <div className="h-24" />
    </div>
  );
}

function Nav() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-[#7C5BFF] flex items-center justify-center text-white font-bold">
            S
          </span>
          <span className="font-bold tracking-tight text-[17px]">skyhop</span>
        </a>
        <div className="flex items-center gap-5">
          <a href="#deals" className="hidden sm:inline text-sm text-[#0B1020]/80 hover:text-[#0B1020]">
            Live deals
          </a>
          <a
            href="#deals"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0B1020] text-white text-sm font-medium hover:bg-black transition"
          >
            Browse
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 md:px-10 pt-16 md:pt-24 pb-12">
      <h1 className="font-bold tracking-[-0.03em] leading-[1.02] text-[44px] sm:text-[64px] md:text-[88px] max-w-[12ch]">
        Handpicked roundtrip deals that save you a fortune
      </h1>
      <p className="mt-6 text-[15px] md:text-[17px] text-[#0B1020]/70 max-w-2xl">
        Live fares scanned across hundreds of routes from India. Sorted by the biggest price drop.
      </p>
      <div className="mt-10">
        <a
          href="#deals"
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-[#7C5BFF] text-white text-[15px] font-medium hover:bg-[#6A47FF] transition shadow-[0_8px_24px_-8px_rgba(124,91,255,0.6)]"
        >
          View live deals
        </a>
      </div>
    </section>
  );
}

/* ------------------------------ Feed ------------------------------ */

type SortKey = "drop" | "price" | "saved";

const DEALS_URL =
  "https://raw.githubusercontent.com/prarabdha-soni/faredrop-data/main/deals.json";

async function fetchDeals(): Promise<{ ok: true; data: DealsPayload } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${DEALS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = (await res.json()) as DealsPayload;
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  }
}

function Feed() {
  const q = useQuery({
    queryKey: ["deals"],
    queryFn: fetchDeals,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [origin, setOrigin] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("drop");

  const payload = q.data?.ok ? q.data.data : null;
  const fetchedDeals = payload?.deals ?? [];
  const allDeals = [DUMMY_DEAL, ...fetchedDeals];

  const origins = useMemo(() => {
    const set = new Set<string>();
    for (const d of allDeals) set.add(d.origin_city);
    return ["All", ...Array.from(set)];
  }, [allDeals]);

  const filtered = useMemo(() => {
    const list = origin === "All" ? allDeals : allDeals.filter((d) => d.origin_city === origin);
    if (sort === "drop") return list;
    if (sort === "price") return [...list].sort((a, b) => a.price_inr - b.price_inr);
    return [...list].sort((a, b) => (b.savings_inr ?? 0) - (a.savings_inr ?? 0));
  }, [allDeals, origin, sort]);

  const isLoading = q.isLoading;
  const isError = !isLoading && (q.isError || (q.data && !q.data.ok));

  const [hero, ...rest] = filtered;

  return (
    <section id="deals" className="mx-auto max-w-[1280px] px-6 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <h2 className="text-[24px] md:text-[32px] font-semibold tracking-tight">
          Live flight deals
        </h2>
        {payload && payload.routes_watched > 0 && (
          <div className="text-[12px] text-[#0B1020]/55">
            Scanning {payload.routes_watched.toLocaleString()} routes · updated{" "}
            {new Date(payload.generated_at).toLocaleString()}
          </div>
        )}
      </div>

      {/* Controls */}
      {allDeals.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {origins.map((o) => (
              <button
                key={o}
                onClick={() => setOrigin(o)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition ${
                  origin === o
                    ? "bg-[#0B1020] text-white border-[#0B1020]"
                    : "bg-white text-[#0B1020]/80 border-black/10 hover:border-[#0B1020]/30"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1 rounded-full bg-white border border-black/10 p-1">
            {(
              [
                { k: "drop", label: "Biggest drop" },
                { k: "price", label: "Lowest price" },
                { k: "saved", label: "Most saved (₹)" },
              ] as const
            ).map((s) => (
              <button
                key={s.k}
                onClick={() => setSort(s.k)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition ${
                  sort === s.k ? "bg-[#7C5BFF] text-white" : "text-[#0B1020]/70 hover:text-[#0B1020]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[12px] text-[#0B1020]/55 mb-6 italic">
        Fares change fast — confirm the live price before booking. We link you to book directly and
        never handle payments.
      </p>

      {isError && (
        <StateMsg tone="error">Couldn't load live deals right now — showing cached data.</StateMsg>
      )}

      {/* Cards */}
      {filtered.length > 0 && (
        <>
          {hero && <DealCard deal={hero} hero />}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {rest.map((d) => (
                <DealCard key={d.id} deal={d} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function StateMsg({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "error";
}) {
  return (
    <div
      className={`rounded-2xl bg-white border border-black/10 px-6 py-12 text-center text-[15px] ${
        tone === "error" ? "text-[#B23A48]" : "text-[#0B1020]/65"
      }`}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Card ------------------------------ */

const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function useCountUp(target: number, run: boolean) {
  const [v, setV] = useState(run ? 0 : target);
  useEffect(() => {
    if (!run) {
      setV(target);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setV(target);
      return;
    }
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return v;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

function DealCard({ deal, hero = false }: { deal: Deal; hero?: boolean }) {
  const hasDrop =
    deal.typical_source === "history" &&
    deal.drop_pct != null &&
    deal.drop_pct > 0 &&
    deal.typical_inr != null;
  const { ref, seen } = useInView<HTMLDivElement>();
  const pct = useCountUp(hasDrop ? deal.drop_pct! : 0, seen && hasDrop);
  const fillPct = hasDrop ? Math.min(95, 100 - deal.drop_pct!) : 0;

  return (
    <article
      ref={ref}
      className={`rounded-2xl bg-white border border-black/10 overflow-hidden flex flex-col ${
        hero ? "p-7 md:p-10" : "p-5"
      }`}
    >
      <div
        className={`flex ${hero ? "flex-col md:flex-row md:items-start md:gap-10" : "flex-col gap-4"}`}
      >
        {/* LEFT: route + meta */}
        <div className={hero ? "md:flex-1 min-w-0" : ""}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#0B1020]/55 font-medium">
            <Plane className="w-3.5 h-3.5" />
            Round Trip
            {deal.lowest_in_days != null && deal.lowest_in_days > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-md bg-[#EFE9FF] text-[#6D4AFF] normal-case tracking-normal text-[11px] font-semibold">
                Lowest in {deal.lowest_in_days} days
              </span>
            )}
          </div>
          <div
            className={`font-mono font-bold tracking-tight mt-3 ${
              hero ? "text-[40px] md:text-[56px]" : "text-[26px]"
            } leading-none`}
          >
            {deal.origin} → {deal.destination}
          </div>
          <div className={`mt-2 text-[#0B1020]/70 ${hero ? "text-[16px]" : "text-[14px]"}`}>
            {deal.origin_city} to {deal.dest_city}
          </div>
          <div className={`mt-3 text-[#0B1020]/60 ${hero ? "text-[13px]" : "text-[12px]"}`}>
            {deal.airline} · {deal.stops === 0 ? "nonstop" : `${deal.stops} stop(s)`} ·{" "}
            {deal.depart_date}–{deal.return_date}
          </div>
        </div>

        {/* RIGHT: pricing */}
        <div className={hero ? "md:w-[420px] md:shrink-0 mt-6 md:mt-0" : "mt-2"}>
          {hasDrop ? (
            <>
              <div
                className={`font-bold text-[#7C5BFF] leading-none ${
                  hero ? "text-[88px] md:text-[112px]" : "text-[56px]"
                }`}
                style={{ letterSpacing: "-0.04em" }}
              >
                ▼{pct}%
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className={`font-bold ${hero ? "text-[34px]" : "text-[24px]"}`}>
                  {INR(deal.price_inr)}
                </span>
                <span
                  className={`line-through text-[#0B1020]/40 ${hero ? "text-[18px]" : "text-[15px]"}`}
                >
                  {INR(deal.typical_inr!)}
                </span>
              </div>
              {deal.savings_inr != null && deal.savings_inr > 0 && (
                <div className="mt-3">
                  <div
                    className={`font-semibold text-emerald-600 ${
                      hero ? "text-[20px]" : "text-[16px]"
                    }`}
                  >
                    Save {INR(deal.savings_inr)}
                  </div>
                  {deal.family_savings_inr != null && deal.family_savings_inr > 0 && (
                    <div className="text-[12px] text-[#0B1020]/55 mt-0.5">
                      {INR(deal.family_savings_inr)} for a family of 4
                    </div>
                  )}
                </div>
              )}

              {/* Gauge */}
              <div className="mt-5">
                <div className="relative h-2 rounded-full bg-[#EFE9FF] overflow-visible">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#7C5BFF] transition-[width] duration-[1100ms] ease-out"
                    style={{ width: seen ? `${fillPct}%` : "0%" }}
                  />
                  <div
                    className="absolute -top-1.5 right-0 w-px h-5 bg-[#0B1020]/40"
                    aria-hidden
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wider text-[#0B1020]/55">
                  <span>Today's fare</span>
                  <span>Typical</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={`font-bold ${hero ? "text-[56px]" : "text-[36px]"} leading-none`}>
                {INR(deal.price_inr)}
              </div>
              {deal.google_signal && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-md bg-[#F0EEF7] text-[#0B1020]/70 text-[12px] font-medium">
                  Google rates this: {deal.google_signal}
                </div>
              )}
            </>
          )}

          <a
            href={deal.google_flights_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0B1020] text-white text-[14px] font-medium hover:bg-black transition ${
              hero ? "" : "w-full justify-center"
            }`}
          >
            Verify on Google Flights
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
