import { campusLocations } from '../data/campusData';

const BAR_DATA = [
  { label: 'Library', value: 87 },
  { label: 'Canteen', value: 74 },
  { label: 'CS Lab', value: 61 },
  { label: 'Main Block', value: 55 },
  { label: 'Health Ctr', value: 32 },
];

const LINE_DATA = [42, 58, 35, 73, 65, 88, 71, 94, 82, 69, 95, 78, 103, 91];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
              'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TYPE_COLORS = {
  building: '#3b82f6', lab: '#8b5cf6', library: '#f59e0b',
  canteen: '#ec4899', office: '#64748b', parking: '#475569',
  sports: '#22c55e', medical: '#ef4444', event: '#a855f7', exit: '#dc2626',
};

function typeCounts() {
  const counts = {};
  campusLocations.forEach((l) => { counts[l.type] = (counts[l.type] || 0) + 1; });
  return Object.entries(counts);
}

function PieChart() {
  const data = typeCounts();
  const total = data.reduce((s, [, v]) => s + v, 0);
  let cumAngle = 0;
  const slices = data.map(([type, count]) => {
    const angle = (count / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { type, count, angle, start };
  });

  const slice2path = (start, angle, r = 80) => {
    const toRad = (d) => ((d - 90) * Math.PI) / 180;
    const x1 = 100 + r * Math.cos(toRad(start));
    const y1 = 100 + r * Math.sin(toRad(start));
    const x2 = 100 + r * Math.cos(toRad(start + angle));
    const y2 = 100 + r * Math.sin(toRad(start + angle));
    const large = angle > 180 ? 1 : 0;
    return `M100,100 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
  };

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-40 h-40 shrink-0">
        {slices.map((s) => (
          <path key={s.type} d={slice2path(s.start, s.angle)}
            fill={TYPE_COLORS[s.type] || '#888'} opacity="0.85" />
        ))}
        <circle cx="100" cy="100" r="45" fill="var(--surface)" />
        <text x="100" y="105" textAnchor="middle" fontSize="22" fill="var(--text)">🗺️</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {slices.map((s) => (
          <div key={s.type} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: TYPE_COLORS[s.type] || '#888' }} />
            <span className="capitalize">{s.type}</span>
            <span className="text-[var(--muted)]">({s.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart() {
  const max = Math.max(...BAR_DATA.map((d) => d.value));
  return (
    <div className="flex items-end gap-3 h-32">
      {BAR_DATA.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-bold text-[var(--accent)]">{d.value}</span>
          <div
            className="w-full rounded-t-lg bg-[var(--accent)] opacity-80 transition-all"
            style={{ height: `${(d.value / max) * 100}px` }}
          />
          <span className="text-[9px] text-[var(--muted)] text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart() {
  const max  = Math.max(...LINE_DATA);
  const w    = 300;
  const h    = 80;
  const pts  = LINE_DATA.map((v, i) => [
    (i / (LINE_DATA.length - 1)) * w,
    h - (v / max) * (h - 10) + 5,
  ]);
  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `M${pts[0][0]},${h} ` + pts.map(([x, y]) => `L${x},${y}`).join(' ') + ` L${pts[pts.length - 1][0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lineGrad)" />
      <polyline points={polyline} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" />
      ))}
    </svg>
  );
}

export default function Analytics() {
  const statCards = [
    { label: 'Routes Today',    value: '47',   icon: '🗺️', delta: '+12%' },
    { label: 'Active Users',    value: '134',  icon: '👥', delta: '+5%' },
    { label: 'Avg Distance',    value: '0.4km', icon: '📏', delta: '' },
    { label: 'Locations',       value: campusLocations.length, icon: '📍', delta: '' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 fade-up">
        <h1 className="text-3xl font-extrabold">Analytics</h1>
        <p className="text-[var(--muted)] mt-1 text-sm">Campus usage statistics (demo data)</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {statCards.map((s, i) => (
          <div key={s.label} className={`card fade-up stagger-${i + 1}`}>
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className="font-extrabold text-2xl">{s.value}</p>
            <p className="text-xs text-[var(--muted)]">{s.label}</p>
            {s.delta && <p className="text-xs text-[var(--accent)] mt-1 font-medium">{s.delta}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Line chart */}
        <div className="card fade-up stagger-3">
          <h3 className="font-bold text-sm mb-1">Route Requests – Last 14 Days</h3>
          <p className="text-xs text-[var(--muted)] mb-4">Daily navigation requests</p>
          <LineChart />
          <div className="flex justify-between mt-2">
            {DAYS.filter((_, i) => i % 2 === 0).map((d) => (
              <span key={d} className="text-[9px] text-[var(--muted)]">{d}</span>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="card fade-up stagger-4">
          <h3 className="font-bold text-sm mb-1">Most Popular Destinations</h3>
          <p className="text-xs text-[var(--muted)] mb-4">Route requests this week</p>
          <BarChart />
        </div>
      </div>

      {/* Pie chart */}
      <div className="card fade-up stagger-5">
        <h3 className="font-bold text-sm mb-1">Location Type Distribution</h3>
        <p className="text-xs text-[var(--muted)] mb-4">Breakdown of campus facility types</p>
        <PieChart />
      </div>
    </div>
  );
}
