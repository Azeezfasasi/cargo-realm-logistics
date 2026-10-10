// Shared helpers for the Quote Requests page
import { Plane, Ship, Truck, Package } from 'lucide-react';

export const QUOTE_STATUS = {
  new: { label: 'New', pill: 'bg-amber-50 text-amber-800 ring-amber-600/20', dot: 'bg-amber-500' },
  read: { label: 'Read', pill: 'bg-sky-50 text-sky-700 ring-sky-600/20', dot: 'bg-sky-500' },
  replied: { label: 'Replied', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  archived: { label: 'Archived', pill: 'bg-gray-50 text-gray-600 ring-gray-500/20', dot: 'bg-gray-400' },
};

export const shippingIcon = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('air')) return Plane;
  if (t.includes('sea')) return Ship;
  if (t.includes('road')) return Truck;
  return Package;
};

export const relativeTime = (date) => {
  if (!date) return '';
  const mins = Math.floor((Date.now() - new Date(date)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || '?';

const AVATAR_TONES = [
  'bg-green-100 text-green-800', 'bg-sky-100 text-sky-800', 'bg-amber-100 text-amber-800',
  'bg-violet-100 text-violet-800', 'bg-rose-100 text-rose-800', 'bg-teal-100 text-teal-800',
];
// Same person always gets the same colour
export const avatarTone = (seed = '') => AVATAR_TONES[[...seed].reduce((t, c) => t + c.charCodeAt(0), 0) % AVATAR_TONES.length];

// Numbers-only weights are kilograms; anything else ("20 lbs") is shown as entered
export const formatWeight = (w) => (w ? `${w}${/^\d+(\.\d+)?$/.test(String(w).trim()) ? ' kg' : ''}` : '');
