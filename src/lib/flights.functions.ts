import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SearchSchema = z.object({
  origin: z.string().min(2).max(10),
  destination: z.string().min(2).max(10),
  departDate: z.string().min(4).max(20),
  returnDate: z.string().min(0).max(20).optional().default(""),
  adults: z.number().int().min(1).max(9).default(1),
  cabin: z.enum(["economy", "premium-economy", "business", "first"]).default("economy"),
});

export type FlightOffer = {
  airline: string;
  price: string;
  stops: string;
  duration: string;
  departure: string;
  arrival: string;
  isBest?: boolean;
};

export type SearchResult = {
  ok: boolean;
  offers: FlightOffer[];
  error?: string;
};

export const searchFlights = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SearchSchema.parse(data))
  .handler(async ({ data }): Promise<SearchResult> => {
    const base = process.env.FAST_FLIGHTS_URL;
    if (!base) {
      // No backend configured yet — return a friendly empty state.
      return {
        ok: false,
        offers: [],
        error: "Backend not configured. Set FAST_FLIGHTS_URL to your fast-flights endpoint.",
      };
    }
    try {
      const url = new URL(base);
      url.searchParams.set("from_airport", data.origin);
      url.searchParams.set("to_airport", data.destination);
      url.searchParams.set("departure_date", data.departDate);
      if (data.returnDate) url.searchParams.set("return_date", data.returnDate);
      url.searchParams.set("adults", String(data.adults));
      url.searchParams.set("seat", data.cabin);

      const res = await fetch(url.toString(), {
        headers: { accept: "application/json" },
      });
      if (!res.ok) {
        return { ok: false, offers: [], error: `Upstream ${res.status}` };
      }
      const json = (await res.json()) as { flights?: FlightOffer[] };
      return { ok: true, offers: json.flights ?? [] };
    } catch (e) {
      return { ok: false, offers: [], error: e instanceof Error ? e.message : "Request failed" };
    }
  });
