import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Crown, Search, X, TrendingDown } from "lucide-react";
import { Nav } from "../components/Nav";
import {
  type Deal,
  useDeals,
  INR,
  dealImage,
  dealDiscount,
  monthOf,
  stopsLabel,
} from "../lib/deals";

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

/* ------------------------------ Feed ------------------------------ */

function Feed() {
  const { deals } = useDeals();

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"drop" | "price">("drop");

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

function DealCard({ deal, priority = false }: { deal: Deal; priority?: boolean }) {
  const cabin = deal.cabin ?? "Economy";
  const title = deal.dest_country ? `${deal.dest_city}, ${deal.dest_country}` : deal.dest_city;
  const stops = stopsLabel(deal.stops);
  const { drop, typical } = dealDiscount(deal);
  const meta = [monthOf(deal.depart_date), stops].filter(Boolean).join(" · ");

  return (
    <Link to="/deal/$id" params={{ id: deal.id }} className="group block">
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
        <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-3 py-1.5 text-[13px] font-extrabold tracking-tight text-white shadow-[0_3px_12px_rgba(5,150,105,0.5)] ring-1 ring-white/25">
          <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />
          {drop}% OFF
        </div>
      </div>

      {/* Body */}
      <div className="pt-4 px-1">
        <div className="min-w-0">
          <h3 className="text-[20px] font-semibold tracking-tight text-[#0B1020]">{title}</h3>
          {meta && <div className="mt-1 text-[14px] text-[#0B1020]/55">{meta}</div>}
          <div className="text-[14px] text-[#0B1020]/55">From {deal.origin_city}</div>
        </div>
        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-[22px] font-bold tracking-tight text-[#0B1020]">{INR(deal.price_inr)}</span>
          <span className="text-[16px] line-through text-[#0B1020]/35">{INR(typical)}</span>
        </div>
      </div>
    </Link>
  );
}
