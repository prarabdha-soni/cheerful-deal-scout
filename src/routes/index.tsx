import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plane, Search, Sparkles, Eye, Clock, Send, Luggage, BadgePercent, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skyhop — Handpicked roundtrip flight deals that save you a fortune" },
      { name: "description", content: "Handpicked roundtrip flight deals up to 90% off. We sift through thousands of fares daily so you only see the ones worth booking." },
      { property: "og:title", content: "Skyhop — Handpicked flight deals" },
      { property: "og:description", content: "Handpicked roundtrip flight deals up to 90% off." },
    ],
  }),
  component: Landing,
});

type Deal = {
  destination: string;
  airline: string;
  image: string;
  original: string;
  price: string;
  off: string;
  quote: string;
  member: string;
  tint: string;
};

const deals: Deal[] = [
  {
    destination: "Hong Kong",
    airline: "Vistara",
    image: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1200&auto=format&fit=crop",
    original: "₹35,000", price: "₹15,850", off: "55% off",
    quote: "Got a non-stop flight to Hong Kong for 16k. Wasn't even searching, the deal just popped up and I booked it.",
    member: "Geetansh P.", tint: "oklch(0.96 0.05 295)",
  },
  {
    destination: "Tokyo, Japan",
    airline: "ANA",
    image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1200&auto=format&fit=crop",
    original: "₹75,000", price: "₹36,500", off: "51% off",
    quote: "Booked a non-stop Japan trip for me and my partner for ₹36,000. Still can't believe we got Japan for that price!",
    member: "Shivangi V.", tint: "oklch(0.97 0.05 75)",
  },
  {
    destination: "Berlin, Germany",
    airline: "Oman Air",
    image: "https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=1200&auto=format&fit=crop",
    original: "₹72,000", price: "₹21,300", off: "70% off",
    quote: "Went to Berlin for 21k round-trip and took the whole family. Glad it worked out so well.",
    member: "Akshay", tint: "oklch(0.97 0.03 230)",
  },
  {
    destination: "Phnom Penh",
    airline: "Cambodia Angkor",
    image: "https://images.unsplash.com/photo-1563492065-1a3b3b3b0b0b?w=1200&auto=format&fit=crop",
    original: "₹36,000", price: "₹17,200", off: "52% off",
    quote: "Saw a non-stop Cambodia deal for ₹17k and booked it on impulse. Turned into one of my favourite trips.",
    member: "Nivedita M.", tint: "oklch(0.97 0.04 145)",
  },
  {
    destination: "Toronto, Canada",
    airline: "British Airways",
    image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1200&auto=format&fit=crop",
    original: "₹1,35,000", price: "₹69,700", off: "48% off",
    quote: "Round-trip to Toronto for ₹70k. I've booked this route before for way more, so this was a pleasant surprise.",
    member: "Sonia S.", tint: "oklch(0.97 0.03 260)",
  },
  {
    destination: "Athens, Greece",
    airline: "Kuwait Airways",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop",
    original: "₹65,000", price: "₹24,000", off: "63% off",
    quote: "Explored Athens, adored Santorini sunsets, and delved into Crete's rich stories — all thanks to this deal.",
    member: "Vanshika", tint: "oklch(0.97 0.04 230)",
  },
];

const savingsTable: Record<string, { normal: number; deal: number }> = {
  "Tokyo": { normal: 75000, deal: 36500 },
  "Hong Kong": { normal: 35000, deal: 15850 },
  "Berlin": { normal: 72000, deal: 21300 },
  "Athens": { normal: 65000, deal: 24000 },
  "Toronto": { normal: 135000, deal: 69700 },
  "Phnom Penh": { normal: 36000, deal: 17200 },
};

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <DealsCarousel />
      <Calculator />
      <HowItWorks />
      <Special />
      <Testimonials />
      <FAQ />
      <AppCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Plane className="w-5 h-5 -rotate-45" />
          </span>
          skyhop
        </a>
        <div className="flex items-center gap-3">
          <a href="#app" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground">Get the app</a>
          <a href="#deals" className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition">
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,oklch(0.95_0.06_295)_0%,transparent_55%),radial-gradient(circle_at_80%_10%,oklch(0.95_0.06_220)_0%,transparent_50%)]" />
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-24 md:pt-28 md:pb-32">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.05]">
          Handpicked roundtrip deals that save you a fortune
        </h1>
        <div className="mt-10">
          <a href="#deals" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] transition">
            View deals <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function DealsCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };
  return (
    <section id="deals" className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <h2 className="text-3xl md:text-4xl font-semibold text-center">Past deals our members claimed</h2>
        <div className="relative mt-12">
          <button onClick={() => scroll(-1)} aria-label="Previous"
            className="hidden md:grid place-items-center absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card border border-border shadow-md hover:bg-accent">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll(1)} aria-label="Next"
            className="hidden md:grid place-items-center absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-card border border-border shadow-md hover:bg-accent">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div ref={scroller} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {deals.map((d) => <DealCard key={d.destination} deal={d} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article
      className="snap-start shrink-0 w-[320px] md:w-[360px] rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col"
      style={{ background: deal.tint }}
    >
      <div className="p-3">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
          <img src={deal.image} alt={deal.destination} className="w-full h-full object-cover" loading="lazy" />
          <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-md bg-black/70 text-white backdrop-blur">
            Economy
          </span>
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
            {deal.airline}
          </div>
        </div>
        <div className="px-2 pt-4">
          <div className="text-xs text-muted-foreground">Round Trip</div>
          <div className="flex items-end justify-between mt-1 gap-3">
            <h3 className="text-xl font-semibold">{deal.destination}</h3>
            <span className="text-success font-semibold text-sm whitespace-nowrap" style={{ color: "oklch(0.55 0.18 145)" }}>{deal.off}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="line-through text-muted-foreground text-sm">{deal.original}</span>
            <span className="text-lg font-semibold">{deal.price}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-dashed border-foreground/15 mt-2 px-5 py-4 flex-1 flex flex-col justify-between">
        <p className="text-sm text-foreground/80 leading-relaxed">"{deal.quote}"</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-foreground/10 grid place-items-center text-xs font-semibold">
            {deal.member.charAt(0)}
          </div>
          <span className="text-sm font-medium">{deal.member}</span>
        </div>
      </div>
    </article>
  );
}

