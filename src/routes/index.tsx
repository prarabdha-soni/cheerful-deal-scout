import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
        content: "Handpicked roundtrip flight deals — up to 90% off.",
      },
    ],
  }),
  component: Landing,
});

/* ------------------------------ Data ------------------------------ */

type Deal = {
  destination: string;
  airline: string;
  airlineLogo: string;
  image: string;
  original: string;
  price: string;
  off: string;
  quote: string;
  member: string;
  avatar: string;
  tint: string; // card background
  quoteColor: string; // quote text color
};

const deals: Deal[] = [
  {
    destination: "Hong Kong",
    airline: "Vistara",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Vistara-Logo.svg/512px-Vistara-Logo.svg.png",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1400&auto=format&fit=crop",
    original: "₹35,000",
    price: "₹15,850",
    off: "55% off",
    quote:
      "Got a non-stop flight to Hong Kong for 16k. I wasn't even actively searching — just saw the deal pop up and booked it. Way too good to pass.",
    member: "Geetansh Pamnani",
    avatar: "https://i.pravatar.cc/80?img=12",
    tint: "#EFE9FF",
    quoteColor: "#6D4AFF",
  },
  {
    destination: "Tokyo, Japan",
    airline: "ANA",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/All_Nippon_Airways_Logo.svg/512px-All_Nippon_Airways_Logo.svg.png",
    image:
      "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1400&auto=format&fit=crop",
    original: "₹75,000",
    price: "₹36,500",
    off: "51% off",
    quote:
      "Just booked a non-stop Japan trip for me and my partner for ₹36,000. Such a great deal! Still can't believe we got Japan for that price!",
    member: "Shivangi Virmani",
    avatar: "https://i.pravatar.cc/80?img=47",
    tint: "#FFF4D6",
    quoteColor: "#B8861B",
  },
  {
    destination: "Berlin, Germany",
    airline: "Oman Air",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Oman_Air_logo.svg/512px-Oman_Air_logo.svg.png",
    image:
      "https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=1400&auto=format&fit=crop",
    original: "₹72,000",
    price: "₹21,300",
    off: "70% off",
    quote:
      "Went to Berlin for 21,000 round-trip, found the deal and took the whole family. Glad it all worked out!",
    member: "Akshay",
    avatar: "https://i.pravatar.cc/80?img=15",
    tint: "#DCEBFF",
    quoteColor: "#1F6FD9",
  },
  {
    destination: "Phnom Penh, Cambodia",
    airline: "Cambodia Angkor Air",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Cambodia_Angkor_Air_logo.svg/512px-Cambodia_Angkor_Air_logo.svg.png",
    image:
      "https://images.unsplash.com/photo-1563449716-f6f78d6e9d7c?w=1400&auto=format&fit=crop",
    original: "₹36,000",
    price: "₹17,200",
    off: "52% off",
    quote:
      "Saw a non-stop Cambodia deal for ₹17,000 and booked it on impulse. Turned out to be one of my favourite trips.",
    member: "Nivedita Matta",
    avatar: "https://i.pravatar.cc/80?img=32",
    tint: "#FFE3D6",
    quoteColor: "#D9531F",
  },
  {
    destination: "Toronto, Canada",
    airline: "British Airways",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/British_Airways_Logo.svg/512px-British_Airways_Logo.svg.png",
    image:
      "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1400&auto=format&fit=crop",
    original: "₹1,35,000",
    price: "₹69,700",
    off: "48% off",
    quote:
      "Got a round-trip to Toronto for ₹70,000 on British Airways. I've booked this route before for a lot more — a pleasant surprise.",
    member: "Sonia Sharma",
    avatar: "https://i.pravatar.cc/80?img=45",
    tint: "#FFE6EF",
    quoteColor: "#D63384",
  },
  {
    destination: "Athens, Greece",
    airline: "Kuwait Airways",
    airlineLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kuwait_Airways_Logo.svg/512px-Kuwait_Airways_Logo.svg.png",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1400&auto=format&fit=crop",
    original: "₹65,000",
    price: "₹24,000",
    off: "63% off",
    quote:
      "Thanks to this unforgettable Greece trip: explored Athens, adored Santorini sunsets, and delved into Crete's rich stories.",
    member: "Vanshika",
    avatar: "https://i.pravatar.cc/80?img=49",
    tint: "#E0F4E6",
    quoteColor: "#1F8A4C",
  },
];

