'use client';

import { type DragEvent } from 'react';
import { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';
import { CheckCircle2, Plus, Sparkles, Timer } from 'lucide-react';

const columnThemes: Record<TaskStatus, {
  icon: JSX.Element;
  tagline: string;
  gradient: string;
  accent: string;
  emptyTitle: string;
  emptyDescription: string;
}> = {
  'todo': {
    icon: <Sparkles className="h-5 w-5 text-sky-200" />,
    tagline: 'Ideas waiting for a spark',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.35), rgba(125,211,252,0.15), rgba(56,189,248,0.05))',
    accent: 'from-sky-400/40 via-cyan-400/30 to-transparent',
    emptyTitle: 'Nothing queued yet',
    emptyDescription: 'Drop your next brilliant idea here to kick things off.',
  },
  'in-progress': {
    icon: <Timer className="h-5 w-5 text-amber-200" />,
    tagline: 'Momentum in motion',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.35), rgba(253,186,116,0.18), rgba(251,191,36,0.05))',
    accent: 'from-amber-300/40 via-orange-300/25 to-transparent',
    emptyTitle: 'Space to focus',
    emptyDescription: 'Pick a task and bring it into the spotlight when you are ready.',
  },
  'done': {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-200" />,
    tagline: 'Wrapped with a bow',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.32), rgba(16,185,129,0.2), rgba(52,211,153,0.08))',
    accent: 'from-emerald-300/35 via-cyan-300/20 to-transparent',
    emptyTitle: 'Awaiting victories',
    emptyDescription: 'Complete a task to celebrate it in this showcase column.',
  },
};

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void> | void;
  onViewDetails: (task: Task) => void;
  onDragStartTask: (taskId: string) => void;
  onDragEndTask: () => void;
  onDropTask: () => void;
  onDragEnterZone: () => void;
  onDragLeaveZone: () => void;
  isDragOver: boolean;
  draggedTaskId: string | null;
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onViewDetails,
  onDragStartTask,
  onDragEndTask,
  onDropTask,
  onDragEnterZone,
  onDragLeaveZone,
  isDragOver,
  draggedTaskId,
}: KanbanColumnProps) {
  const theme = columnThemes[status];
  const taskCountLabel = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!draggedTaskId) return;
    event.preventDefault();
    onDragEnterZone();
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!draggedTaskId) return;
    event.preventDefault();
    onDragEnterZone();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!draggedTaskId) return;
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }
    onDragLeaveZone();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!draggedTaskId) return;
    event.preventDefault();
    onDropTask();
  };

  return (
    <div
      className={`group relative flex h-full min-w-[320px] flex-1 snap-start flex-col gap-5 overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.04] p-6 shadow-[0_28px_50px_-38px_rgba(15,23,42,0.95)] backdrop-blur-2xl lg:min-w-0 ${
        isDragOver ? 'border-white/30 bg-white/[0.06]' : ''
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-dropeffect={draggedTaskId ? 'move' : undefined}
    >
      <span className="pointer-events-none absolute inset-0 opacity-60" style={{ background: theme.gradient }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80" />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner backdrop-blur">
              {theme.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">{theme.tagline}</p>
            </div>
          </div>
          <div className="inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-white/60" />
            {taskCountLabel}
          </div>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_10px_30px_-18px_rgba(114,109,255,0.75)] transition-transform duration-300 hover:-translate-y-1 hover:border-white/35 hover:bg-white/20"
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

        <div className="relative flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/8 backdrop-blur">
              {theme.icon}
            </div>
            <p className="text-base font-medium text-white/80">{theme.emptyTitle}</p>
            <p className="mt-2 text-sm text-white/50">{theme.emptyDescription}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onViewDetails={onViewDetails}
                onDragStart={onDragStartTask}
                onDragEnd={onDragEndTask}
                isDragging={draggedTaskId === task.id}
            />
          ))
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-3 h-16 rounded-full bg-gradient-to-t from-black/25 to-transparent blur-3xl" />
    </div>
  );
}
