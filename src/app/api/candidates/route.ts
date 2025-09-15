import { NextResponse } from "next/server";
import { z } from "zod";
import { CandidateSchema } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(2000).default(50),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.parse({ limit: searchParams.get("limit") ?? undefined });

    if (!supabase) {
      console.log("Supabase not configured, returning empty array");
      return NextResponse.json([], { status: 200 });
    }

    console.log("Fetching candidates from Supabase...");
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("score", { ascending: false })
      .limit(parsed.limit);

    if (error) {
      console.error("Supabase error:", error);
      // If table doesn't exist, return empty array
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log("Candidates table doesn't exist yet, returning empty array");
        return NextResponse.json([], { status: 200 });
      }
      throw error;
    }

    console.log(`Found ${data?.length || 0} candidates`);
    const safe = z.array(CandidateSchema).safeParse(data);
    if (!safe.success) {
      console.log("Data validation failed, returning empty array");
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(safe.data);
  } catch (err) {
    console.error("/api/candidates error:", err);
    // Fail-soft: treat as no data so UI still renders
    return NextResponse.json([], { status: 200, headers: { "x-error": String((err as Error).message) } });
  }
}


