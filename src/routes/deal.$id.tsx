import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, CalendarDays, MessageCircle, ExternalLink, Plane } from "lucide-react";
import { Nav } from "../components/Nav";
import {
  type Deal,
  useDeals,
  INR,
  dealImage,
  dealDiscount,
  dealLastsDays,
  monthOf,
  stopsLabel,
  destBlurb,
} from "../lib/deals";

export const Route = createFileRoute("/deal/$id")({
  component: DealDetail,
});

function DealDetail() {
  const { id } = Route.useParams();
  const { deals, isLoading } = useDeals();
  const deal = deals.find((d) => d.id === id);

  return (
    <div className="min-h-screen bg-white text-[#0B1020] font-sans antialiased">
      <Nav />
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 py-6 sm:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-[14px] font-medium text-[#0B1020]/60 hover:text-[#0B1020]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to deals
        </Link>

        {isLoading && !deal ? (
          <div className="mt-16 text-center text-[15px] text-[#0B1020]/60">Loading deal…</div>
        ) : !deal ? (
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold">Deal not found</h1>
            <p className="mt-2 text-[15px] text-[#0B1020]/60">
              This deal may have expired or sold out.
            </p>
            <Link to="/" className="mt-5 inline-block font-semibold text-[#7C5BFF] hover:underline">
              Browse all deals
            </Link>
          </div>
        ) : (
          <DealBody deal={deal} />
        )}
      </main>
    </div>
  );
}

function DealBody({ deal }: { deal: Deal }) {
  const { drop, typical } = dealDiscount(deal);
  const cabin = deal.cabin ?? "Economy";
  const title = deal.dest_city;
  const lasts = dealLastsDays(deal);

  function shareWhatsApp() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text =
      `✈️ ${deal.origin_city} → ${deal.dest_city}${deal.dest_country ? `, ${deal.dest_country}` : ""}\n` +
      `${INR(deal.price_inr)} (was ${INR(typical)} · ${drop}% off) · ${cabin}\n` +
      `Grab it on Nishu: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Left: destination + flight legs */}
      <div className="min-w-0">
        <div className="grid gap-6 sm:grid-cols-2 sm:items-start">
          <div>
            <h1 className="text-[40px] leading-[1.05] font-bold tracking-tight">{title}</h1>
            {deal.dest_country && (
              <div className="mt-1 text-[16px] font-medium text-[#0B1020]/55">{deal.dest_country}</div>
            )}
            <p className="mt-4 text-[14px] leading-relaxed text-[#0B1020]/60">{destBlurb(deal)}</p>
          </div>
          <div className="overflow-hidden rounded-2xl bg-[#EEF0F4] ring-1 ring-black/5">
            <img
              src={dealImage(deal, 900)}
              alt={title}
              width={900}
              height={675}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>

        {/* Date & seating */}
        <div className="mt-6 rounded-2xl border border-black/8 bg-white p-5 shadow-[0_1px_2px_rgba(11,16,32,0.04)]">
          <div className="flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-[#0B1020]/45">
            <CalendarDays className="h-3.5 w-3.5" />
            Date &amp; Seating
          </div>
          <div className="mt-1.5 text-[16px] font-semibold">
            {[monthOf(deal.depart_date), deal.return_date ? monthOf(deal.return_date) : null]
              .filter((m, i, a) => m && a.indexOf(m) === i)
              .join(" – ")}{" "}
            · {cabin}
          </div>
        </div>

        {/* Flight legs */}
        <FlightLeg
          label="Departure"
          fromCode={deal.origin}
          toCode={deal.destination}
          fromCity={deal.origin_city}
          toCity={deal.dest_city}
          stops={deal.stops}
        />
        <FlightLeg
          label="Return"
          fromCode={deal.destination}
          toCode={deal.origin}
          fromCity={deal.dest_city}
          toCity={deal.origin_city}
          stops={deal.stops}
        />
      </div>

      {/* Right: price + actions */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-[0_4px_24px_rgba(11,16,32,0.06)]">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[34px] font-bold tracking-tight text-[#3B5BFF]">{INR(deal.price_inr)}</span>
          </div>
          <div className="mt-1 text-[15px] line-through text-[#0B1020]/35">{INR(typical)}</div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
            {drop}% off · Deal lasts {lasts} {lasts === 1 ? "day" : "days"}
          </div>

          <a
            href={deal.google_flights_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3B5BFF] text-[15px] font-semibold text-white transition hover:bg-[#2f4ae0]"
          >
            <ExternalLink className="h-4 w-4" />
            Book on Google Flights
          </a>
          <button
            onClick={shareWhatsApp}
            className="mt-2.5 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-white text-[15px] font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <MessageCircle className="h-4 w-4" />
            Share on WhatsApp
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[#0B1020]/45">
            <Plane className="h-3.5 w-3.5" />
            {deal.airline && deal.airline !== "Multiple" ? `${deal.airline} · ` : ""}roundtrip from{" "}
            {deal.origin_city}
          </div>
        </div>
      </aside>
    </div>
  );
}

function FlightLeg({
  label,
  fromCode,
  toCode,
  fromCity,
  toCity,
  stops,
}: {
  label: string;
  fromCode: string;
  toCode: string;
  fromCity: string;
  toCity: string;
  stops: unknown;
}) {
  const stopText = stopsLabel(stops) ?? "—";
  return (
    <div className="mt-4 rounded-2xl border border-black/8 bg-white p-5 shadow-[0_1px_2px_rgba(11,16,32,0.04)]">
      <div className="text-[14px] font-semibold">{label}</div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-[#0B1020]/40">From</div>
          <div className="text-[30px] font-bold leading-none tracking-tight">{fromCode}</div>
          <div className="mt-1 text-[13px] text-[#0B1020]/55">{fromCity}</div>
        </div>
        <div className="flex flex-col items-center text-[#0B1020]/45">
          <span className="text-[12px]">{stopText}</span>
          <span className="my-1 h-px w-16 bg-[#0B1020]/15" />
          <Plane className="h-4 w-4 rotate-90" />
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wide text-[#0B1020]/40">To</div>
          <div className="text-[30px] font-bold leading-none tracking-tight">{toCode}</div>
          <div className="mt-1 text-[13px] text-[#0B1020]/55">{toCity}</div>
        </div>
      </div>
    </div>
  );
}
