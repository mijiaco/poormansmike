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
      <h1 className="text-2xl font-semibold text-white">Ideas</h1>
      <div className="glass rounded-2xl p-6">
        <p className="text-white">Ideas page is working!</p>
        <p className="muted text-sm mt-2">Found {candidates.length} candidates</p>
        <p className="muted text-sm">No data yet - this is expected.</p>
      </div>
    </div>
  );
}


