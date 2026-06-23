import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeGenerator({ location, size = 120 }) {
  if (!location) return null;
  const value = `campus-nav:location:${location.id}`;
  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl">
      <QRCodeSVG value={value} size={size} fgColor="#0a0f0d" bgColor="#ffffff" level="M" />
      <p className="text-xs text-gray-500 font-mono">{location.id}</p>
    </div>
  );
}
