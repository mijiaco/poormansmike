"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const session = await supabase?.auth.getUser();
      if (!mounted) return;
      setEmail(session?.data.user?.email ?? null);
    }
    load();

    const { data: sub } =
      (supabase?.auth.onAuthStateChange(() => load()) as { data: { subscription: { unsubscribe(): void } } }) ??
      { data: { subscription: { unsubscribe() {} } } };
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  async function signOut() {
    if (!supabase) return;
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    location.reload();
  }

  if (!supabase) {
    return <Link href="/auth/sign-in" className="muted hover:text-white text-sm">Sign in</Link>;
  }

  if (!email) {
    return <Link href="/auth/sign-in" className="muted hover:text-white text-sm">Sign in</Link>;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="muted text-sm">{email}</span>
      <button onClick={signOut} disabled={loading} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm">
        {loading ? "…" : "Sign out"}
      </button>
    </div>
  );
}


