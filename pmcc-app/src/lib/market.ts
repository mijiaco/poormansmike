import { env } from "./env";
import { withRetry } from "./retry";

const RAPIDAPI_HOST = "yh-finance.p.rapidapi.com";

async function request<T>(path: string): Promise<T> {
  if (!env.RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY is not set");
  }
  const url = `https://${RAPIDAPI_HOST}${path}`;
  const headers = {
    "x-rapidapi-key": env.RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST,
  } as Record<string, string>;
  return withRetry(async () => {
    const res = await fetch(url, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  });
}

export async function fetchOptionChain(ticker: string, expiry?: number): Promise<unknown> {
  const q = expiry ? `?symbol=${ticker}&expiration=${expiry}` : `?symbol=${ticker}`;
  return request<unknown>(`/options${q}`);
}

export async function fetchQuote(ticker: string): Promise<unknown> {
  return request<unknown>(`/stock/v2/get-summary?symbol=${ticker}`);
}


