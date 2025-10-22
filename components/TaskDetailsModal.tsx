'use client';

import { Task } from '@/types/task';
import { Calendar, Clock, Tag, X } from 'lucide-react';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function TaskDetailsModal({ isOpen, onClose, task }: TaskDetailsModalProps) {
  if (!isOpen || !task) return null;

  const priorityStyles: Record<Task['priority'], string> = {
    low: 'border border-cyan-300/40 bg-cyan-500/10 text-cyan-100',
    medium: 'border border-amber-300/45 bg-amber-400/10 text-amber-100',
    high: 'border border-rose-300/45 bg-rose-400/10 text-rose-100',
  };

  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };

  const created = new Date(task.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const due = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  const updated = new Date(task.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-12 backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(114,109,255,0.22),transparent_65%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-[linear-gradient(180deg,rgba(255,106,213,0.22),transparent)]" />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/10 bg-white/10 shadow-[0_50px_90px_-45px_rgba(7,11,31,0.95)]">
        <span className="pointer-events-none absolute inset-0 opacity-65" style={{ background: 'linear-gradient(135deg, rgba(114,109,255,0.32), rgba(255,106,213,0.28), rgba(56,189,248,0.18))' }} />
        <div className="pointer-events-none absolute -inset-px rounded-[36px] border border-white/15 opacity-40" />

        <div className="relative max-h-[85vh] overflow-y-auto p-10">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
                Task Insights
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
                {task.title}
              </h2>
              <p className="max-w-2xl text-sm text-white/60">
                Dive into the heartbeat of this task. Timelines, priorities, and context come together in one luxe-glass view.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/70 transition-colors duration-300 hover:border-white/30 hover:bg-white/20"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-8 rounded-[26px] border border-white/12 bg-white/8 p-6 text-base text-white/80 shadow-inner">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/65">
              <Tag className="h-4 w-4" />
              Summary
            </div>
            <p className="leading-relaxed text-white/75">{task.description}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Status</h3>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-1.5 text-sm text-white/80">
                {statusLabels[task.status]}
              </p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur">
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Priority</h3>
              <p className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${priorityStyles[task.priority]}`}>
                <span className="h-2 w-2 rounded-full bg-white/70" />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                <Clock className="h-4 w-4" />
                Created
              </h3>
              <p className="text-sm text-white/70">{created}</p>
            </div>

            {due && (
              <div className="rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </h3>
                <p className="text-sm text-white/70">{due}</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Last Updated</h3>
            <p className="text-sm text-white/70">{updated}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
