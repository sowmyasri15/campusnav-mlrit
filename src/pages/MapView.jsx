import { useRef, useState } from 'react';
import Map from '../components/map/Map';
import RoutePanel from '../components/map/RoutePanel';
import Announcements from '../components/realtime/Announcements';
import WeatherWidget from '../components/realtime/WeatherWidget';
import { campusLocations } from '../data/campusData';
import { RiMenuLine, RiCloseLine } from 'react-icons/ri';

export default function MapView() {
  const mapRef      = useRef(null);
  const [panel, setPanel] = useState(true);

  const handleLocationSelect = (id) => {
    const loc = campusLocations.find((l) => l.id === id);
    if (!loc) return;
    // Update RoutePanel dest via global (hacky but works for this project scope)
    window.campusNavPanelSelect?.(id);
    mapRef.current?.panTo(loc.lat, loc.lng);
  };

  return (
    <div className="h-[calc(100vh-56px)] flex relative overflow-hidden">
      {/* Sidebar panel */}
      <aside
        className={`
          absolute md:relative z-30 top-0 left-0 h-full
          w-80 shrink-0
          bg-[var(--bg)] border-r border-[var(--border)]
          overflow-y-auto
          transition-transform duration-300
          ${panel ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 flex flex-col gap-4">
          <WeatherWidget />
          <div className="card">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span className="text-[var(--accent)]">⬡</span>
              Route Planner
            </h2>
            <RoutePanel mapRef={mapRef} />
          </div>
          <Announcements />
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        <Map
          ref={mapRef}
          onLocationSelect={handleLocationSelect}
        />

        {/* Mobile toggle */}
        <button
          className="md:hidden absolute top-3 left-3 z-20 glass p-2.5 rounded-xl shadow-lg"
          onClick={() => setPanel((p) => !p)}
        >
          {panel ? <RiCloseLine size={18} /> : <RiMenuLine size={18} />}
        </button>

        {/* Location count badge */}
        <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-xl text-xs font-medium">
          📍 {campusLocations.length} locations
        </div>
      </main>
    </div>
  );
}
