import { useState, useEffect } from 'react';
import { subscribeAnnouncements, addAnnouncement, deleteAnnouncement } from '../services/firestore';
import { campusLocations } from '../data/campusData';
import toast from 'react-hot-toast';
import { RiDeleteBin6Line, RiAddLine, RiAlarmWarningLine } from 'react-icons/ri';

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [title,    setTitle]    = useState('');
  const [body,     setBody]     = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    const unsub = subscribeAnnouncements(setAnnouncements);
    return unsub;
  }, []);

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!title || !body) return;
    setLoading(true);
    try {
      await addAnnouncement(title, body, priority);
      setTitle(''); setBody(''); setPriority('normal');
      toast.success('Announcement published!');
    } catch { toast.error('Failed to publish announcement'); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">Manage campus content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8 fade-up stagger-1">
        {[
          { label: 'Campus Locations', value: campusLocations.length, icon: '📍' },
          { label: 'Announcements', value: announcements.length, icon: '📢' },
          { label: 'Active Users', value: '—', icon: '👥' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="font-extrabold text-2xl">{s.value}</p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New announcement form */}
        <div className="card fade-up stagger-2">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <RiAddLine className="text-[var(--accent)]" /> New Announcement
          </h2>
          <form onSubmit={handleAddAnnouncement} className="flex flex-col gap-3">
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="input-field" placeholder="Title" required
            />
            <textarea
              value={body} onChange={(e) => setBody(e.target.value)}
              className="input-field resize-none" rows={3} placeholder="Announcement body…" required
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field">
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
            <button type="submit" disabled={loading} className="btn-primary">
              Publish
            </button>
          </form>
        </div>

        {/* Announcement list */}
        <div className="card fade-up stagger-3">
          <h2 className="font-bold mb-4">Live Announcements</h2>
          {announcements.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No announcements yet.</p>
          )}
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {announcements.map((a) => (
              <div key={a.id} className={`flex items-start justify-between gap-2 p-3 rounded-xl border text-xs ${
                a.priority === 'urgent' ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : 'border-[var(--border)]'
              }`}>
                <div>
                  <p className="font-semibold flex items-center gap-1">
                    {a.priority === 'urgent' && <RiAlarmWarningLine className="text-red-500" size={12} />}
                    {a.title}
                  </p>
                  <p className="text-[var(--muted)] mt-0.5">{a.body}</p>
                </div>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-400 shrink-0">
                  <RiDeleteBin6Line size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Locations table */}
      <div className="card mt-6 fade-up stagger-4">
        <h2 className="font-bold mb-4">Campus Locations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Icon','Name','Type','Accessible','Lat','Lng'].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 text-[var(--muted)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campusLocations.map((loc) => (
                <tr key={loc.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)]">
                  <td className="py-2 pr-4">{loc.icon}</td>
                  <td className="py-2 pr-4 font-medium">{loc.name}</td>
                  <td className="py-2 pr-4 capitalize text-[var(--muted)]">{loc.type}</td>
                  <td className="py-2 pr-4">{loc.accessible ? '✅' : '⚠️'}</td>
                  <td className="py-2 pr-4 font-mono">{loc.lat}</td>
                  <td className="py-2 pr-4 font-mono">{loc.lng}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
