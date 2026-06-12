import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  
  Search,
  Sparkles,
  Star,
  Loader2,
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { searchFlights, type FlightOffer } from "@/lib/flights.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cheapest Flights from India" },
      {
        name: "description",
        content:
          "Handpicked roundtrip flight deals from India — up to 90% off on Tokyo, Berlin, Hong Kong, Athens, Toronto and more.",
      },
      { property: "og:title", content: "Cheapest Flights from India" },
      {
        property: "og:description",
        content: "Handpicked roundtrip flight deals from India — up to 90% off.",
      },
    ],
  }),
  component: Landing,
});

/* ------------------------------ Data ------------------------------ */

type Deal = {
  no: string;
  destination: string;
  country: string;
  airline: string;
  image: string;
  original: string;
  price: string;
  off: string;
  quote: string;
  member: string;
};

const deals: Deal[] = [
  {
    no: "N° 01",
    destination: "Hong Kong",
    country: "China SAR",
    airline: "Vistara",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1400&auto=format&fit=crop",
    original: "₹35,000",
    price: "₹15,850",
    off: "55%",
    quote:
      "A non-stop seat to Hong Kong for sixteen. I wasn't even looking — the deal arrived, and I left.",
    member: "Geetansh P.",
  },
  {
    no: "N° 02",
    destination: "Tokyo",
    country: "Japan",
    airline: "ANA",
    image:
      "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1400&auto=format&fit=crop",
    original: "₹75,000",
    price: "₹36,500",
    off: "51%",
    quote: "Non-stop Japan for two, all-in at ₹36k. We still talk about that morning.",
    member: "Shivangi V.",
  },
  {
    no: "N° 03",
    destination: "Berlin",
    country: "Germany",
    airline: "Oman Air",
    image:
      "https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=1400&auto=format&fit=crop",
    original: "₹72,000",
    price: "₹21,300",
    off: "70%",
    quote: "Berlin, round-trip, twenty-one. I brought the whole family. No regrets.",
    member: "Akshay R.",
  },
  {
    no: "N° 04",
    destination: "Athens",
    country: "Greece",
    airline: "Kuwait Airways",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&auto=format&fit=crop",
    original: "₹65,000",
    price: "₹24,000",
    off: "63%",
    quote: "Athens for the ruins, Santorini for the sunset, Crete for the silence.",
    member: "Vanshika M.",
  },
  {
    no: "N° 05",
    destination: "Toronto",
    country: "Canada",
    airline: "British Airways",
    image:
      "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1400&auto=format&fit=crop",
    original: "₹1,35,000",
    price: "₹69,700",
    off: "48%",
    quote: "Toronto for under seventy. I've paid double for half the comfort.",
    member: "Sonia S.",
  },
  {
    no: "N° 06",
    destination: "Phnom Penh",
    country: "Cambodia",
    airline: "Cambodia Angkor",
    image:
      "https://images.unsplash.com/photo-1563449716-f6f78d6e9d7c?w=1400&auto=format&fit=crop",
    original: "₹36,000",
    price: "₹17,200",
    off: "52%",
    quote: "Booked on a whim. Returned with the best trip of the year.",
    member: "Nivedita M.",
  },
];

/* ------------------------------ Page ------------------------------ */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav />
      <Archive />
    </div>
  );
}

/* ------------------------------ Nav ------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/85 border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="/" className="flex items-baseline gap-2">
          <span className="font-serif italic text-2xl leading-none">Skyhop</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Est. MMXXIV
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#archive" className="hover:text-gold transition">The Archive</a>
          <a href="#search" className="hover:text-gold transition">Search</a>
          <a href="#manifesto" className="hover:text-gold transition">Manifesto</a>
          <a href="#faq" className="hover:text-gold transition">FAQ</a>
        </nav>
        <a
          href="#search"
          className="group inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-foreground text-background hover:bg-ink-soft transition"
        >
          Begin
          <ArrowUpRight className="w-4 h-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </header>
  );
}

/* ----------------------------- Hero ------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="w-8 h-px bg-foreground/40" />
          Volume IV · Bulletin of Quiet Bargains
        </div>

        <h1 className="font-serif mt-8 text-[14vw] md:text-[9vw] leading-[0.92] tracking-tight text-balance">
          Flights, <em className="text-gold">handpicked</em>
          <br />
          like first editions.
        </h1>

        <div className="mt-10 grid md:grid-cols-12 gap-10 items-end">
          <p className="md:col-span-6 text-lg leading-relaxed text-muted-foreground max-w-xl">
            We read fares the way a good editor reads manuscripts — slowly, with prejudice.
            What you see below is what remains after the rejections: roundtrips worth the
            ink, often forty to ninety percent below the going rate.
          </p>
          <div className="md:col-span-6 md:justify-self-end flex flex-wrap items-end gap-8">
            <Stat number="2,431" label="fares read this week" />
            <Stat number="06" label="deemed worthy" />
            <Stat number="68%" label="median saving" gold />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#search"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-foreground text-background text-sm font-medium tracking-wide uppercase hover:bg-ink-soft transition"
          >
            Search live fares
            <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
          </a>
          <a
            href="#archive"
            className="inline-flex items-center gap-2 px-5 py-4 text-sm uppercase tracking-wider hover:text-gold transition"
          >
            Browse the archive
          </a>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label, gold }: { number: string; label: string; gold?: boolean }) {
  return (
    <div>
      <div
        className={`font-serif text-4xl md:text-5xl leading-none ${
          gold ? "text-gold" : ""
        }`}
      >
        {number}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/* ---------------------------- Marquee ----------------------------- */

