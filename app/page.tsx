'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Activity, CheckCircle2, Flame, PlusCircle, Sparkles } from 'lucide-react';
import { Column, Task, TaskStatus } from '@/types/task';
import KanbanColumn from '@/components/KanbanColumn';
import TaskDetailsModal from '@/components/TaskDetailsModal';
import TaskModal from '@/components/TaskModal';

type StatCard = {
  id: string;
  label: string;
  value: string;
  subLabel: string;
  gradient: string;
  icon: ReactNode;
  type?: 'progress';
  progress?: number;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Welcome to your Kanban board!',
      description: 'This is a sample task. Click on it to view details, or use the edit button to modify it.',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  const columns = useMemo<Column[]>(() => (
    [
      { id: 'todo', title: 'To Do', tasks: tasks.filter((task) => task.status === 'todo') },
      { id: 'in-progress', title: 'In Progress', tasks: tasks.filter((task) => task.status === 'in-progress') },
      { id: 'done', title: 'Done', tasks: tasks.filter((task) => task.status === 'done') },
    ]
  ), [tasks]);

  const totalTasks = tasks.length;
  const todoCount = columns.find((column) => column.id === 'todo')?.tasks.length ?? 0;
  const inProgressCount = columns.find((column) => column.id === 'in-progress')?.tasks.length ?? 0;
  const completedCount = columns.find((column) => column.id === 'done')?.tasks.length ?? 0;
  const completion = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  const stats: StatCard[] = useMemo(() => ([
    {
      id: 'total',
      label: 'Total Tasks',
      value: totalTasks.toString().padStart(2, '0'),
      subLabel: 'Across every stage of your flow',
      gradient: 'linear-gradient(135deg, rgba(255,255,255,0.32), rgba(148,163,184,0.18), rgba(15,23,42,0))',
      icon: <Sparkles className="h-5 w-5 text-white/80" />, 
    },
    {
      id: 'focus',
      label: 'Focus Now',
      value: inProgressCount.toString().padStart(2, '0'),
      subLabel: `${inProgressCount === 1 ? 'Task' : 'Tasks'} in motion`,
      gradient: 'linear-gradient(135deg, rgba(253,186,116,0.45), rgba(249,115,22,0.35), rgba(234,179,8,0.18))',
      icon: <Activity className="h-5 w-5 text-amber-200" />, 
    },
    {
      id: 'momentum',
      label: 'Momentum',
      value: `${completion}%`,
      subLabel: `${completedCount} of ${totalTasks || 0} completed`,
      gradient: 'linear-gradient(135deg, rgba(52,211,153,0.45), rgba(56,189,248,0.35), rgba(59,130,246,0.2))',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-200" />, 
      type: 'progress',
      progress: completion,
    },
  ]), [completedCount, completion, inProgressCount, totalTasks]);

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      // Update existing task
      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...t, ...taskData, updatedAt: new Date() }
          : t
      ));
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title!,
        description: taskData.description!,
        status: taskData.status || defaultStatus,
        priority: taskData.priority || 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: taskData.dueDate,
      };
      setTasks([...tasks, newTask]);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-24 pt-24 md:px-10">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-glow/45 via-fuchsia-glow/40 to-sky-400/30 blur-3xl opacity-70 animate-float-slow" />
        <div className="absolute right-[-10%] top-[18%] h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-glow/40 via-indigo-glow/35 to-white/20 blur-[140px] opacity-60 animate-float-delayed" />
        <div className="absolute bottom-[-12%] left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-gradient-to-tl from-sky-400/35 via-indigo-glow/20 to-transparent blur-[160px] opacity-60" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.65)]" />
            Live Workspace
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold text-white drop-shadow md:text-5xl lg:text-6xl">
                Craft your next big win.
              </h1>
              <p className="text-base text-white/70 md:text-lg">
                Flow through tasks with an aurora-inspired board, ambient highlights, and instant clarity over what matters most today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleAddTask('todo')}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_-20px_rgba(114,109,255,0.75)] transition-transform duration-300 hover:-translate-y-1 hover:border-indigo-glow/60 hover:bg-white/15"
              >
                <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'linear-gradient(120deg, rgba(114,109,255,0.45), rgba(255,106,213,0.45), rgba(56,189,248,0.4))' }} />
                <PlusCircle className="relative h-5 w-5" />
                <span className="relative">New Task</span>
              </button>
              <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent md:block" />
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs text-white/60 backdrop-blur">
                <Flame className="h-4 w-4 text-orange-300" />
                {todoCount} awaiting spark
              </div>
            </div>
          </div>
        </header>

        <section className="relative z-10 grid gap-4 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_40px_-28px_rgba(15,23,42,0.9)] backdrop-blur-xl">
              <span className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-80" style={{ background: stat.gradient }} />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-50" />
              <div className="relative flex items-start justify-between">
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">{stat.label}</span>
                  <span className="text-4xl font-bold text-white md:text-5xl">{stat.value}</span>
                  <p className="text-sm text-white/60">{stat.subLabel}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner backdrop-blur-lg">
                  {stat.icon}
                </div>
              </div>
              {stat.type === 'progress' && (
                <div className="relative mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.45)] transition-all duration-700"
                    style={{ width: `${stat.progress ?? 0}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </section>

        <div className="relative z-10 flex snap-x gap-6 overflow-x-auto pb-8 pt-2 items-stretch lg:auto-rows-fr lg:grid lg:snap-none lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-12">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              status={column.id}
              tasks={column.tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        task={selectedTask || undefined}
        defaultStatus={defaultStatus}
      />

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </main>
  );
}
