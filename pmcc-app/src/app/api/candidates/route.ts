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

    console.log("API called with limit:", parsed.limit);
    console.log("Supabase configured:", !!supabase);
    console.log("Environment check:", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "..."
    });

    if (!supabase) {
      console.log("Supabase not configured, returning empty array");
      return NextResponse.json({ 
        error: "Supabase not configured", 
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }, { status: 200 });
    }

    console.log("Fetching candidates from Supabase...");
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("score", { ascending: false })
      .limit(parsed.limit);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    console.log(`Found ${data?.length || 0} candidates`);
    const safe = z.array(CandidateSchema).safeParse(data);
    if (!safe.success) {
      console.log("Data validation failed:", safe.error);
      return NextResponse.json({ error: "Data validation failed", details: safe.error }, { status: 500 });
    }
    return NextResponse.json(safe.data);
  } catch (err) {
    console.error("/api/candidates error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}


