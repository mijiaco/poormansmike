async function fetchCandidates() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/candidates`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

export default async function IdeasPage() {
  const candidates = await fetchCandidates();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Ideas</h1>
        <div className="flex gap-3">
          <a 
            href="/api/cron/refresh-candidates" 
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm"
            target="_blank"
          >
            Refresh Ideas
          </a>
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
              {candidates.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td className="py-3 muted">No data yet</td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                </tr>
              ) : (
                candidates.map((c: any, index: number) => (
                  <tr key={c.id || index} className="border-t border-white/10">
                    <td className="py-3">{c.ticker || 'N/A'}</td>
                    <td className="py-3">{c.underlying_price || ''}</td>
                    <td className="py-3">{c.long_call_price || ''}</td>
                    <td className="py-3">{c.short_call_price || ''}</td>
                    <td className="py-3">{c.monthly_yield ? (c.monthly_yield * 100).toFixed(2) + '%' : ''}</td>
                    <td className="py-3">{c.annual_simple ? (c.annual_simple * 100).toFixed(2) + '%' : ''}</td>
                    <td className="py-3">{c.annual_compound ? (c.annual_compound * 100).toFixed(2) + '%' : ''}</td>
                    <td className="py-3">{c.score || ''}</td>
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


