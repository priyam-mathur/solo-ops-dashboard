import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit3,
  Check,
  X,
  Briefcase,
  Clock
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  client: string;
  content: string;
  updatedAt: string;
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n-1',
    title: 'Discovery call notes',
    client: 'Acme Corp',
    content: 'Discussed redesign of checkout flow. Key pain points: drop-off at payment step, mobile UX inconsistencies. Follow up with wireframes by Friday.',
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'n-2',
    title: 'Brand alignment session',
    client: 'Zenith Labs',
    content: 'Confirmed brand palette update. New primary: #2563EB. Requested dark mode support across all dashboards. Will need design tokens audit.',
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'n-3',
    title: 'Sprint planning feedback',
    client: 'Nexus Interactive',
    content: 'Team prefers bi-weekly design reviews. Prototype due end of month. Agreed on Figma as handoff tool. Schedule next call for Thursday.',
    updatedAt: new Date().toISOString()
  }
];

export const NotesWidget: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newClient, setNewClient] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      const saved = localStorage.getItem('soloops.notes.items');
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch {
          setNotes(INITIAL_NOTES);
        }
      } else {
        setNotes(INITIAL_NOTES);
        localStorage.setItem('soloops.notes.items', JSON.stringify(INITIAL_NOTES));
      }
    }
  }, []);

  const saveNotes = (updated: NoteItem[]) => {
    setNotes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('soloops.notes.items', JSON.stringify(updated));
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim()) return;
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      title: newTitle.trim(),
      client: newClient.trim(),
      content: newContent.trim(),
      updatedAt: new Date().toISOString()
    };
    saveNotes([newNote, ...notes]);
    setNewTitle('');
    setNewClient('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleStartEdit = (note: NoteItem) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string, client: string) => {
    const updated = notes.map((n) =>
      n.id === id
        ? { ...n, title: editTitle.trim(), content: editContent.trim(), updatedAt: new Date().toISOString() }
        : n
    );
    saveNotes(updated);
    setEditingId(null);
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter((n) => n.id !== id));
  };

  const clientList = Array.from(new Set(notes.map((n) => n.client)));

  const filteredNotes = notes.filter((n) => {
    const matchesClient = selectedClient === 'all' || n.client === selectedClient;
    const matchesSearch =
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.client.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    return matchesClient && matchesSearch;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = (now.getTime() - d.getTime()) / 3600000;
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${Math.floor(diffH)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full w-full p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-col transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="font-semibold text-textPrimary-light dark:text-textPrimary-dark">Client Notes</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Note
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 mb-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-textMuted-light dark:text-textMuted-dark" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes or clients..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {clientList.length > 0 && (
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textSecondary-light dark:text-textSecondary-dark focus:outline-none"
          >
            <option value="all">All Clients</option>
            {clientList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddNote}
          className="p-3 mb-3 rounded-lg border border-purple-200 dark:border-purple-800/40 bg-purple-50/40 dark:bg-purple-950/20 space-y-2"
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note title *"
              className="px-2.5 py-1.5 text-xs rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              placeholder="Client name *"
              className="px-2.5 py-1.5 text-xs rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Note content..."
            rows={3}
            className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 text-xs rounded-md border border-border-light dark:border-border-dark text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-medium rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[260px] pr-1">
        {filteredNotes.length === 0 ? (
          <div className="py-8 text-center text-xs text-textMuted-light dark:text-textMuted-dark">
            {search || selectedClient !== 'all' ? 'No notes match your filter.' : 'No notes yet. Add your first note!'}
          </div>
        ) : (
          filteredNotes.map((note) =>
            editingId === note.id ? (
              <div
                key={note.id}
                className="p-3 rounded-lg border border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20 space-y-2"
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2.5 py-1 text-xs rounded border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full px-2.5 py-1 text-xs rounded border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 text-textMuted-light dark:text-textMuted-dark hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSaveEdit(note.id, note.client)}
                    className="p-1 text-textMuted-light dark:text-textMuted-dark hover:text-emerald-600"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={note.id}
                className="p-2.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-surfaceHover-light dark:hover:bg-surfaceHover-dark transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === note.id ? null : note.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-textPrimary-light dark:text-textPrimary-dark truncate">
                      {note.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-textMuted-light dark:text-textMuted-dark">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {note.client}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="p-1 text-textMuted-light dark:text-textMuted-dark hover:text-purple-600 transition-colors"
                      aria-label="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-textMuted-light dark:text-textMuted-dark hover:text-red-500 transition-colors"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {expandedId === note.id && note.content && (
                  <p className="mt-2 pt-2 text-[11px] text-textSecondary-light dark:text-textSecondary-dark border-t border-border-light dark:border-border-dark leading-relaxed">
                    {note.content}
                  </p>
                )}
              </div>
            )
          )
        )}
      </div>

      <div className="pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-[11px] text-textMuted-light dark:text-textMuted-dark mt-2">
        <span>{filteredNotes.length} of {notes.length} notes</span>
        <span>{clientList.length} client{clientList.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default NotesWidget;