function Calculator() {
  const [dest, setDest] = useState("");
  const [travellers, setTravellers] = useState(1);
  const match = useMemo(() => {
    const key = Object.keys(savingsTable).find((k) => k.toLowerCase().includes(dest.toLowerCase()) && dest.length > 1);
    return key ? { key, ...savingsTable[key] } : null;
  }, [dest]);

  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-accent/40 to-background">
      <div className="mx-auto max-w-5xl px-5">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-wider text-primary font-semibold">Savings calculator</p>
          <h2 className="text-3xl md:text-5xl font-semibold mt-3">Want to see how much you would save?</h2>
          <p className="mt-4 text-muted-foreground">We sift through countless flight offers to find the best ones for you.</p>
        </div>
        <div className="mt-12 rounded-3xl bg-card border border-border shadow-xl p-6 md:p-10 grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">Enter destination</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={dest} onChange={(e) => setDest(e.target.value)}
                  placeholder="Try Tokyo, Berlin, Athens..."
                  className="w-full h-12 pl-10 pr-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Travellers</label>
              <div className="inline-flex items-center rounded-xl border border-input bg-background h-12 px-2">
                <button onClick={() => setTravellers(Math.max(1, travellers - 1))} className="w-9 h-9 rounded-lg hover:bg-accent">−</button>
                <span className="w-10 text-center font-medium">{travellers}</span>
                <button onClick={() => setTravellers(Math.min(9, travellers + 1))} className="w-9 h-9 rounded-lg hover:bg-accent">+</button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.5_0.2_260)] text-primary-foreground p-6 md:p-8 flex flex-col justify-center">
            {match ? (
              <>
                <div className="text-sm opacity-80">You would save on {match.key}</div>
                <div className="text-5xl font-bold mt-2">
                  ₹{((match.normal - match.deal) * travellers).toLocaleString("en-IN")}
                </div>
                <div className="mt-3 text-sm opacity-90">
                  Normal: ₹{(match.normal * travellers).toLocaleString("en-IN")} · Skyhop: ₹{(match.deal * travellers).toLocaleString("en-IN")}
                </div>
                <a href="#deals" className="mt-6 inline-flex items-center gap-2 self-start bg-white text-primary px-5 py-2.5 rounded-full font-medium text-sm hover:opacity-90">
                  Start saving with Skyhop <ChevronRight className="w-4 h-4" />
                </a>
              </>
            ) : (
              <div className="opacity-90">Select a destination to see your savings.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: Search, title: "We search thousands of fares daily", body: "You don't have to waste hours on flight engines. We already did it." },
  { icon: Eye, title: "Every deal inspected like a detective", body: "You won't find 100 options here. Just the one that actually makes sense." },
  { icon: Clock, title: "Hot deals don't last — we catch them in time", body: "We're watching prices all day, so when something big drops, you're the first to know." },
  { icon: Send, title: "You book it however you like", body: "We don't sell tickets. We find the best ones and let you book where you trust." },
];

function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <h2 className="text-3xl md:text-5xl font-semibold text-center max-w-3xl mx-auto">
          How Skyhop finds you the best deal
        </h2>
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-8 hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="w-5 h-5" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const specials = [
  { icon: Plane, title: "Only non-stop or one-stop flights", body: "We only share non-stop or one-stop flights with short layovers." },
  { icon: BadgePercent, title: "Every deal saves at least 40%", body: "We only post deals that are at least 40% cheaper than usual fare. Many go up to 90% off." },
  { icon: Luggage, title: "No compromise on quality", body: "Most deals include check-in luggage. No hidden fees or last-minute surprises." },
];

