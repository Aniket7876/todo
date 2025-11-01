"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (!response.ok && response.status !== 204) {
          throw new Error("Failed to log out");
        }
      } catch (err) {
        console.error("Failed to log out", err);
        setError("We could not log you out. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    };

    performLogout();
  }, [router]);

  return (
    <main className="relative box-border flex min-h-[calc(100vh-6rem)] items-center justify-center overflow-hidden px-4 py-20">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] translate-x-1/4 rounded-full bg-sky-400/25 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-[150px]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-10 text-center text-white shadow-[0_30px_60px_-35px_rgba(15,23,42,0.95)] backdrop-blur-xl">
        <span
          className="pointer-events-none absolute inset-0 opacity-65"
          style={{ background: "linear-gradient(135deg, rgba(114,109,255,0.32), rgba(255,106,213,0.24), rgba(56,189,248,0.2))" }}
        />
        <div className="pointer-events-none absolute -inset-px rounded-[32px] border border-white/20 opacity-40" />

        <div className="relative space-y-4">
          <h1 className="text-2xl font-semibold">Signing you out</h1>
          <p className="text-sm text-white/70">We are safely closing your session.</p>
          {error && (
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
