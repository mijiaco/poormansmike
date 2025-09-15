import { Trade } from "@/lib/types";

async function fetchTrades(): Promise<Trade[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/trades`, { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Trade[];
}

export default async function PositionsPage() {
  const trades: Trade[] = await fetchTrades();
  const formatDate = (d: string | Date | undefined) => {
    if (!d) return "";
    if (typeof d === "string") return d;
    try {
      return d.toISOString().slice(0, 10);
    } catch {
      return String(d);
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Positions</h1>
      <div className="glass rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="muted text-xs uppercase">
              <tr className="text-left">
                <th className="py-2">Ticker</th>
                <th className="py-2">Contracts</th>
                <th className="py-2">LEAP</th>
                <th className="py-2">Short</th>
                <th className="py-2">Monthly Yield</th>
                <th className="py-2">Annual Simple</th>
                <th className="py-2">Annual Compounded</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td className="py-3 muted">No positions yet</td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                </tr>
              ) : (
                trades.map((t: Trade) => (
                  <tr key={t.id} className="border-t border-white/10">
                    <td className="py-3">{t.ticker}</td>
                    <td className="py-3">{t.contracts}</td>
                    <td className="py-3">
                      {formatDate(t.long_call_expiry)} {t.long_call_strike}
                    </td>
                    <td className="py-3">
                      {formatDate(t.short_call_expiry)} {t.short_call_strike}
                    </td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
                    <td className="py-3"></td>
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


