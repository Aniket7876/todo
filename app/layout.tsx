import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { getUserFromCookies } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TODO Board",
  description: "A beautiful task management app with Kanban board and glass morphism design",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookies();

  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen bg-slate-950 text-white`}>
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur md:px-12">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-widest text-white/80 uppercase">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
            Aurora Tasks
          </div>
          <nav className="flex items-center gap-4 text-xs font-medium text-white/70">
            {user ? (
              <>
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/80 backdrop-blur md:inline-flex">
                  {user.username}
                </span>
                <Link
                  href="/logout"
                  className="rounded-full border border-white/15 px-4 py-1.5 text-white/80 transition-colors duration-200 hover:border-white/35 hover:text-white"
                >
                  Log out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/15 px-4 py-1.5 text-white/80 transition-colors duration-200 hover:border-white/35 hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-transparent bg-white/15 px-4 py-1.5 text-white transition-colors duration-200 hover:bg-white/25"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </header>
        <div className="pt-24">{children}</div>
      </body>
    </html>
  );
}
