import { useEffect, useState } from 'react';
import { RiCloudyLine, RiSunLine, RiRainyLine, RiThunderstormsLine, RiMistLine } from 'react-icons/ri';
import { CAMPUS_CENTER } from '../../data/campusData';

const CAMPUS_LAT = CAMPUS_CENTER[0];
const CAMPUS_LNG = CAMPUS_CENTER[1];

const weatherIcons = {
  Clear: <RiSunLine className="text-yellow-400" size={28} />,
  Clouds: <RiCloudyLine className="text-gray-400" size={28} />,
  Rain: <RiRainyLine className="text-blue-400" size={28} />,
  Drizzle: <RiRainyLine className="text-blue-300" size={28} />,
  Thunderstorm: <RiThunderstormsLine className="text-purple-400" size={28} />,
  Mist: <RiMistLine className="text-gray-400" size={28} />,
};

const MOCK = { temp: 32, condition: 'Sunny', main: 'Clear', city: 'Hyderabad', humidity: 45, wind: 12 };

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [demo,    setDemo]    = useState(false);

  const fetchWeather = async () => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) { setWeather(MOCK); setDemo(true); return; }
    try {
      const r = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${CAMPUS_LAT}&lon=${CAMPUS_LNG}&units=metric&appid=${key}`
      );
      const d = await r.json();
      setWeather({
        temp: Math.round(d.main.temp),
        condition: d.weather[0].description,
        main: d.weather[0].main,
        city: d.name,
        humidity: d.main.humidity,
        wind: Math.round(d.wind.speed * 3.6),
      });
    } catch { setWeather(MOCK); setDemo(true); }
  };

  useEffect(() => { fetchWeather(); }, []);

  if (!weather) return null;

  return (
    <div className="card flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {weatherIcons[weather.main] || <RiCloudyLine size={28} />}
        <div>
          <p className="font-bold text-xl leading-none">{weather.temp}°C</p>
          <p className="text-[var(--muted)] text-xs capitalize mt-0.5">{weather.condition}</p>
        </div>
      </div>
      <div className="text-right text-xs text-[var(--muted)]">
        <p className="font-medium text-[var(--text)]">{weather.city}</p>
        <p>💧 {weather.humidity}% · 💨 {weather.wind} km/h</p>
        {demo && <p className="text-[var(--accent)] mt-0.5">demo mode</p>}
      </div>
    </div>
  );
}
