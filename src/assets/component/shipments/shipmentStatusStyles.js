// Shared status helpers for the shipment dashboard tables.

// Shipments open longer than this many days are flagged as needing attention
export const STALE_AFTER_DAYS = 14;

export const isDelivered = (status) => String(status || '').trim().toLowerCase() === 'delivered';

export const daysSince = (date) => {
  if (!date) return 0;
  const diff = Date.now() - new Date(date).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

// Tone palette: pill classes + a solid dot/bar color
const TONES = {
  green: { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
  amber: { pill: 'bg-amber-50 text-amber-800 ring-amber-600/20', dot: 'bg-amber-500' },
  blue: { pill: 'bg-sky-50 text-sky-700 ring-sky-600/20', dot: 'bg-sky-500' },
  violet: { pill: 'bg-violet-50 text-violet-700 ring-violet-600/20', dot: 'bg-violet-500' },
  indigo: { pill: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', dot: 'bg-indigo-500' },
  pink: { pill: 'bg-pink-50 text-pink-700 ring-pink-600/20', dot: 'bg-pink-500' },
  teal: { pill: 'bg-teal-50 text-teal-700 ring-teal-600/20', dot: 'bg-teal-500' },
  orange: { pill: 'bg-orange-50 text-orange-700 ring-orange-600/20', dot: 'bg-orange-500' },
  red: { pill: 'bg-rose-50 text-rose-700 ring-rose-600/20', dot: 'bg-rose-500' },
  gray: { pill: 'bg-gray-50 text-gray-700 ring-gray-500/20', dot: 'bg-gray-400' },
};

const STATUS_TONE = {
  'delivered': 'green',
  'available for pick up,check phone for instructions': 'green',
  'customs clearance completed': 'green',
  'package is received and accepted by airline': 'green',
  'in-transit': 'amber',
  'pickup-scheduled': 'amber',
  'processed in lagos nigeria': 'amber',
  'processing': 'blue',
  'arrived nearest airport': 'blue',
  'customs-clearance': 'teal',
  'received from flight': 'teal',
  'arrived carrier connecting facility': 'teal',
  'picked-up': 'violet',
  'arrived-at-hub': 'violet',
  'arrived at an international sorting facility and will be ready for delivery soon': 'violet',
  'departed-from-hub': 'indigo',
  'pending carrier lift': 'indigo',
  'delivery is booked': 'indigo',
  'out-for-delivery': 'pink',
  'awaiting delivery': 'pink',
  'scheduled to depart on the next movement': 'pink',
  'awaiting pickup': 'orange',
  'departed cargo realm facility (nig)': 'orange',
  'pending': 'red',
  'on-hold': 'red',
  'cancelled': 'red',
  'failed-delivery-attempt': 'red',
  'shipment is delayed': 'red',
  'delivery date not available': 'gray',
};

export const getStatusTone = (status) =>
  TONES[STATUS_TONE[String(status || '').trim().toLowerCase()]] || TONES.gray;

// "in-transit" -> "In Transit"; free-text statuses keep their wording
export const formatStatus = (status) => {
  const s = String(status || '').trim();
  if (!s) return 'Unknown';
  if (/^[a-z-]+$/.test(s)) {
    return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};
