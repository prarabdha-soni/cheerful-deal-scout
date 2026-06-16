import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Crown, User, Search, X } from "lucide-react";


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
  // Optional presentation fields (URL data may omit these).
  image?: string;
  dest_country?: string;
  cabin?: string;
};

export type DealsPayload = {
  generated_at: string;
  routes_watched: number;
  deals: Deal[];
};

/**
 * Sample deals shown only when the live feed returns nothing (empty list,
 * network error, or bad payload) so the grid is never blank.
 */
function makeSample(
  id: string,
  origin: string,
  destination: string,
  origin_city: string,
  dest_city: string,
  dest_country: string,
  cabin: string,
  photoId: string,
  price_inr: number,
  typical_inr: number,
  stops: number,
  depart_date: string,
): Deal {
  const savings = typical_inr - price_inr;
  return {
    id,
    origin,
    destination,
    origin_city,
    dest_city,
    dest_country,
    cabin,
    image: `https://images.unsplash.com/photo-${photoId}?w=600&q=70&auto=format&fit=crop`,
    price_inr,
    typical_inr,
    drop_pct: Math.round((savings / typical_inr) * 100),
    savings_inr: savings,
    family_savings_inr: savings * 4,
    lowest_in_days: 180,
    typical_source: "history",
    google_signal: null,
    airline: "Multiple",
    stops,
    depart_date,
    return_date: "",
    google_flights_url: "https://www.google.com/travel/flights",
  };
}

const SAMPLE_DEALS: Deal[] = [
  makeSample("s-cok-hnd", "COK", "HND", "Kochi", "Tokyo", "Japan", "Business", "1540959733332-eab4deabeeaf", 128481, 350000, 1, "Aug"),
  makeSample("s-del-adl", "DEL", "ADL", "New Delhi", "Adelaide", "Australia", "Economy", "1506973035872-a4ec16b8e8d9", 80698, 157000, 1, "Sep"),
  makeSample("s-blr-han", "BLR", "HAN", "Bengaluru", "Hanoi", "Vietnam", "Business", "1528127269322-539801943592", 94493, 138000, 0, "Oct"),
  makeSample("s-bom-cdg", "BOM", "CDG", "Mumbai", "Paris", "France", "Business", "1502602898657-3e91760cbb34", 38500, 72000, 1, "Dec"),
  makeSample("s-bom-dps", "BOM", "DPS", "Mumbai", "Bali", "Indonesia", "Economy", "1537996194471-e657df975ab4", 24900, 46000, 1, "Nov"),
  makeSample("s-del-dxb", "DEL", "DXB", "New Delhi", "Dubai", "UAE", "Economy", "1512453979798-5ea266f8880c", 14200, 26500, 0, "Jul"),
  makeSample("s-maa-sin", "MAA", "SIN", "Chennai", "Singapore", "Singapore", "Business", "1525625293386-3f8f99389edd", 62000, 112000, 0, "Sep"),
  makeSample("s-bom-vce", "BOM", "VCE", "Mumbai", "Venice", "Italy", "Economy", "1523906834658-6e24ef2386f9", 41500, 78000, 1, "Oct"),
  makeSample("s-del-zrh", "DEL", "ZRH", "New Delhi", "Zurich", "Switzerland", "Economy", "1506905925346-21bda4d32df4", 52300, 95000, 1, "Dec"),
];

export const Route = createFileRoute("/")({
  component: Landing,
});

/* ------------------------------ Page ------------------------------ */

