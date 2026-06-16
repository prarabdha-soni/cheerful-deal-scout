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
  const [sort, setSort] = useState<"drop" | "price">("drop");

  const payload = q.data?.ok ? q.data.data : null;
  const fetchedDeals = payload?.deals ?? [];

  const usingSample = fetchedDeals.length === 0;
  const deals = usingSample ? SAMPLE_DEALS : fetchedDeals;

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = deals.filter((d) => {
      if (!needle) return true;
      const hay = `${d.dest_city} ${d.dest_country ?? ""} ${d.origin_city} ${d.destination} ${d.origin}`.toLowerCase();
      return hay.includes(needle);
    });
    return [...filtered].sort((a, b) =>
      sort === "price"
        ? a.price_inr - b.price_inr
        : (b.drop_pct ?? 0) - (a.drop_pct ?? 0),
    );
  }, [deals, query, sort]);

  return (
    <section id="deals">
      <SearchBar
        query={query}
        onQuery={setQuery}
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {results.map((d, i) => (
            <DealCard key={d.id} deal={d} priority={i < 3} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------ Search ------------------------------ */

type SortKey = "drop" | "price";

function SearchBar({
  query,
  onQuery,
  sort,
  onSort,
  count,
}: {
  query: string;
  onQuery: (v: string) => void;
  sort: SortKey;
  onSort: (v: SortKey) => void;
  count: number;
}) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-3 shadow-[0_1px_2px_rgba(11,16,32,0.04)] sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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

// Curated, reliable Unsplash photo IDs per destination city.
const CITY_PHOTOS: Record<string, string> = {
  Tokyo: "1540959733332-eab4deabeeaf",
  Adelaide: "1506973035872-a4ec16b8e8d9",
  Hanoi: "1528127269322-539801943592",
  Paris: "1502602898657-3e91760cbb34",
  Bali: "1537996194471-e657df975ab4",
  Dubai: "1512453979798-5ea266f8880c",
  Singapore: "1525625293386-3f8f99389edd",
  Venice: "1523906834658-6e24ef2386f9",
  Zurich: "1506905925346-21bda4d32df4",
  London: "1513635269975-59663e0ac1ad",
  "New York": "1500916434205-0c77489c6cf7",
  Bangkok: "1508009603885-50cf7c579365",
  Sydney: "1506973035872-a4ec16b8e8d9",
  Rome: "1552832230-c0197dd311b5",
  Istanbul: "1524231757912-21f4fe3a7200",
  Barcelona: "1539037116277-4db20889f2d4",
  Amsterdam: "1534351590666-13e3e96c5017",
  Seoul: "1538485399081-7c8970f1c7c8",
  "Hong Kong": "1536599524557-5f784dd53282",
  "Kuala Lumpur": "1596422846543-75c6fc197f07",
  Maldives: "1514282401047-d79a71a590e8",
  Phuket: "1589394815804-964ed0be2eb5",
  Doha: "1559059699-085698eba48c",
  Auckland: "1507699622108-4be3abd695ad",
  Melbourne: "1514395462725-fb4566210144",
  Colombo: "1546708973-b321cccf1a3b",
  Kathmandu: "1532686255137-7ba3b66dca4f",
  Male: "1514282401047-d79a71a590e8",
};

const FALLBACK_PHOTOS = [
  "1488085061387-422e29b40080",
  "1502920917128-1aa500764cbd",
  "1469854523086-cc02fe5d8800",
  "1500530855697-b586d89ba3ee",
  "1507608616759-54f48f0af0ee",
  "1476514525535-07fb3b4ae5f1",
];

function dealImage(deal: Deal): string {
  if (deal.image) return deal.image;
  const id =
    CITY_PHOTOS[deal.dest_city] ??
    FALLBACK_PHOTOS[
      Math.abs(
        [...deal.id].reduce((a, c) => a + c.charCodeAt(0), 0),
      ) % FALLBACK_PHOTOS.length
    ];
  return `https://images.unsplash.com/photo-${id}?w=800&q=70&auto=format&fit=crop`;
}

function monthOf(date: string): string {
  return date?.trim().split(/\s+/)[0] ?? date;
}

function DealCard({ deal, priority = false }: { deal: Deal; priority?: boolean }) {
  const cabin = deal.cabin ?? "Economy";
  const title = deal.dest_country ? `${deal.dest_city}, ${deal.dest_country}` : deal.dest_city;
  const stopsLabel = deal.stops === 0 ? "Non stop" : `${deal.stops} stop`;
  const hasDrop = deal.drop_pct != null && deal.drop_pct > 0;
  const hasTypical = deal.typical_inr != null && deal.typical_inr > deal.price_inr;

  return (
    <a
      href={deal.google_flights_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-3xl bg-[#EEF0F4] ring-1 ring-black/5">
        <img
          src={dealImage(deal)}
          alt={title}
          width={800}
          height={560}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#0B1020] shadow-[0_2px_8px_rgba(11,16,32,0.08)]">
          <Crown className="w-3.5 h-3.5" strokeWidth={2} />
          {cabin}
        </div>
      </div>

      {/* Body */}
      <div className="pt-4 px-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[20px] font-semibold tracking-tight text-[#0B1020]">{title}</h3>
            <div className="mt-1 text-[14px] text-[#0B1020]/55">
              {monthOf(deal.depart_date)} · {stopsLabel}
            </div>
            <div className="text-[14px] text-[#0B1020]/55">From {deal.origin_city}</div>
          </div>
          {hasDrop && (
            <span className="shrink-0 rounded-full bg-[#E8F5C8] px-3 py-1.5 text-[13px] font-semibold text-[#3F6B1E]">
              {deal.drop_pct}% off
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-[22px] font-bold tracking-tight text-[#0B1020]">{INR(deal.price_inr)}</span>
          {hasTypical && (
            <span className="text-[16px] line-through text-[#0B1020]/35">
              {INR(deal.typical_inr!)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
