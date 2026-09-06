import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Trash2,
  Plus,
  Calendar,
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock
} from 'lucide-react';

export interface TaskItem {
  id: string;
  title: string;
  client: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Finalize mobile checkout UX flow',
    client: 'Acme Corp',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 't-2',
    title: 'Design token audit & typography review',
    client: 'Zenith Labs',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 't-3',
    title: 'Client design review & feedback session',
    client: 'Nexus Interactive',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export const TodoWidget: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newClient, setNewClient] = useState<string>('Acme Corp');
  const [newDueDate, setNewDueDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const saved = localStorage.getItem('soloops.theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'soloops:themechange') return;
      const t = event.data.theme as 'light' | 'dark';
      if (t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'soloops.theme') return;
      const t = event.newValue as 'light' | 'dark' | null;
      if (t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soloops.todo.items');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTasks(parsed);
        } catch {
          setTasks(INITIAL_TASKS);
        }
      } else {
        setTasks(INITIAL_TASKS);
        localStorage.setItem('soloops.todo.items', JSON.stringify(INITIAL_TASKS));
      }
    }
  }, []);

  const saveTasks = (updated: TaskItem[]) => {
    setTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('soloops.todo.items', JSON.stringify(updated));
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: newTitle.trim(),
      client: newClient.trim() || 'General',
      dueDate: newDueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setNewTitle('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.dueDate.localeCompare(b.dueDate);
  });

  const filteredTasks = sortedTasks.filter((t) => {
    const matchesClient = selectedClient === 'all' || t.client === selectedClient;
    if (!matchesClient) return false;

    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'overdue') return isOverdue(t.dueDate, t.completed);
    return true;
  });

  const clientList = Array.from(new Set(tasks.map((t) => t.client)));
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.completed)).length;

  return (
    <div className="h-full w-full p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-col justify-between transition-colors">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-semibold text-textPrimary-light dark:text-textPrimary-dark">
              Tasks by Client
            </h2>
            {overdueCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                {overdueCount} overdue
              </span>
            )}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 my-3">
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-slate-200 dark:bg-slate-700 font-semibold text-textPrimary-light dark:text-textPrimary-dark'
                  : 'text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filter === 'pending'
                  ? 'bg-slate-200 dark:bg-slate-700 font-semibold text-textPrimary-light dark:text-textPrimary-dark'
                  : 'text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filter === 'overdue'
                  ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-semibold'
                  : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 py-1 rounded-md transition-colors ${
                filter === 'completed'
                  ? 'bg-slate-200 dark:bg-slate-700 font-semibold text-textPrimary-light dark:text-textPrimary-dark'
                  : 'text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Done
            </button>
          </div>

          {clientList.length > 0 && (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="text-xs px-2 py-1 rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textSecondary-light dark:text-textSecondary-dark focus:outline-none"
            >
              <option value="all">All Clients</option>
              {clientList.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          )}
        </div>

        {isAdding && (
          <form
            onSubmit={handleAddTask}
            className="p-3 mb-3 rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2"
          >
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task description..."
              className="w-full px-3 py-1.5 text-xs rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                placeholder="Client name"
                className="px-2.5 py-1 text-xs rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark"
              />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="px-2 py-1 text-xs rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2.5 py-1 text-xs rounded-md border border-border-light dark:border-border-dark text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-textMuted-light dark:text-textMuted-dark">
              No tasks found in this view.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const overdue = isOverdue(task.dueDate, task.completed);
              return (
                <div
                  key={task.id}
                  className={`p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                    task.completed
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 opacity-60'
                      : overdue
                      ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10'
                      : 'border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark'
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    className="mt-0.5 text-textMuted-light dark:text-textMuted-dark hover:text-emerald-600 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-medium truncate ${
                        task.completed
                          ? 'line-through text-textMuted-light dark:text-textMuted-dark'
                          : 'text-textPrimary-light dark:text-textPrimary-dark'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-textSecondary-light dark:text-textSecondary-dark">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        {task.client}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span
                        className={`inline-flex items-center gap-1 ${
                          overdue
                            ? 'text-red-600 dark:text-red-400 font-semibold'
                            : 'text-textMuted-light dark:text-textMuted-dark'
                        }`}
                      >
                        {overdue ? (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        ) : (
                          <Calendar className="w-3 h-3" />
                        )}
                        {task.dueDate}
                        {overdue && ' (Overdue)'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    className="text-textMuted-light dark:text-textMuted-dark hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-[11px] text-textMuted-light dark:text-textMuted-dark">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Sorted by urgency
        </span>
        <span>
          {tasks.filter((t) => t.completed).length}/{tasks.length} done
        </span>
      </div>
    </div>
  );
};

export default TodoWidget;
