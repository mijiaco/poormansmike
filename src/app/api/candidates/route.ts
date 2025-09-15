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
      // Fallback empty response without Supabase configured
      return NextResponse.json([], { status: 200 });
    }

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("score", { ascending: false })
      .limit(parsed.limit);

    if (error) throw error;
    const safe = z.array(CandidateSchema).safeParse(data);
    if (!safe.success) return NextResponse.json([], { status: 200 });
    return NextResponse.json(safe.data);
  } catch (err) {
    console.error("/api/candidates error:", err);
    // Fail-soft: treat as no data so UI still renders
    return NextResponse.json([], { status: 200, headers: { "x-error": String((err as Error).message) } });
  }
}


