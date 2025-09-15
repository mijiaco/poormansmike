import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="glass rounded-2xl p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
            <p className="muted text-sm mt-1">Poor Man’s Covered Call opportunities and your tracked positions.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/positions" className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
              Add Position
            </Link>
            <Link href="/ideas" className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
              Refresh Ideas
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-medium">Positions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="muted text-xs uppercase">
                <tr className="text-left">
                  <th className="py-2">Ticker</th>
                  <th className="py-2">LEAP</th>
                  <th className="py-2">Short Call</th>
                  <th className="py-2">Monthly Yield</th>
                  <th className="py-2">Annualized</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <td className="py-3 muted">No positions yet</td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-medium">Ideas</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="muted text-xs uppercase">
                <tr className="text-left">
                  <th className="py-2">Ticker</th>
                  <th className="py-2">LEAP $</th>
                  <th className="py-2">Short $</th>
                  <th className="py-2">Monthly Yield</th>
                  <th className="py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <td className="py-3 muted">No data yet</td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                  <td className="py-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
