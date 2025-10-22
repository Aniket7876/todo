'use client';

import { Task } from '@/types/task';
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react';

const priorityStyles: Record<Task['priority'], {
  gradient: string;
  badge: string;
  dot: string;
  label: string;
}> = {
  low: {
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.26), rgba(14,165,233,0.18), rgba(8,145,178,0.08))',
    badge: 'border border-cyan-300/30 bg-cyan-500/10 text-cyan-100',
    dot: 'bg-cyan-300',
    label: 'Low priority focus',
  },
  medium: {
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(253,186,116,0.22), rgba(217,119,6,0.12))',
    badge: 'border border-amber-300/40 bg-amber-400/10 text-amber-100',
    dot: 'bg-amber-300',
    label: 'Moderate priority',
  },
  high: {
    gradient: 'linear-gradient(135deg, rgba(244,114,182,0.32), rgba(239,68,68,0.24), rgba(244,114,182,0.12))',
    badge: 'border border-rose-300/45 bg-rose-400/10 text-rose-100',
    dot: 'bg-rose-300',
    label: 'High priority spotlight',
  },
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onViewDetails }: TaskCardProps) {
  const priority = priorityStyles[task.priority];
  const createdAt = new Date(task.createdAt);
  const updatedAt = new Date(task.updatedAt);
  const dueDate = task.dueDate ? new Date(task.dueDate) : undefined;

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.05] p-5 shadow-[0_28px_60px_-36px_rgba(15,23,42,0.95)] transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_30px_70px_-38px_rgba(114,109,255,0.75)]"
      onClick={() => onViewDetails(task)}
    >
      <span className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-80" style={{ background: priority.gradient }} />
      <span className="pointer-events-none absolute -inset-px rounded-[24px] border border-white/10 opacity-20 transition-opacity duration-500 group-hover:opacity-40" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3 pr-3">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-white/50">
            <span className={`h-2.5 w-2.5 rounded-full ${priority.dot}`} />
            {task.priority.toUpperCase()}
          </div>
          <h3 className="text-lg font-semibold text-white md:text-xl">{task.title}</h3>
        </div>
        <div className="relative z-10 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/70 backdrop-blur transition-colors duration-300 hover:border-white/35 hover:bg-white/20"
            aria-label="Edit task"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/70 backdrop-blur transition-colors duration-300 hover:border-white/35 hover:bg-white/20"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative mt-4 space-y-4 text-sm text-white/70">
        <p className="line-clamp-3 leading-relaxed text-white/75">{task.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${priority.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Created {createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          {dueDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/45">
          <span>Last touched {updatedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          <span className="font-medium text-white/60">Tap to expand</span>
        </div>
      </div>
    </div>
  );
}
