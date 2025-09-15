import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fetchQuote, fetchOptionChain } from "@/lib/market";
import { calculateMonthlyYield, annualizedSimple, annualizedCompounded } from "@/lib/formulas";

// S&P 500 top tickers for PMCC scanning
const SP500_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK-B", "UNH", "JNJ",
  "V", "PG", "JPM", "HD", "MA", "DIS", "PYPL", "ADBE", "NFLX", "CRM",
  "INTC", "CMCSA", "PFE", "TMO", "ABT", "COST", "PEP", "CSCO", "ACN", "AVGO",
  "TXN", "QCOM", "DHR", "VZ", "NKE", "MRK", "WMT", "UNP", "PM", "HON",
  "IBM", "AMD", "SPGI", "LOW", "AMT", "T", "SBUX", "GILD", "CVX", "MDT"
];

const PMCC_FILTERS = {
  minLongCallDelta: 0.75,
  maxShortCallDelta: 0.30,
  minLongCallDaysToExpiry: 365, // 1 year
  maxShortCallDaysToExpiry: 45,  // ~1 month
  maxLongCallPrice: 50, // user configurable later
  minMonthlyYield: 0.05, // 5% minimum
};

function getExpiryDates() {
  const now = new Date();
  const longExpiry = new Date(now);
  longExpiry.setFullYear(longExpiry.getFullYear() + 1);
  
  const shortExpiry = new Date(now);
  shortExpiry.setDate(shortExpiry.getDate() + 30);
  
  return {
    long: longExpiry.toISOString().split('T')[0],
    short: shortExpiry.toISOString().split('T')[0]
  };
}

async function findPMCCOpportunity(ticker: string) {
  try {
    // Get current stock price
    const quote = await fetchQuote(ticker) as any;
    const underlyingPrice = quote?.price?.regularMarketPrice?.raw || quote?.price?.regularMarketPrice;
    if (!underlyingPrice || underlyingPrice < 50) return null;

    const { long, short } = getExpiryDates();
    
    // Get option chains for both expiries
    const [longChain, shortChain] = await Promise.all([
      fetchOptionChain(ticker, long),
      fetchOptionChain(ticker, short)
    ]);

    const longCalls = (longChain as any)?.optionChain?.result?.[0]?.options?.[0]?.calls || [];
    const shortCalls = (shortChain as any)?.optionChain?.result?.[0]?.options?.[0]?.calls || [];

    // Find best LEAP (long call with delta >= 0.75)
    const leap = longCalls
      .filter(call => call.delta >= PMCC_FILTERS.minLongCallDelta)
      .sort((a, b) => a.strike - b.strike)[0];
    
    if (!leap) return null;

    // Find best short call (delta <= 0.30, strike > LEAP strike)
    const shortCall = shortCalls
      .filter(call => 
        call.delta <= PMCC_FILTERS.maxShortCallDelta && 
        call.strike > leap.strike &&
        call.bid > 0
      )
      .sort((a, b) => b.bid - a.bid)[0];
    
    if (!shortCall) return null;

    // Calculate metrics
    const monthlyYield = calculateMonthlyYield({
      longCallPrice: leap.ask || leap.lastPrice,
      shortCallPrice: shortCall.bid
    });

    if (monthlyYield < PMCC_FILTERS.minMonthlyYield) return null;

    return {
      ticker,
      underlying_price: underlyingPrice,
      long_call_expiry: long,
      long_call_strike: leap.strike,
      long_call_price: leap.ask || leap.lastPrice,
      short_call_expiry: short,
      short_call_strike: shortCall.strike,
      short_call_price: shortCall.bid,
      monthly_yield: monthlyYield,
      annual_simple: annualizedSimple(monthlyYield),
      annual_compound: annualizedCompounded(monthlyYield),
      score: monthlyYield,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error processing ${ticker}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    console.log("Starting PMCC candidates refresh...");
    
    // Process tickers in batches to avoid rate limits
    const batchSize = 5;
    const candidates = [];
    
    for (let i = 0; i < SP500_TICKERS.length; i += batchSize) {
      const batch = SP500_TICKERS.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(SP500_TICKERS.length/batchSize)}`);
      
      const batchResults = await Promise.all(
        batch.map(ticker => findPMCCOpportunity(ticker))
      );
      
      candidates.push(...batchResults.filter(Boolean));
      
      // Rate limiting delay
      if (i + batchSize < SP500_TICKERS.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Clear old candidates and insert new ones
    await supabase.from('candidates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (candidates.length > 0) {
      const { error } = await supabase.from('candidates').insert(candidates);
      if (error) throw error;
    }

    console.log(`Refreshed ${candidates.length} PMCC candidates`);
    
    return NextResponse.json({ 
      success: true, 
      candidates: candidates.length,
      message: `Found ${candidates.length} PMCC opportunities`
    });
    
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json({ 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