function Marquee() {
  const items = [
    "Tokyo · 51% off",
    "Berlin · 70% off",
    "Athens · 63% off",
    "Toronto · 48% off",
    "Hong Kong · 55% off",
    "Phnom Penh · 52% off",
    "Lisbon · 61% off",
    "Reykjavík · 44% off",
  ];
  return (
    <div className="border-b hairline overflow-hidden bg-ink text-cream">
      <div className="flex marquee whitespace-nowrap py-4 font-serif italic text-2xl gap-12">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t}
            <Star className="w-3 h-3 text-gold fill-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------- Search panel --------------------------- */

function SearchPanel() {
  const [origin, setOrigin] = useState("DEL");
  const [destination, setDestination] = useState("NRT");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<"economy" | "premium-economy" | "business" | "first">(
    "economy",
  );

  const search = useServerFn(searchFlights);
  const mutation = useMutation({
    mutationFn: (input: {
      origin: string;
      destination: string;
      departDate: string;
      returnDate: string;
      adults: number;
      cabin: typeof cabin;
    }) => search({ data: input }),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      departDate: depart,
      returnDate: ret,
      adults,
      cabin,
    });
  };

  return (
    <section id="search" className="border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            § II — The Live Desk
          </div>
          <h2 className="font-serif text-5xl md:text-6xl mt-5 leading-[1] text-balance">
            Tell us where.<br />
            <em className="text-gold">We'll tell you when it's cheap.</em>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Live fares are pulled from our <span className="font-serif italic">fast-flights</span>{" "}
            engine — the same one our editors consult before recommending a route. Use IATA codes
            (DEL, BOM, NRT, LHR…).
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="md:col-span-8 bg-card border hairline rounded-lg p-6 md:p-8 shadow-[0_30px_80px_-40px_rgba(11,11,15,0.25)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Origin" icon={<MapPin className="w-4 h-4" />}>
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="DEL"
                className="w-full bg-transparent outline-none uppercase tracking-widest font-serif text-2xl"
                maxLength={4}
                required
              />
            </Field>
            <Field label="Destination" icon={<MapPin className="w-4 h-4" />}>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="NRT"
                className="w-full bg-transparent outline-none uppercase tracking-widest font-serif text-2xl"
                maxLength={4}
                required
              />
            </Field>
            <Field label="Depart" icon={<Calendar className="w-4 h-4" />}>
              <input
                type="date"
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
                className="w-full bg-transparent outline-none font-sans text-base"
                required
              />
            </Field>
            <Field label="Return (optional)" icon={<Calendar className="w-4 h-4" />}>
              <input
                type="date"
                value={ret}
                onChange={(e) => setRet(e.target.value)}
                className="w-full bg-transparent outline-none font-sans text-base"
              />
            </Field>
            <Field label="Travellers" icon={<Users className="w-4 h-4" />}>
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-8 h-8 rounded-full border hairline hover:bg-secondary"
                >
                  −
                </button>
                <span className="font-serif text-2xl">{adults}</span>
                <button
                  type="button"
                  onClick={() => setAdults(Math.min(9, adults + 1))}
                  className="w-8 h-8 rounded-full border hairline hover:bg-secondary"
                >
                  +
                </button>
              </div>
            </Field>
            <Field label="Cabin">
              <select
                value={cabin}
                onChange={(e) => setCabin(e.target.value as typeof cabin)}
                className="w-full bg-transparent outline-none font-sans text-base"
              >
                <option value="economy">Economy</option>
                <option value="premium-economy">Premium economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </Field>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-6 w-full inline-flex items-center justify-center gap-3 bg-foreground text-background py-4 rounded-full text-sm uppercase tracking-[0.2em] font-medium hover:bg-ink-soft transition disabled:opacity-60"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Reading the wires…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Find fares
              </>
            )}
          </button>

          <Results data={mutation.data} error={mutation.error} isPending={mutation.isPending} />
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
        {icon}
        {label}
      </div>
      <div className="border-b hairline pb-3 focus-within:border-foreground transition-colors">
        {children}
      </div>
    </label>
  );
}

