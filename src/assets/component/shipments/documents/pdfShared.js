// Shared company details, formatters and styles for the invoice/waybill PDFs.
import { StyleSheet, Font } from '@react-pdf/renderer';

// Don't split words with hyphens when wrapping (e.g. 'Inter-national')
Font.registerHyphenationCallback((word) => [word]);

export const COMPANY = {
  name: 'Cargo Realm and Logistics',
  address: 'Nacho Export Warehouse, Murtala Muhammed International Airport, Ikeja, Lagos',
  email: 'info@cargorealmandlogistics.com',
  website: 'www.cargorealmandlogistics.com',
  trackingUrl: 'cargorealmandlogistics.com/app/trackshipment',
};

export const BRAND = '#15803d';
export const BRAND_LIGHT = '#f0fdf4';
export const INK = '#111827';
export const MUTED = '#6b7280';
export const LINE = '#e5e7eb';

export const show = (v) => (v === undefined || v === null || String(v).trim() === '' ? '—' : String(v));

export const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// The built-in PDF fonts have no ₦ glyph, so amounts use the NGN code
export const formatMoney = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return '—';
  return `NGN ${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatStatus = (status) => {
  const s = String(status || '').trim();
  if (!s) return '—';
  if (/^[a-z-]+$/.test(s)) return s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const dimensions = (s) => {
  const parts = [s.length, s.width || s.breadth, s.height].filter((v) => v !== undefined && v !== null && String(v).trim() !== '');
  return parts.length ? `${parts.join(' x ')} cm` : '—';
};

export const items = (s) => (Array.isArray(s.items) ? s.items.filter((i) => String(i || '').trim()) : []);

export const base = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 56, paddingHorizontal: 36, fontSize: 9.5, fontFamily: 'Helvetica', color: INK, lineHeight: 1.35 },
  bold: { fontFamily: 'Helvetica-Bold' },
  muted: { color: MUTED },
  row: { flexDirection: 'row' },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  logo: { width: 150, height: 42, objectFit: 'contain' },
  label: { fontSize: 7.5, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2, fontFamily: 'Helvetica-Bold' },
  card: { borderWidth: 1, borderColor: LINE, borderRadius: 4, padding: 10 },
  cardTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: BRAND, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  footer: { position: 'absolute', bottom: 24, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.5, color: MUTED, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 6 },
});
