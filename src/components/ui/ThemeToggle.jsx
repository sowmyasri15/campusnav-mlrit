import { useTheme } from '../../contexts/ThemeContext';
import { RiSunLine, RiMoonLine } from 'react-icons/ri';

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--accent-light)] transition-colors"
      aria-label="Toggle theme"
    >
      {dark ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
    </button>
  );
}