function Landing() {
  return (
    <div className="min-h-screen bg-white text-[#0B1020] font-sans antialiased">
      <Nav />
      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        <Feed />
      </main>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#7C5BFF] flex items-center justify-center text-white font-bold text-[15px]">
            N
          </span>
          <span className="font-extrabold tracking-tight text-[18px]">Nishu</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="#deals" className="text-sm font-medium text-[#0B1020]/80 hover:text-[#0B1020]">
            Deals
          </a>
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

/* ------------------------------ Feed ------------------------------ */

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

  const [query, setQuery] = useState("");
  const [cabin, setCabin] = useState<"all" | "economy" | "business">("all");
  const [sort, setSort] = useState<"drop" | "price">("drop");

  const payload = q.data?.ok ? q.data.data : null;
  const fetchedDeals = payload?.deals ?? [];

  // Show live deals when the feed returns any; otherwise (empty list, error,
  // or still loading) fall back to sample data so the grid is never blank.
  const usingSample = fetchedDeals.length === 0;
  const deals = usingSample ? SAMPLE_DEALS : fetchedDeals;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = deals.filter((d) => {
      const isBusiness = /business|first/i.test(d.cabin ?? "");
      if (cabin === "business" && !isBusiness) return false;
      if (cabin === "economy" && isBusiness) return false;
      if (!q) return true;
      const hay = `${d.dest_city} ${d.dest_country ?? ""} ${d.origin_city} ${d.destination} ${d.origin}`.toLowerCase();
      return hay.includes(q);
    });
    return [...filtered].sort((a, b) =>
      sort === "price"
        ? a.price_inr - b.price_inr
        : (b.drop_pct ?? 0) - (a.drop_pct ?? 0),
    );
  }, [deals, query, cabin, sort]);

  return (
    <section id="deals">
      <SearchBar
        query={query}
        onQuery={setQuery}
        cabin={cabin}
        onCabin={setCabin}
        sort={sort}
        onSort={setSort}
        count={results.length}
      />

      {results.length === 0 ? (
        <div className="mt-10 text-center text-[15px] text-[#0B1020]/60">
          No deals match “{query}”.{" "}
          <button onClick={() => setQuery("")} className="font-semibold text-[#7C5BFF] hover:underline">
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
          {results.map((d, i) => (
            <DealCard key={d.id} deal={d} priority={i < 3} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------ Search ------------------------------ */

type CabinFilter = "all" | "economy" | "business";
type SortKey = "drop" | "price";

function SearchBar({
  query,
  onQuery,
  cabin,
  onCabin,
  sort,
  onSort,
  count,
}: {
  query: string;
  onQuery: (v: string) => void;
  cabin: CabinFilter;
  onCabin: (v: CabinFilter) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  count: number;
}) {
  const cabins: { key: CabinFilter; label: string }[] = [
    { key: "all", label: "All cabins" },
    { key: "economy", label: "Economy" },
    { key: "business", label: "Business" },
  ];

  return (
    <div className="rounded-2xl border border-black/8 bg-white p-3 shadow-[0_1px_2px_rgba(11,16,32,0.04)] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B1020]/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search destination, city or country…"
            className="h-11 w-full rounded-xl border border-black/10 bg-[#F7F8FA] pl-10 pr-9 text-[15px] text-[#0B1020] placeholder:text-[#0B1020]/40 outline-none transition focus:border-[#7C5BFF] focus:bg-white focus:ring-2 focus:ring-[#7C5BFF]/20"
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => onQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#0B1020]/40 hover:bg-black/5 hover:text-[#0B1020]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Cabin filter */}
        <div className="flex rounded-xl bg-[#F1F2F5] p-1">
          {cabins.map((c) => (
            <button
              key={c.key}
              onClick={() => onCabin(c.key)}
              className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition ${
                cabin === c.key
                  ? "bg-white text-[#0B1020] shadow-sm"
                  : "text-[#0B1020]/60 hover:text-[#0B1020]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
          className="h-11 rounded-xl border border-black/10 bg-[#F7F8FA] px-3 text-[14px] font-medium text-[#0B1020] outline-none transition focus:border-[#7C5BFF] focus:bg-white"
        >
          <option value="drop">Biggest drop</option>
          <option value="price">Lowest price</option>
        </select>
      </div>

      <div className="mt-2.5 px-1 text-[13px] text-[#0B1020]/55">
        {count} {count === 1 ? "deal" : "deals"}
      </div>
    </div>
  );
}

/* ------------------------------ Card ------------------------------ */

const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function dealImage(deal: Deal): string {
  if (deal.image) return deal.image;
  // Deterministic photo per deal so cards stay visually stable across refetches.
  // Small dimensions keep card thumbnails fast to fetch and decode.
  return `https://picsum.photos/seed/${encodeURIComponent(deal.id)}/600/400`;
}

function monthOf(date: string): string {
  // depart_date is a free-form string like "Dec 20"; take the leading token.
  return date?.trim().split(/\s+/)[0] ?? date;
}

function DealCard({ deal, priority = false }: { deal: Deal; priority?: boolean }) {
  const cabin = deal.cabin ?? "Economy";
  const isBusiness = /business|first/i.test(cabin);
  const title = deal.dest_country ? `${deal.dest_city}, ${deal.dest_country}` : deal.dest_city;
  const stopsLabel = deal.stops === 0 ? "Non stop" : `${deal.stops} stop`;
  const hasDrop = deal.drop_pct != null && deal.drop_pct > 0;

  return (
    <a
      href={deal.google_flights_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#EEF0F4]">
        <img
          src={dealImage(deal)}
          alt={title}
          width={600}
          height={413}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur px-2.5 py-1 text-[12px] font-medium text-[#0B1020] shadow-sm">
          {isBusiness ? (
            <Briefcase className="w-3.5 h-3.5" />
          ) : (
            <Armchair className="w-3.5 h-3.5" />
          )}
          {cabin}
        </div>
      </div>

      {/* Body */}
      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-semibold tracking-tight text-[#0B1020]">{title}</h3>
          {hasDrop && (
            <span className="shrink-0 text-[14px] font-semibold text-emerald-600">
              {deal.drop_pct}% off
            </span>
          )}
        </div>
        <div className="mt-1 text-[13px] text-[#0B1020]/60">
          {monthOf(deal.depart_date)} · {stopsLabel}
        </div>
        <div className="text-[13px] text-[#0B1020]/60">From {deal.origin_city}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[16px] font-bold text-[#0B1020]">{INR(deal.price_inr)}</span>
          {deal.typical_inr != null && deal.typical_inr > deal.price_inr && (
            <span className="text-[13px] line-through text-[#0B1020]/40">
              {INR(deal.typical_inr)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
