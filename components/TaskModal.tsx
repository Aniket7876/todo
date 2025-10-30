'use client';

import { Task, TaskStatus } from '@/types/task';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => Promise<void> | void;
  task?: Task;
  defaultStatus?: TaskStatus;
}

export default function TaskModal({ isOpen, onClose, onSave, task, defaultStatus }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: defaultStatus || 'todo' as TaskStatus,
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: defaultStatus || 'todo',
        dueDate: '',
      });
    }
  }, [task, defaultStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dueDateValue = formData.dueDate
      ? new Date(formData.dueDate).toISOString()
      : null;

    const taskData: Partial<Task> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: dueDateValue,
    };

    if (task) {
      taskData.id = task.id;
    }

    try {
      await onSave(taskData);
      onClose();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-10 backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(114,109,255,0.2),transparent_60%)] opacity-90" />
      <div className="absolute inset-y-0 left-0 -z-10 w-1/2 bg-[radial-gradient(circle_at_left,rgba(255,106,213,0.18),transparent_55%)]" />

      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.08] shadow-[0_40px_80px_-40px_rgba(7,11,31,0.95)]">
        <span className="pointer-events-none absolute inset-0 opacity-60" style={{ background: 'linear-gradient(135deg, rgba(114,109,255,0.35), rgba(255,106,213,0.28), rgba(56,189,248,0.2))' }} />
        <div className="pointer-events-none absolute -inset-px rounded-[32px] border border-white/20 opacity-40" />

        <div className="relative max-h-[85vh] overflow-y-auto p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-white">
                {task ? 'Refine Task Details' : 'Create a New Task'}
              </h2>
              <p className="mt-2 max-w-sm text-sm text-white/60">
                Set the tone, define the mission, and give this task the clarity it deserves.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/70 transition-colors duration-300 hover:border-white/30 hover:bg-white/20"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-white/80">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-2xl border border-white/12 bg-white/10 px-5 py-3 text-sm text-white placeholder-white/40 shadow-inner transition-all duration-300 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-glow/40"
                placeholder="Give your task a memorable headline"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-white/80">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[130px] w-full rounded-2xl border border-white/12 bg-white/10 px-5 py-4 text-sm text-white placeholder-white/40 shadow-inner transition-all duration-300 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-indigo-glow/40"
                placeholder="Describe the outcome, deliverables, or key notes"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium text-white/80">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white shadow-inner focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-fuchsia-glow/40"
                >
                  <option value="low" className="bg-slate-900">Low</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="high" className="bg-slate-900">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-white/80">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white shadow-inner focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                >
                  <option value="todo" className="bg-slate-900">To Do</option>
                  <option value="in-progress" className="bg-slate-900">In Progress</option>
                  <option value="done" className="bg-slate-900">Done</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium text-white/80">
                Due Date <span className="text-white/40">(Optional)</span>
              </label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-white shadow-inner focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
              />
            </div>

            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full border border-transparent bg-gradient-to-r from-indigo-glow/80 via-fuchsia-glow/70 to-sky-400/75 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-25px_rgba(114,109,255,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-30px_rgba(114,109,255,0.95)]"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