function Results({
  data,
  error,
  isPending,
}: {
  data?: { ok: boolean; offers: FlightOffer[]; error?: string };
  error: unknown;
  isPending: boolean;
}) {
  if (isPending) return null;
  if (error) {
    return (
      <p className="mt-6 text-sm text-destructive">
        {error instanceof Error ? error.message : "Something went wrong."}
      </p>
    );
  }
  if (!data) return null;
  if (!data.ok && data.error) {
    return (
      <div className="mt-8 border-t hairline pt-6">
        <p className="text-sm text-muted-foreground italic">
          {data.error}
        </p>
      </div>
    );
  }
  if (data.offers.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted-foreground italic">
        No fares matched. Try widening your dates.
      </p>
    );
  }
  return (
    <div className="mt-8 border-t hairline pt-6 space-y-3">
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {data.offers.length} fares · sorted by editor
      </div>
      {data.offers.slice(0, 8).map((o, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 py-3 border-b border-dashed border-foreground/15 last:border-0"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-serif italic text-muted-foreground w-10">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="font-medium truncate">{o.airline}</div>
              <div className="text-xs text-muted-foreground truncate">
                {o.departure} → {o.arrival} · {o.duration} · {o.stops}
              </div>
            </div>
          </div>
          <div className="font-serif text-2xl">{o.price}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- Archive ----------------------------- */

function Archive() {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 420, behavior: "smooth" });

  return (
    <section id="archive" className="border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Editor's picks
            </div>
            <h1 className="font-serif text-5xl md:text-7xl mt-5 leading-[1] text-balance max-w-3xl">
              Cheapest flights <em className="text-gold">from India</em>.
            </h1>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-12 h-12 rounded-full border hairline hover:bg-secondary grid place-items-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-12 h-12 rounded-full border hairline hover:bg-secondary grid place-items-center"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="mt-12 flex gap-8 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:-mx-10 md:px-10 pb-6 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {deals.map((d) => (
            <DealCard key={d.no} deal={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="snap-start shrink-0 w-[340px] md:w-[400px] group">
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={deal.image}
          alt={deal.destination}
          loading="lazy"
          className="w-full aspect-[4/5] object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-cream bg-ink/70 backdrop-blur px-2.5 py-1">
          {deal.no}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-cream">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">
              {deal.airline} · Economy
            </div>
            <div className="font-serif text-3xl mt-1">{deal.destination}</div>
            <div className="text-xs opacity-80 italic">{deal.country}</div>
          </div>
          <div className="text-right">
            <div className="font-serif italic text-gold text-2xl">−{deal.off}</div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl">{deal.price}</span>
          <span className="line-through text-muted-foreground text-sm">{deal.original}</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Round trip
        </span>
      </div>

      <p className="mt-4 text-sm text-foreground/75 leading-relaxed italic font-serif">
        "{deal.quote}"
      </p>
      <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        — {deal.member}, Member
      </div>
    </article>
  );
}

/* --------------------------- Manifesto ---------------------------- */

const principles = [
  {
    n: "I.",
    title: "Read everything.",
    body:
      "Two-thousand fares cross our desk before breakfast. We dismiss most by lunch. What survives is rare by design.",
  },
  {
    n: "II.",
    title: "Forty percent or it doesn't print.",
    body:
      "A deal that saves you less than forty percent isn't a deal — it's a fare. We send the former, never the latter.",
  },
  {
    n: "III.",
    title: "No layovers in places nobody asked for.",
    body:
      "Non-stop where it exists. One stop where it's elegant. Never three connections to save a thousand rupees.",
  },
  {
    n: "IV.",
    title: "You book where you trust.",
    body:
      "We don't sell tickets. We find them. You finish the transaction with the airline or the agent of your choosing.",
  },
];

function Manifesto() {
  return (
    <section id="manifesto" className="border-b hairline bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="text-[11px] uppercase tracking-[0.3em] text-cream/60">
            § IV — Manifesto
          </div>
          <h2 className="font-serif text-5xl md:text-6xl mt-6 leading-[1]">
            Four rules we<br />
            <em className="text-gold">do not break.</em>
          </h2>
          <p className="mt-6 text-cream/70 max-w-md leading-relaxed">
            A standing editorial policy, posted plainly so you may hold us to it.
          </p>
        </div>
        <ol className="md:col-span-7 space-y-10">
          {principles.map((p) => (
            <li key={p.n} className="grid grid-cols-[3rem_1fr] gap-6 border-t border-cream/15 pt-8 first:border-0 first:pt-0">
              <span className="font-serif italic text-3xl text-gold">{p.n}</span>
              <div>
                <h3 className="font-serif text-2xl">{p.title}</h3>
                <p className="mt-2 text-cream/70 leading-relaxed">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------- Testimonials -------------------------- */

const testimonials = [
  {
    name: "Rhea Kapoor",
    role: "Architect, Bombay",
    quote:
      "Skyhop sent me to Bali for forty thousand less than my friends paid the same week. I screenshotted the email and framed it.",
  },
  {
    name: "Vishakh Iyer",
    role: "Filmmaker, Bangalore",
    quote:
      "I travel for a living. Their curated dispatches consistently beat every fare engine I subscribe to. Quietly indispensable.",
  },
  {
    name: "Jay Mathur",
    role: "Student, Delhi",
    quote:
      "First time abroad. Got Europe round-trip for the price of a domestic ticket. It hasn't quite sunk in.",
  },
];

function Testimonials() {
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            § V — Letters Received
          </div>
          <h2 className="font-serif text-5xl md:text-6xl mt-6 leading-[1] text-balance">
            From the <em className="text-gold">ones who boarded</em>.
          </h2>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-px bg-border">
          {testimonials.map((t) => (
            <figure key={t.name} className="bg-background p-10">
              <Sparkles className="w-4 h-4 text-gold" />
              <blockquote className="mt-6 font-serif text-2xl leading-snug text-balance">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-dashed border-foreground/20">
                <div className="font-medium">{t.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                  {t.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ------------------------------- */

const faqs = [
  {
    q: "Are you a travel agency?",
    a: "No. We are a deal-curation desk. We surface extraordinary fares; you book directly with the airline or your preferred agent.",
  },
  {
    q: "How does the live search work?",
    a: "Our search panel queries our fast-flights backend in real time. Curated archive deals are editor-selected; live fares are what's available now.",
  },
  {
    q: "Which airports do you cover?",
    a: "Currently DEL, BOM, BLR, HYD, MAA, and CCU for curated dispatches. Live search supports any IATA-coded airport worldwide.",
  },
  {
    q: "How quickly should I book?",
    a: "Within minutes when possible. Extraordinary fares rarely survive the afternoon.",
  },
  {
    q: "Who reads the fares?",
    a: "A small editorial team of obsessive travellers. We have opinions and we are not shy with them.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-b hairline">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-24 md:py-32">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground text-center">
          § VI — Reader Correspondence
        </div>
        <h2 className="font-serif text-5xl md:text-6xl mt-6 leading-[1] text-center text-balance">
          Questions, <em className="text-gold">answered briefly</em>.
        </h2>
        <div className="mt-16">
          {faqs.map((f, i) => (
            <div key={i} className="border-t hairline last:border-b">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-baseline justify-between gap-6 py-8 text-left group"
              >
                <span className="flex items-baseline gap-6">
                  <span className="font-serif italic text-gold text-lg w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-2xl md:text-3xl group-hover:text-gold transition">
                    {f.q}
                  </span>
                </span>
                <span
                  className={`shrink-0 font-serif text-3xl transition-transform ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-8 pl-14 pr-8 text-muted-foreground leading-relaxed max-w-2xl">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Footer ------------------------------ */

function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <div className="font-serif italic text-6xl md:text-8xl leading-none">
              Skyhop.
            </div>
            <p className="mt-6 max-w-md text-cream/70">
              Stop searching. Start saving. A quiet bulletin for the well-travelled.
            </p>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-3">
                Sections
              </div>
              <ul className="space-y-2">
                <li><a href="#archive" className="hover:text-gold">Archive</a></li>
                <li><a href="#search" className="hover:text-gold">Live search</a></li>
                <li><a href="#manifesto" className="hover:text-gold">Manifesto</a></li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-3">
                House
              </div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gold">About</a></li>
                <li><a href="#" className="hover:text-gold">Contact</a></li>
                <li><a href="#" className="hover:text-gold">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-6 border-t border-cream/15 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-cream/50">
          <span>© {new Date().getFullYear()} Skyhop Editorial Ltd.</span>
          <span className="font-serif italic normal-case tracking-normal text-cream/70">
            Printed on the wires. Bound in pixels.
          </span>
        </div>
      </div>
    </footer>
  );
}