/* ------------------------------ Page ------------------------------ */

function Landing() {
  return (
    <div className="min-h-screen bg-[#F6F5FB] text-[#0B1020] font-sans antialiased">
      <Nav />
      <Hero />
      <Archive />
      <div className="h-24" />
    </div>
  );
}

/* ------------------------------ Nav ------------------------------- */

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
          <a href="#" className="hidden sm:inline text-sm text-[#0B1020]/80 hover:text-[#0B1020]">
            Get the app
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0B1020] text-white text-sm font-medium hover:bg-black transition"
          >
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Hero() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 md:px-10 pt-16 md:pt-24 pb-20">
      <h1 className="font-bold tracking-[-0.03em] leading-[1.02] text-[44px] sm:text-[64px] md:text-[88px] max-w-[12ch]">
        Handpicked roundtrip deals that save you a fortune
      </h1>
      <div className="mt-12">
        <a
          href="#deals"
          className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-[#7C5BFF] text-white text-[15px] font-medium hover:bg-[#6A47FF] transition shadow-[0_8px_24px_-8px_rgba(124,91,255,0.6)]"
        >
          View deals
        </a>
      </div>
    </section>
  );
}

/* ----------------------------- Archive ---------------------------- */

function Archive() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="deals" className="relative">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <h2 className="text-center font-semibold tracking-tight text-[28px] md:text-[36px]">
          Past deals our members claimed
        </h2>
      </div>

      <div className="relative mt-10">
        <div
          ref={scroller}
          className="flex gap-6 overflow-x-auto px-6 md:px-10 pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar"
        >
          <div className="shrink-0 w-[calc((100vw-1280px)/2)] max-[1320px]:hidden" />
          {deals.map((d, i) => (
            <DealCard key={i} deal={d} />
          ))}
          <div className="shrink-0 w-[calc((100vw-1280px)/2)] max-[1320px]:hidden" />
        </div>

        <div className="mx-auto max-w-[1280px] px-6 md:px-10 mt-2 flex items-center justify-end gap-3">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Previous"
            className="w-11 h-11 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-[#0B1020] hover:text-white transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Next"
            className="w-11 h-11 rounded-full bg-[#0B1020] text-white flex items-center justify-center hover:bg-black transition shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Card ------------------------------ */

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article
      data-card
      className="snap-start shrink-0 w-[320px] sm:w-[360px] rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: deal.tint }}
    >
      {/* Image with airline logo + economy badge */}
      <div className="relative">
        <img
          src={deal.image}
          alt={deal.destination}
          loading="lazy"
          className="w-full h-[230px] object-cover"
        />
        <div className="absolute top-3 left-3 w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center p-1.5">
          <img
            src={deal.airlineLogo}
            alt={deal.airline}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-black/70 text-white text-[11px] font-medium">
          Economy
        </div>
      </div>

      {/* Pricing block on tinted card */}
      <div className="px-5 pt-4 pb-4 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-black/50 font-medium">
              Round Trip
            </div>
            <div className="mt-1 text-[20px] font-semibold tracking-tight">
              {deal.destination}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-semibold text-emerald-600">
              {deal.off}
            </div>
            <div className="mt-1 flex items-baseline gap-2 justify-end">
              <span className="text-[12px] line-through text-black/40">
                {deal.original}
              </span>
              <span className="text-[18px] font-bold">{deal.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="px-5 py-5 flex-1 flex flex-col justify-between">
        <p
          className="text-[14px] leading-relaxed"
          style={{ color: deal.quoteColor }}
        >
          {deal.quote}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <img
            src={deal.avatar}
            alt={deal.member}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span
            className="text-[14px] font-medium"
            style={{ color: deal.quoteColor }}
          >
            {deal.member}
          </span>
        </div>
      </div>
    </article>
  );
}
