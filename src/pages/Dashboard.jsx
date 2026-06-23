import { useState } from 'react';
import { Link } from 'react-router-dom';
import { campusLocations } from '../data/campusData';
import toast from 'react-hot-toast';
import { RiMapPinLine, RiHeartLine, RiHeartFill, RiWheelchairLine } from 'react-icons/ri';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const { dark, toggle } = useTheme();
  const [favs, setFavs] = useState([]);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const toggleFav = (id) => {
    if (favs.includes(id)) {
      setFavs((f) => f.filter((x) => x !== id));
      toast.success('Removed from favourites');
    } else {
      setFavs((f) => [...f, id]);
      toast.success('Added to favourites');
    }
  };

  const toggleAccessibility = () => {
    const newVal = !accessibilityMode;
    setAccessibilityMode(newVal);
    toast.success(`Accessibility mode ${newVal ? 'on' : 'off'}`);
  };

  const stats = [
    { label: 'Locations', value: campusLocations.length, icon: '📍' },
    { label: 'Favourites', value: favs.length, icon: '❤️' },
    { label: 'Today\'s Routes', value: 7, icon: '🗺️' },
    { label: 'Campus Size', value: '35 acres', icon: '🏫' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-extrabold">
          Guest Dashboard 👋
        </h1>
        <p className="text-[var(--muted)] mt-1">MLRIT Campus Navigation System</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stats.map((s, i) => (
          <div key={s.label} className={`card text-center fade-up stagger-${i + 1}`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="font-extrabold text-xl">{s.value}</p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="card mb-6 fade-up stagger-3">
        <h2 className="font-bold mb-4">Preferences</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm">Dark Mode</span>
            <div onClick={toggle} className={`w-10 h-5 rounded-full transition-colors relative ${dark ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm flex items-center gap-2">
              <RiWheelchairLine size={15} /> Accessibility Mode
            </span>
            <div onClick={toggleAccessibility} className={`w-10 h-5 rounded-full transition-colors relative ${accessibilityMode ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${accessibilityMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6 fade-up stagger-4">
        <Link to="/map" className="card hover:border-[var(--accent)] transition-colors flex items-center gap-3 cursor-pointer">
          <span className="text-2xl">🗺️</span>
          <div>
            <p className="font-bold text-sm">Open Map</p>
            <p className="text-xs text-[var(--muted)]">Navigate campus</p>
          </div>
        </Link>
        <Link to="/analytics" className="card hover:border-[var(--accent)] transition-colors flex items-center gap-3 cursor-pointer">
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-bold text-sm">Analytics</p>
            <p className="text-xs text-[var(--muted)]">View stats</p>
          </div>
        </Link>
      </div>

      {/* Favourites */}
      <div className="card fade-up stagger-5">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <RiHeartFill className="text-red-400" size={16} /> Favourite Locations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {campusLocations.map((loc) => (
            <div key={loc.id} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
              <div className="flex items-center gap-2">
                <span>{loc.icon}</span>
                <div>
                  <p className="text-sm font-medium">{loc.name}</p>
                  <p className="text-xs text-[var(--muted)] capitalize">{loc.type}</p>
                </div>
              </div>
              <button onClick={() => toggleFav(loc.id)} className="p-1.5 rounded-lg hover:bg-[var(--accent-light)] transition-colors">
                {favs.includes(loc.id)
                  ? <RiHeartFill size={16} className="text-red-400" />
                  : <RiHeartLine size={16} className="text-[var(--muted)]" />
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
