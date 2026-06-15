import { createServerFn } from "@tanstack/react-start";

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

export type DealsResult =
  | { ok: true; data: DealsPayload }
  | { ok: false; error: string };

export const fetchDeals = createServerFn({ method: "GET" }).handler(
  async (): Promise<DealsResult> => {
    const url =
      process.env.DEALS_URL ||
      "https://raw.githubusercontent.com/lovable-dev/sample-data/main/deals.json";
    try {
      const bust = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
      const res = await fetch(bust, {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) return { ok: false, error: `Upstream ${res.status}` };
      const json = (await res.json()) as DealsPayload;
      return { ok: true, data: json };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Request failed" };
    }
  },
);
