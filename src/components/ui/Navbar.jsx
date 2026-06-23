import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import { RiMapPinLine, RiDashboardLine, RiAdminLine } from 'react-icons/ri';

export default function Navbar() {
  const location   = useLocation();

  const active = (path) =>
    location.pathname === path
      ? 'text-[var(--accent)] font-semibold'
      : 'text-[var(--muted)] hover:text-[var(--text)]';

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] glass">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <span className="text-[var(--accent)]">⬡</span>
          <span>CampusNav</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/map" className={`flex items-center gap-1.5 transition-colors ${active('/map')}`}>
            <RiMapPinLine size={15} /> Map
          </Link>
          <Link to="/dashboard" className={`flex items-center gap-1.5 transition-colors ${active('/dashboard')}`}>
            <RiDashboardLine size={15} /> Dashboard
          </Link>
          <Link to="/admin" className={`flex items-center gap-1.5 transition-colors ${active('/admin')}`}>
            <RiAdminLine size={15} /> Admin
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
