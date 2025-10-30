import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TODO Board",
  description: "A beautiful task management app with Kanban board and glass morphism design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} relative min-h-screen bg-slate-950 text-white`}>
          <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur md:px-12">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-widest text-white/80 uppercase">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
              Aurora Tasks
            </div>
            <nav className="flex items-center gap-3">
              <SignedOut>
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
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </nav>
          </header>
          <div className="pt-24">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