function Special() {
  return (
    <section className="py-20 md:py-24 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="text-3xl md:text-5xl font-semibold max-w-xl">What makes our deals special?</h2>
          <a href="#deals" className="self-start inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90">
            Browse live deals <ChevronRight className="w-4 h-4" />
          </a>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {specials.map((s) => (
            <div key={s.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-primary/20 text-primary-foreground">
                <s.icon className="w-6 h-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-background/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Rhea", quote: "Skyhop saved me ₹40k on my Bali trip. I literally screenshotted the deal and sent it to my whole group chat." },
  { name: "Vishakh", quote: "I'm a creator and travel often. Skyhop's curated deals beat every search engine I've tried." },
  { name: "Jay", quote: "First-time international flyer — got Europe for less than a domestic trip. Unreal." },
];

function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold">
            Hear it from the<br />
            <span className="text-primary">ones who booked it</span>
          </h2>
          <p className="mt-4 text-muted-foreground">From creators to first-time flyers, they all took off because Skyhop found them a deal too good to miss.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-3xl border border-border bg-card p-7">
              <Sparkles className="w-5 h-5 text-primary" />
              <blockquote className="mt-4 text-lg leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent grid place-items-center font-semibold text-accent-foreground">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">Verified member</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "Are you a travel agency or a booking agent?", a: "No. We're a deal-curation service. We find incredible fares and you book directly with the airline or your favourite OTA." },
  { q: "Does Skyhop plan the entire trip?", a: "We focus on flights only — finding the best roundtrip fares. You're free to plan the rest of your trip however you like." },
  { q: "Which airports does Skyhop operate from?", a: "Currently we curate deals departing from major Indian metros: DEL, BOM, BLR, HYD, MAA, CCU." },
  { q: "Can I get deals for specific dates and destinations?", a: "Our deals are opportunistic — we surface the best fares as they appear. You can filter by region and save destinations to be notified." },
  { q: "How does Skyhop work?", a: "We scan thousands of fares daily, handpick the very best, and send them to members before they expire." },
  { q: "What if the price disappears while I'm booking?", a: "Hot deals can vanish fast. We recommend booking within minutes of receiving the alert — refundable fares are ideal if you're unsure." },
  { q: "Who is Skyhop?", a: "A small team of obsessed travel-deal hunters who believe great trips shouldn't cost a fortune." },
  { q: "What types of deals will I be notified about?", a: "Roundtrip economy, premium economy, and business-class fares that are at least 40% off the usual price." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-28 bg-secondary/40">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-3xl md:text-5xl font-semibold text-center">Frequently asked questions</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between text-left p-5 hover:bg-accent/30 transition">
                <span className="font-medium pr-4">{f.q}</span>
                <ChevronRight className={`w-5 h-5 shrink-0 transition ${open === i ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppCTA() {
  return (
    <section id="app" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-primary via-[oklch(0.5_0.22_280)] to-[oklch(0.4_0.2_250)] text-primary-foreground p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
              Get flight deals<br />on your mobile
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-md">
              Discover your next trip by downloading the Skyhop app on iOS and Android.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#" className="px-5 py-3 rounded-xl bg-black text-white flex items-center gap-3 hover:opacity-90">
                <span className="text-2xl">​</span>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] opacity-80">Download on the</span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </a>
              <a href="#" className="px-5 py-3 rounded-xl bg-black text-white flex items-center gap-3 hover:opacity-90">
                <span className="text-2xl">▶</span>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] opacity-80">Get it on</span>
                  <span className="block text-sm font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
          <div className="relative grid place-items-center">
            <div className="w-56 h-[420px] rounded-[2.5rem] bg-background/10 border border-white/20 backdrop-blur p-3 shadow-2xl">
              <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-white/20 to-white/5 p-5 flex flex-col gap-3">
                <div className="h-10 rounded-xl bg-white/20" />
                <div className="h-32 rounded-2xl bg-white/30" />
                <div className="h-4 rounded bg-white/30 w-3/4" />
                <div className="h-4 rounded bg-white/20 w-1/2" />
                <div className="mt-auto h-12 rounded-2xl bg-white text-primary grid place-items-center font-semibold">
                  Book deal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-border">
      <div className="mx-auto max-w-7xl px-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span className="grid place-items-center w-7 h-7 rounded-lg bg-primary text-primary-foreground">
            <Plane className="w-4 h-4 -rotate-45" />
          </span>
          skyhop
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          © {new Date().getFullYear()} Skyhop. Stop searching. Start saving.
        </div>
      </div>
    </footer>
  );
}
