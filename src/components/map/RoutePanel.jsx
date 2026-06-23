import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { campusLocations, findNearestExit, fuzzyMatch } from '../../data/campusData';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useGeolocation } from '../../hooks/useGeolocation';
import QRCodeGenerator from '../qr/QRCodeGenerator';
import {
  RiMapPinLine, RiNavigationLine, RiMicLine, RiMicOffLine,
  RiAlarmWarningLine, RiWheelchairLine, RiCloseLine, RiQrCodeLine
} from 'react-icons/ri';

export default function RoutePanel({ mapRef }) {
  const [start,       setStart]       = useState('my_location');
  const [dest,        setDest]        = useState('');
  const [accessible,  setAccessible]  = useState(false);
  const [emergency,   setEmergency]   = useState(false);
  const [routeInfo,   setRouteInfo]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [showQR,      setShowQR]      = useState(false);
  const [qrLocation,  setQrLocation]  = useState(null);

  const { startListening, isListening } = useVoiceSearch();
  const { getLocation, loading: geoLoading } = useGeolocation();

  const availableDests = accessible
    ? campusLocations.filter((l) => l.accessible)
    : campusLocations;

  const getStartCoords = async () => {
    if (start === 'my_location') {
      const coords = await getLocation();
      mapRef.current?.setUserMarker(coords.lat, coords.lng);
      return coords;
    }
    const loc = campusLocations.find((l) => l.id === start);
    return { lat: loc.lat, lng: loc.lng };
  };

  const handleGetDirections = async () => {
    if (!dest) { toast.error('Please select a destination.'); return; }
    setLoading(true);
    setEmergency(false);
    try {
      const startCoords = await getStartCoords();
      const destLoc = campusLocations.find((l) => l.id === dest);
      const color = accessible ? '#10b981' : '#16a34a';
      const info = await mapRef.current.drawRoute(
        startCoords.lat, startCoords.lng,
        destLoc.lat, destLoc.lng,
        color
      );
      setRouteInfo({ ...info, destName: destLoc.name });
      toast.success(`Route to ${destLoc.name} calculated!`);
    } catch (e) {
      toast.error('Routing failed. OSRM may be unavailable, try again.');
    }
    setLoading(false);
  };

  const handleEmergency = async () => {
    setLoading(true);
    setEmergency(true);
    try {
      const startCoords = await getStartCoords();
      const exit = findNearestExit(startCoords.lat, startCoords.lng);
      setDest(exit.id);
      const info = await mapRef.current.drawRoute(
        startCoords.lat, startCoords.lng,
        exit.lat, exit.lng,
        '#dc2626'
      );
      setRouteInfo({ ...info, destName: exit.name });
      toast.error('🚨 EMERGENCY MODE – nearest exit selected!', { duration: 5000 });
    } catch (e) {
      toast.error('Could not calculate emergency route.');
    }
    setLoading(false);
  };

  const handleClear = () => {
    mapRef.current?.clearRoute();
    setRouteInfo(null);
    setEmergency(false);
    setDest('');
  };

  const handleVoice = () => {
    startListening((text) => {
      const match = fuzzyMatch(text, availableDests);
      if (match) {
        setDest(match.id);
        toast.success(`🎙️ Destination set: ${match.name}`);
      } else {
        toast.error(`Could not find "${text}" on campus.`);
      }
    });
  };

  const handleQR = () => {
    const loc = campusLocations.find((l) => l.id === dest) || campusLocations[0];
    setQrLocation(loc);
    setShowQR(true);
  };

  // Called from Map.jsx popup button
  if (typeof window !== 'undefined') {
    window.campusNavPanelSelect = (id) => {
      setDest(id);
      toast.success(`Destination: ${campusLocations.find(l=>l.id===id)?.name}`);
    };
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Start */}
      <div>
        <label className="text-xs text-[var(--muted)] font-medium mb-1.5 block">From</label>
        <select
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="input-field"
        >
          <option value="my_location">📍 My Current Location</option>
          {campusLocations.map((l) => (
            <option key={l.id} value={l.id}>{l.icon} {l.name}</option>
          ))}
        </select>
      </div>

      {/* Destination */}
      <div>
        <label className="text-xs text-[var(--muted)] font-medium mb-1.5 block">To</label>
        <div className="flex gap-2">
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="input-field"
          >
            <option value="">Select destination…</option>
            {availableDests.map((l) => (
              <option key={l.id} value={l.id}>{l.icon} {l.name}</option>
            ))}
          </select>
          <button
            onClick={handleVoice}
            className={`p-2.5 rounded-xl border transition-colors shrink-0 ${
              isListening
                ? 'bg-red-500 border-red-500 text-white animate-pulse'
                : 'border-[var(--border)] hover:bg-[var(--accent-light)]'
            }`}
            title="Voice search"
          >
            {isListening ? <RiMicOffLine size={16} /> : <RiMicLine size={16} />}
          </button>
          <button
            onClick={handleQR}
            className="p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--accent-light)] transition-colors shrink-0"
            title="Show QR code"
          >
            <RiQrCodeLine size={16} />
          </button>
        </div>
      </div>

      {/* Accessibility toggle */}
      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors">
        <span className="flex items-center gap-2 text-sm font-medium flex-1">
          <RiWheelchairLine size={16} className={accessible ? 'text-[var(--accent)]' : 'text-[var(--muted)]'} />
          Accessible route only
        </span>
        <div
          onClick={() => setAccessible((a) => !a)}
          className={`w-10 h-5 rounded-full transition-colors relative ${accessible ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${accessible ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </label>

      {/* Get Directions */}
      <button
        onClick={handleGetDirections}
        disabled={loading || geoLoading}
        className="btn-primary flex items-center justify-center gap-2 w-full"
      >
        <RiNavigationLine size={16} />
        {loading ? 'Calculating…' : 'Get Directions'}
      </button>

      {/* Emergency */}
      <button
        onClick={handleEmergency}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
      >
        <RiAlarmWarningLine size={16} />
        EMERGENCY EXIT
      </button>

      {/* Route summary */}
      {routeInfo && (
        <div className={`p-4 rounded-xl border text-sm fade-up ${
          emergency
            ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
            : accessible
            ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
            : 'border-[var(--border)] bg-[var(--bg)]'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold">{routeInfo.destName}</p>
              <p className="text-[var(--muted)] text-xs mt-1">
                📏 {routeInfo.distanceKm} km · ⏱️ ~{routeInfo.minutes} min walk
              </p>
              {accessible && <p className="text-green-600 text-xs mt-1">♿ Accessible route – no stairs</p>}
              {emergency && <p className="text-red-600 text-xs mt-1 font-semibold">🚨 Emergency route active</p>}
            </div>
            <button onClick={handleClear} className="p-1 hover:bg-[var(--border)] rounded-lg transition-colors">
              <RiCloseLine size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Clear button if route active */}
      {routeInfo && (
        <button onClick={handleClear} className="btn-ghost w-full text-xs">
          Clear Route
        </button>
      )}

      {/* QR Modal */}
      {showQR && qrLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowQR(false)}>
          <div className="card max-w-xs w-full mx-4 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">QR Code</h3>
              <button onClick={() => setShowQR(false)}><RiCloseLine size={18} /></button>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">{qrLocation.icon} {qrLocation.name}</p>
            <div className="flex justify-center">
              <QRCodeGenerator location={qrLocation} size={160} />
            </div>
            <p className="text-xs text-[var(--muted)] mt-3">Scan to navigate directly to this location</p>
          </div>
        </div>
      )}
    </div>
  );
}
