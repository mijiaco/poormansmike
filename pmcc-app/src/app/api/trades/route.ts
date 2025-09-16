import { NextResponse } from "next/server";
import { z } from "zod";
import { TradeSchema } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { calculateMonthlyYield, annualizedCompounded, annualizedSimple } from "@/lib/formulas";

export async function GET() {
  try {
    if (!supabase) return NextResponse.json([]);
    const { data, error } = await supabase.from("trades").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const safe = z.array(TradeSchema).safeParse(data);
    if (!safe.success) return NextResponse.json([]);
    return NextResponse.json(safe.data);
  } catch (err) {
    console.error("/api/trades error:", err);
    return NextResponse.json([], { status: 200, headers: { "x-error": String((err as Error).message) } });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trade = TradeSchema.parse(body);

    // Basic derived metrics (for UI preview, canonical values live in DB via jobs)
    const monthly = calculateMonthlyYield({
      longCallPrice: trade.long_call_price,
      shortCallPrice: trade.short_call_price,
    });
    const derived = {
      monthly_yield: monthly,
      annual_simple: annualizedSimple(monthly),
      annual_compound: annualizedCompounded(monthly),
    };

    if (!supabase) return NextResponse.json({ trade, derived }, { status: 201 });

    const { data, error } = await supabase.from("trades").insert(trade).select("*").single();
    if (error) throw error;
    return NextResponse.json({ trade: data, derived }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}


