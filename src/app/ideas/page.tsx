import { Candidate } from "@/lib/types";
import { IdeasView } from "./IdeasView";

async function fetchCandidates(): Promise<Candidate[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/candidates`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        console.error("Failed to fetch candidates:", res.status, res.statusText);
        return [];
    };
    return await res.json();
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

export default async function IdeasPage() {
  const initialCandidates = await fetchCandidates();
  return <IdeasView initialCandidates={initialCandidates} />;
}


