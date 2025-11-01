"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";

interface FormState {
  identifier: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        let message = "We could not sign you in.";
        try {
          const data = await response.json();
          if (data?.error) {
            message = data.error;
          }
        } catch (parseError) {
          console.warn("Failed to parse login error", parseError);
        }
        setError(message);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (submissionError) {
      console.error("Failed to submit login form", submissionError);
      setError("We could not sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-10 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.95)] backdrop-blur-xl sm:max-w-md sm:p-12">
      <span
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: "linear-gradient(135deg, rgba(114,109,255,0.32), rgba(255,106,213,0.22), rgba(56,189,248,0.2))" }}
      />
      <div className="pointer-events-none absolute -inset-px rounded-[32px] border border-white/20 opacity-40" />

      <div className="relative space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-white/70">Sign in to continue guiding your tasks to done.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="identifier" className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
              Username or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={formState.identifier}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/40 shadow-inner focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-glow/40"
              placeholder="username or name@company.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/40 shadow-inner focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-fuchsia-glow/45"
              placeholder="Your secret phrase"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full border border-transparent bg-gradient-to-r from-indigo-glow/80 via-fuchsia-glow/70 to-sky-400/80 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-30px_rgba(114,109,255,0.9)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-white/65">
          Need a new account?{" "}
          <Link href="/signup" className="font-semibold text-sky-200 underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
