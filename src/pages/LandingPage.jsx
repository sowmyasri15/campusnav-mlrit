import { Link } from 'react-router-dom';
import { campusLocations } from '../data/campusData';
import {
  RiMapPinLine, RiNavigationLine, RiMicLine,
  RiQrCodeLine, RiWheelchairLine, RiAlarmWarningLine,
  RiBroadcastLine, RiSunCloudyLine,
} from 'react-icons/ri';

const features = [
  { icon: <RiNavigationLine size={22} />, title: 'Smart Routing',    desc: 'Walking routes via OSRM with real-time path drawing and distance/time summary.' },
  { icon: <RiMicLine size={22} />,        title: 'Voice Search',     desc: 'Say a location name and the app finds it instantly using your browser\'s microphone.' },
  { icon: <RiQrCodeLine size={22} />,     title: 'QR Navigation',    desc: 'Every campus location has a unique QR code. Scan-to-navigate in one tap.' },
  { icon: <RiWheelchairLine size={22} />, title: 'Accessible Routes', desc: 'Filter destinations to wheelchair-accessible locations. Route line turns green.' },
  { icon: <RiAlarmWarningLine size={22} />, title: 'Emergency Mode', desc: 'One tap finds the nearest emergency exit and draws the fastest route in red.' },
  { icon: <RiBroadcastLine size={22} />,  title: 'Live Announcements', desc: 'Real-time Firebase-powered campus notices — no refresh needed, ever.' },
  { icon: <RiSunCloudyLine size={22} />,  title: 'Weather Widget',   desc: 'Live weather data for campus coordinates to help you plan your walk.' },
  { icon: <RiMapPinLine size={22} />,     title: '11 Locations',     desc: 'From the canteen to the emergency exits, every key campus point is mapped.' },
];

export default function LandingPage() {
  return (
    <div className="bg-[var(--bg)] min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-24 pb-20 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[600px] h-[600px] rounded-full
            bg-[var(--accent)] opacity-[0.06] blur-3xl" />
        </div>

        <div className="fade-up max-w-2xl mx-auto">
          <span className="inline-block border border-[var(--accent)] text-[var(--accent)] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            MLR Institute of Technology
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            Navigate MLRIT
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-emerald-300">
              with confidence.
            </span>
          </h1>

          <p className="text-[var(--muted)] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Real-time routes for the Dundigal campus. Locate SR Block, JC Block, hostels, and more at Hyderabad's premier tech institute.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/map" className="btn-primary text-base px-10 py-3">
              Start Navigating →
            </Link>
          </div>
        </div>

        {/* Location pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto fade-up stagger-3">
          {campusLocations.slice(0, 8).map((loc) => (
            <span key={loc.id} className="glass px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
              {loc.icon} {loc.name}
            </span>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12 fade-up">
          <h2 className="text-3xl font-extrabold mb-3">Everything you need</h2>
          <p className="text-[var(--muted)]">Built for students, faculty, and visitors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={f.title} className={`card hover:border-[var(--accent)] transition-all duration-200 fade-up stagger-${(i % 6) + 1}`}>
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center fade-up">
        <div className="card border-[var(--accent)] bg-gradient-to-br from-[var(--accent-light)] to-transparent">
          <h2 className="text-2xl font-extrabold mb-3">Ready to navigate?</h2>
          <p className="text-[var(--muted)] text-sm mb-6">Free to use. No setup required. Works on any device.</p>
          <Link to="/map" className="btn-primary text-base px-10 py-3">
            Start Navigating →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] text-center py-6 text-xs text-[var(--muted)]">
        © 2026 MLR Institute of Technology · CampusNav System
      </footer>
    </div>
  );
}
