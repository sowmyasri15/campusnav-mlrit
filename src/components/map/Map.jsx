import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { campusLocations, CAMPUS_CENTER } from '../../data/campusData';

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create a coloured circle marker
const makeIcon = (color, icon, size = 36) =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      border:3px solid white;
      box-shadow:0 4px 12px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    "><span style="transform:rotate(45deg);font-size:${size * 0.4}px;line-height:1">${icon}</span></div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor:[0, -(size + 4)],
  });

const Map = forwardRef(function Map({ onLocationSelect, routeColor = '#16a34a', accessible }, ref) {
  const containerRef  = useRef(null);
  const mapRef        = useRef(null);
  const markersRef    = useRef({});
  const routeLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    drawRoute,
    clearRoute,
    setUserMarker,
    fitBounds: (latlngs) => mapRef.current?.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60] }),
    panTo: (lat, lng) => mapRef.current?.setView([lat, lng], 17, { animate: true }),
  }));

  // Initialise map once
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: CAMPUS_CENTER,
      zoom: 16,
      zoomControl: false,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { attribution: '© OpenStreetMap, © CARTO', subdomains: 'abcd', maxZoom: 20 }
    ).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add campus boundary circle
    L.circle(CAMPUS_CENTER, {
      radius: 400,
      color: '#4ade80',
      fillColor: '#4ade80',
      fillOpacity: 0.04,
      weight: 1.5,
      dashArray: '6 4',
    }).addTo(map);

    mapRef.current = map;
    addMarkers(map);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const addMarkers = (map) => {
    campusLocations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: makeIcon(loc.color, loc.icon),
        title: loc.name,
      });

      const popup = L.popup({ maxWidth: 280, minWidth: 220 }).setContent(`
        <div style="font-family:'Syne',sans-serif;padding:4px">
          <div style="font-size:24px;margin-bottom:6px">${loc.icon}</div>
          <h3 style="font-weight:700;font-size:14px;margin:0 0 4px">${loc.name}</h3>
          <span style="font-size:10px;background:${loc.color}22;color:${loc.color};
            border-radius:6px;padding:2px 8px;font-weight:600;text-transform:uppercase">
            ${loc.type}
          </span>
          ${!loc.accessible ? '<span style="margin-left:6px;font-size:10px;background:#fef3c7;color:#d97706;border-radius:6px;padding:2px 8px;font-weight:600">⚠️ Stairs</span>' : ''}
          <p style="font-size:12px;color:#888;margin:8px 0 12px;line-height:1.5">${loc.description}</p>
          <button
            onclick="window.campusNavSelect('${loc.id}')"
            style="width:100%;background:#16a34a;color:white;border:none;border-radius:10px;
              padding:8px 0;font-size:12px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif">
            Navigate Here →
          </button>
        </div>
      `);

      marker.bindPopup(popup);
      marker.addTo(map);
      markersRef.current[loc.id] = marker;
    });

    // Global click handler for popup buttons
    window.campusNavSelect = (id) => {
      onLocationSelect?.(id);
      mapRef.current?.closePopup();
    };
  };

  const drawRoute = async (startLat, startLng, destLat, destLng, color = routeColor) => {
    clearRoute();
    const url = `https://router.project-osrm.org/route/v1/walking/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.code !== 'Ok') throw new Error('Routing failed');

    const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const line = L.polyline(coords, {
      color,
      weight: 5,
      opacity: 0.9,
      dashArray: color === '#dc2626' ? '10 6' : '12 6',
      lineCap: 'round',
    }).addTo(mapRef.current);

    routeLayerRef.current = line;
    mapRef.current.fitBounds(line.getBounds(), { padding: [60, 60] });

    const { distance, duration } = data.routes[0].legs[0];
    return {
      distanceKm: (distance / 1000).toFixed(2),
      minutes: Math.ceil(duration / 60),
    };
  };

  const clearRoute = () => {
    if (routeLayerRef.current) {
      mapRef.current?.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
  };

  const setUserMarker = (lat, lng) => {
    if (userMarkerRef.current) mapRef.current?.removeLayer(userMarkerRef.current);
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:16px;height:16px;background:#3b82f6;border-radius:50%;
        border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);
        animation: pulse-dot 1.5s infinite;
      "></div>`,
      iconSize: [16, 16], iconAnchor: [8, 8],
    });
    userMarkerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
});

export default Map;
