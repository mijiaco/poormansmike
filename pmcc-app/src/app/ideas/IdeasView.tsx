"use client";

import { Candidate } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function IdeasView({
  initialCandidates,
}: {
  initialCandidates: Candidate[];
}) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLoading = isFetching || isPending;

  const handleRefresh = async () => {
    setIsFetching(true);
    try {
      await fetch("/api/cron/refresh-candidates");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Failed to refresh candidates:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Ideas</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "🔄"
            )}
            {isLoading ? "Refreshing..." : "Refresh Live Data"}
          </button>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="muted text-xs uppercase">
              <tr className="text-left">
                <th className="py-2">Ticker</th>
                <th className="py-2">Underlying</th>
                <th className="py-2">LEAP</th>
                <th className="py-2">Short</th>
                <th className="py-2">Monthly Yield</th>
                <th className="py-2">Annual Simple</th>
                <th className="py-2">Annual Compounded</th>
                <th className="py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {initialCandidates.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td colSpan={8} className="py-3 text-center muted">
                    {isPending ? "Loading new data..." : "No data yet. Click Refresh to scan for opportunities."}
                  </td>
                </tr>
              ) : (
                initialCandidates.map((c: Candidate, index: number) => (
                  <tr key={c.id || index} className="border-t border-white/10">
                    <td className="py-3">{c.ticker || "N/A"}</td>
                    <td className="py-3">{c.underlying_price || ""}</td>
                    <td className="py-3">{c.long_call_price || ""}</td>
                    <td className="py-3">{c.short_call_price || ""}</td>
                    <td className="py-3">
                      {c.monthly_yield
                        ? (c.monthly_yield * 100).toFixed(2) + "%"
                        : ""}
                    </td>
                    <td className="py-3">
                      {c.annual_simple
                        ? (c.annual_simple * 100).toFixed(2) + "%"
                        : ""}
                    </td>
                    <td className="py-3">
                      {c.annual_compound
                        ? (c.annual_compound * 100).toFixed(2) + "%"
                        : ""}
                    </td>
                    <td className="py-3">{c.score || ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

