"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function SignedOutHero() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-glow/35 via-fuchsia-glow/30 to-sky-400/20 blur-3xl opacity-70" />
        <div className="absolute right-[-6%] top-[22%] h-72 w-72 rounded-full bg-gradient-to-tr from-fuchsia-glow/35 via-indigo-glow/25 to-white/10 blur-[140px] opacity-60" />
      </div>

      <div className="relative w-full max-w-xl space-y-6 rounded-[30px] border border-white/10 bg-white/5 p-10 text-white shadow-[0_32px_70px_-45px_rgba(15,23,42,1)] backdrop-blur-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-white/70">
          <Sparkles className="h-4 w-4" />
          Welcome
        </span>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold md:text-4xl">Sign in to unlock your workspace</h1>
          <p className="text-sm text-white/70 md:text-base">
            Create an account or sign in to manage tasks, drag cards between columns, and keep track of your progress with your personal Kanban board.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <SignInButton mode="modal">
            <button className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/20">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded-full border border-indigo-400/60 bg-indigo-500/80 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(99,102,241,0.85)] transition hover:border-indigo-200 hover:bg-indigo-400">
              Sign up
            </button>
          </SignUpButton>
        </div>
      </div>
    </main>
  );
}
