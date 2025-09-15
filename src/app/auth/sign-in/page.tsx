"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    location.href = "/";
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-white text-xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm muted mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder:muted" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm muted mb-1">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
            {loading ? "…" : "Sign in"}
          </button>
        </form>
        <p className="muted text-sm mt-3">
          No account? <Link className="underline" href="/auth/sign-up">Sign up</Link>
        </p>
      </div>
    </div>
  );
}


