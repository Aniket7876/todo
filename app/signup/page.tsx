import SignUpForm from '@/components/auth/SignUpForm';
import { getUserFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { ArrowRightCircle, PenSquare, Sparkles } from 'lucide-react';

export default async function SignUpPage() {
  const user = await getUserFromCookies();
  if (user) {
    redirect('/');
  }

  const highlights: Array<{ icon: LucideIcon; text: string }> = [
    {
      icon: Sparkles,
      text: 'Glass-morphism UI that keeps tasks vivid and focused.',
    },
    {
      icon: PenSquare,
      text: 'Rich task cards with priorities, due dates, and notes.',
    },
    {
      icon: ArrowRightCircle,
      text: 'Drag-and-drop journeys from idea to done in seconds.',
    },
  ];

  return (
    <main className="relative isolate flex min-h-[calc(100vh-6rem)] items-center overflow-hidden px-6 py-16 sm:px-10 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-16 h-96 w-96 rounded-full bg-indigo-glow/35 blur-[150px]" />
        <div className="absolute right-[-14%] top-12 h-[440px] w-[440px] rounded-full bg-fuchsia-glow/30 blur-[180px]" />
        <div className="absolute bottom-[-22%] left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-sky-400/20 blur-[200px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,420px)] lg:items-center">
        <section className="space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
            Create account
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            Shape your personal Aurora workspace
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 md:text-lg lg:mx-0">
            Spin up a dedicated board, capture every idea, and watch momentum build as tasks glide across stunning glass columns.
          </p>
          <ul className="mx-auto flex max-w-xl flex-col gap-3 text-sm text-white/65 sm:text-base lg:mx-0">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-fuchsia-200 shadow-inner">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex justify-center lg:justify-end">
          <SignUpForm />
        </div>
      </div>
    </main>
  );
}
