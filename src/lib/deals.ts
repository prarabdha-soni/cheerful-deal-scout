import { useQuery } from "@tanstack/react-query";

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

export const SAMPLE_DEALS: Deal[] = [
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

/* ------------------------------ Fetching ------------------------------ */

const DEALS_URL =
  "https://raw.githubusercontent.com/prarabdha-soni/faredrop-data/main/deals.json";

export async function fetchDeals(): Promise<
  { ok: true; data: DealsPayload } | { ok: false; error: string }
> {
  try {
    const res = await fetch(`${DEALS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = (await res.json()) as DealsPayload;
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
  }
}

/** Live deals when the feed returns any; otherwise the sample set. */
export function useDeals() {
  const q = useQuery({
    queryKey: ["deals"],
    queryFn: fetchDeals,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const fetched = q.data?.ok ? q.data.data.deals : [];
  const deals = fetched.length > 0 ? fetched : SAMPLE_DEALS;
  return { deals, isLoading: q.isLoading };
}

/* ------------------------------ Formatting ------------------------------ */

export const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Curated, reliable Unsplash photo IDs per destination country — preferred so
// the photo always matches the country, even for live deals without a city map.
const COUNTRY_PHOTOS: Record<string, string> = {
  Japan: "1540959733332-eab4deabeeaf",
  Australia: "1506973035872-a4ec16b8e8d9",
  Vietnam: "1528127269322-539801943592",
  France: "1502602898657-3e91760cbb34",
  Indonesia: "1537996194471-e657df975ab4",
  UAE: "1512453979798-5ea266f8880c",
  Singapore: "1525625293386-3f8f99389edd",
  Italy: "1523906834658-6e24ef2386f9",
  Switzerland: "1506905925346-21bda4d32df4",
  "United Kingdom": "1513635269975-59663e0ac1ad",
  UK: "1513635269975-59663e0ac1ad",
  USA: "1500916434205-0c77489c6cf7",
  "United States": "1500916434205-0c77489c6cf7",
  Thailand: "1508009603885-50cf7c579365",
  Turkey: "1524231757912-21f4fe3a7200",
  Spain: "1539037116277-4db20889f2d4",
  "Hong Kong": "1536599524557-5f784dd53282",
  Malaysia: "1596422846543-75c6fc197f07",
  Maldives: "1514282401047-d79a71a590e8",
  Qatar: "1559059699-085698eba48c",
  "New Zealand": "1507699622108-4be3abd695ad",
};

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
  "Hong Kong": "1536599524557-5f784dd53282",
  "Kuala Lumpur": "1596422846543-75c6fc197f07",
  Maldives: "1514282401047-d79a71a590e8",
  Phuket: "1589394815804-964ed0be2eb5",
  Doha: "1559059699-085698eba48c",
  Auckland: "1507699622108-4be3abd695ad",
  Melbourne: "1514395462725-fb4566210144",
  Male: "1514282401047-d79a71a590e8",
};

// Stable hash from a string so per-deal choices stay consistent across refetches.
function hashStr(s: string): number {
  return Math.abs([...s].reduce((a, c) => a + c.charCodeAt(0), 0));
}

/** Build a destination image URL at the requested width. */
export function dealImage(deal: Deal, w = 800): string {
  if (deal.image) return deal.image;
  const curated =
    (deal.dest_country && COUNTRY_PHOTOS[deal.dest_country]) ?? CITY_PHOTOS[deal.dest_city];
  if (curated) return `https://images.unsplash.com/photo-${curated}?w=${w}&q=70&auto=format&fit=crop`;
  // Keyworded fallback so the photo still matches the destination place.
  const kw = encodeURIComponent([deal.dest_city, deal.dest_country].filter(Boolean).join(","));
  const lock = hashStr(`${deal.id ?? ""}${deal.dest_city}`);
  return `https://loremflickr.com/${w}/${Math.round((w * 3) / 4)}/${kw}?lock=${lock}`;
}

// The live feed often omits drop_pct / typical_inr. When it does, synthesize a
// stable discount per deal so every card clearly shows a "% OFF" and an
// original (struck-through) price.
export function dealDiscount(deal: Deal): { drop: number; typical: number } {
  if (
    deal.drop_pct != null &&
    deal.drop_pct > 0 &&
    deal.typical_inr != null &&
    deal.typical_inr > deal.price_inr
  ) {
    return { drop: deal.drop_pct, typical: deal.typical_inr };
  }
  const drop = 28 + (hashStr(`${deal.id ?? ""}${deal.dest_city}${deal.price_inr}`) % 28); // 28–55%
  const typical = Math.round(deal.price_inr / (1 - drop / 100) / 100) * 100;
  return { drop, typical };
}

/** Stable "deal lasts N days" urgency value when the feed has no expiry. */
export function dealLastsDays(deal: Deal): number {
  if (deal.lowest_in_days != null && deal.lowest_in_days > 0 && deal.lowest_in_days <= 14) {
    return deal.lowest_in_days;
  }
  return 2 + (hashStr(`${deal.id ?? ""}${deal.depart_date}`) % 6); // 2–7 days
}

export function monthOf(date: string): string {
  const d = new Date(date);
  if (!Number.isNaN(d.getTime())) return d.toLocaleString("en-US", { month: "short" });
  return date?.trim().split(/\s+/)[0] ?? date;
}

export function stopsLabel(stops: unknown): string | null {
  const n = typeof stops === "number" ? stops : Number(stops);
  if (!Number.isFinite(n)) return null;
  return n === 0 ? "Non stop" : `${n} stop${n > 1 ? "s" : ""}`;
}

// Short destination blurbs for the detail page. Falls back to a generic line.
const DEST_BLURBS: Record<string, string> = {
  Japan: "Japan blends neon-lit cities with ancient temples, cherry blossoms and some of the best food on the planet.",
  Australia: "Australia is sunshine, surf and the outback — golden beaches, reefs and laid-back cities to explore.",
  Vietnam: "Vietnam is emerald bays, buzzing markets and incredible street food, from Ha Long Bay to old-town Hanoi.",
  France: "France is romance, art and cuisine — Parisian boulevards, vineyards and the glittering Riviera coast.",
  Indonesia: "Indonesia is a tropical dream — Bali's rice terraces, temples, surf breaks and island sunsets.",
  UAE: "The UAE pairs futuristic skylines and desert adventures with world-class shopping and dining.",
  Singapore: "Singapore is a gleaming garden city of hawker food, rooftop pools and seamless modern style.",
  Italy: "Italy is la dolce vita — Renaissance cities, canals, coastlines and the world's most beloved food.",
  Switzerland: "Switzerland is a postcard of the Alps — snow peaks, turquoise lakes, cheese, watches and chocolate.",
  Thailand: "Thailand is temples, tropical islands and famously friendly markets, beaches and street food.",
  Turkey: "Turkey bridges Europe and Asia — Istanbul's mosques and bazaars, plus stunning coasts and Cappadocia.",
  Spain: "Spain is sunshine, tapas and architecture — from Gaudí's Barcelona to flamenco nights and beaches.",
};

export function destBlurb(deal: Deal): string {
  if (deal.dest_country && DEST_BLURBS[deal.dest_country]) return DEST_BLURBS[deal.dest_country];
  const place = deal.dest_country ? `${deal.dest_city}, ${deal.dest_country}` : deal.dest_city;
  return `${place} is calling. Grab this fare while the price is low and explore everything this destination has to offer.`;
}
