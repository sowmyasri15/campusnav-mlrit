import { useEffect, useState } from 'react';
import { subscribeAnnouncements } from '../../services/firestore';
import { RiBroadcastLine, RiAlarmWarningLine } from 'react-icons/ri';

function timeAgo(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Seed mock data when Firestore is empty
const MOCKS = [
  { id: 'm1', title: 'Exam Schedule Released', body: 'End-semester exams begin Dec 18. Check the portal for your timetable.', priority: 'normal', timestamp: { toDate: () => new Date(Date.now() - 3600000) } },
  { id: 'm2', title: '⚠️ Water Supply Disruption', body: 'No water supply in Block C from 10 AM–2 PM today for maintenance.', priority: 'urgent', timestamp: { toDate: () => new Date(Date.now() - 7200000) } },
  { id: 'm3', title: 'Library Extended Hours', body: 'Library open till midnight during exam week. Bring your ID.', priority: 'normal', timestamp: { toDate: () => new Date(Date.now() - 86400000) } },
];

export default function Announcements() {
  const [items, setItems] = useState(MOCKS);
  const [live, setLive]   = useState(false);

  useEffect(() => {
    try {
      const unsub = subscribeAnnouncements((docs) => {
        if (docs.length > 0) { setItems(docs); setLive(true); }
      });
      return unsub;
    } catch { /* Firebase not configured – show mocks */ }
  }, []);

  return (
    <div className="card h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <RiBroadcastLine className="text-[var(--accent)]" size={16} />
          Announcements
        </h3>
        {live && (
          <span className="flex items-center gap-1 text-xs text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border text-xs transition-all ${
              item.priority === 'urgent'
                ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                : 'border-[var(--border)] bg-[var(--bg)]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold flex items-center gap-1">
                {item.priority === 'urgent' && <RiAlarmWarningLine className="text-red-500" size={12} />}
                {item.title}
              </p>
              <span className="text-[var(--muted)] shrink-0">{timeAgo(item.timestamp)}</span>
            </div>
            <p className="text-[var(--muted)] mt-0.5 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
