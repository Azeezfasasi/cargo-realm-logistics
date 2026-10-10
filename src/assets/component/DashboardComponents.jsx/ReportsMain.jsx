import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, PackageCheck, Receipt, Wallet, AlertCircle, Timer, Download, RotateCw, ChevronDown, Building2, CalendarDays } from 'lucide-react';
import { API_BASE_URL } from '../../../config/Api';

// Chart tokens (single-series charts use categorical slot 1; text never wears the series color)
const SERIES = '#2a78d6';
const GRID = '#e5e7eb';
const AXIS_TEXT = '#6b7280';

// Dates are in Lagos time (UTC+1, no DST) to match the backend's day boundaries
const lagosToday = () => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 10);
const shift = (ymd, days) => new Date(Date.parse(`${ymd}T00:00:00Z`) + days * 864e5).toISOString().slice(0, 10);
const PRESETS = [
  { id: '7d', label: 'Last 7 days', range: (t) => [shift(t, -6), t] },
  { id: '30d', label: 'Last 30 days', range: (t) => [shift(t, -29), t] },
  { id: '90d', label: 'Last 90 days', range: (t) => [shift(t, -89), t] },
  { id: 'month', label: 'This month', range: (t) => [`${t.slice(0, 8)}01`, t] },
  {
    id: 'lastmonth', label: 'Last month', range: (t) => {
      const firstThis = `${t.slice(0, 8)}01`;
      const lastPrev = shift(firstThis, -1);
      return [`${lastPrev.slice(0, 8)}01`, lastPrev];
    },
  },
  { id: 'year', label: 'This year', range: (t) => [`${t.slice(0, 4)}-01-01`, t] },
  { id: 'custom', label: 'Custom range' },
];

const naira = (n, compact = false) =>
  `₦${(Number(n) || 0).toLocaleString('en-NG', compact
    ? { notation: 'compact', maximumFractionDigits: 1 }
    : { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const int = (n) => (Number(n) || 0).toLocaleString('en-NG');
const bucketLabel = (bucket, granularity, long = false) => {
  const d = new Date(`${granularity === 'day' ? bucket : `${bucket}-01`}T00:00:00Z`);
  return granularity === 'day'
    ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(long ? { year: 'numeric' } : {}), timeZone: 'UTC' })
    : d.toLocaleDateString('en-GB', { month: long ? 'long' : 'short', year: 'numeric', timeZone: 'UTC' });
};

function StatTile({ icon, label, value, hint, tone = 'gray' }) {
  const Icon = icon;
  const tones = {
    gray: 'bg-gray-100 text-gray-600',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-sky-100 text-sky-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="mt-1 truncate text-xl font-bold tabular-nums text-gray-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label, granularity, format }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="text-gray-500">{bucketLabel(label, granularity, true)}</p>
      <p className="mt-0.5 flex items-center gap-1.5 font-semibold tabular-nums text-gray-900">
        <span className="h-2 w-2 rounded-sm" style={{ background: SERIES }} />
        {format(payload[0].value)}
      </p>
    </div>
  );
}

function SeriesChart({ title, subtitle, data, dataKey, granularity, format, formatAxis }) {
  const [showTable, setShowTable] = useState(false);
  const hasData = data.some((d) => d[dataKey] > 0);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="shrink-0 cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          {showTable ? 'Show chart' : 'Show table'}
        </button>
      </div>
      {showTable ? (
        <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-gray-50 text-gray-500">
              <tr><th className="px-3 py-2 font-semibold">Period</th><th className="px-3 py-2 text-right font-semibold">{title}</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((d) => (
                <tr key={d.bucket}>
                  <td className="px-3 py-1.5 text-gray-700">{bucketLabel(d.bucket, granularity, true)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-gray-900">{format(d[dataKey])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !hasData ? (
        <div className="flex h-56 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">Nothing in this period</div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap={2}>
              <CartesianGrid vertical={false} stroke={GRID} strokeWidth={1} />
              <XAxis
                dataKey="bucket"
                tickFormatter={(b) => bucketLabel(b, granularity)}
                tick={{ fontSize: 11, fill: AXIS_TEXT }}
                axisLine={{ stroke: GRID }}
                tickLine={false}
                minTickGap={16}
              />
              <YAxis
                tickFormatter={formatAxis}
                tick={{ fontSize: 11, fill: AXIS_TEXT }}
                axisLine={false}
                tickLine={false}
                width={56}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                content={<ChartTooltip granularity={granularity} format={format} />}
              />
              <Bar dataKey={dataKey} fill={SERIES} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

const exportCsv = (report) => {
  const header = ['Facility', 'Shipments created', 'Delivered', 'Avg delivery days', 'Billed (NGN)', 'Collected (NGN)', 'Outstanding now (NGN)', 'Open now'];
  const rows = report.facilities.map((f) => [f.facility, f.created, f.delivered, f.avgDeliveryDays ?? '', f.billed, f.collected, f.outstanding, f.open]);
  const t = report.totals;
  rows.push(['Total', t.created, t.delivered, t.avgDeliveryDays ?? '', t.billed, t.collected, t.outstanding, t.open]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `cargo-realm-report_${report.range.from}_to_${report.range.to}${report.facility ? `_${report.facility}` : ''}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function ReportsMain() {
  const today = lagosToday();
  const [preset, setPreset] = useState('30d');
  const [custom, setCustom] = useState({ from: shift(today, -29), to: today });
  const [facility, setFacility] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [from, to] = useMemo(() => {
    const p = PRESETS.find((x) => x.id === preset);
    return p?.range ? p.range(today) : [custom.from, custom.to];
  }, [preset, custom, today]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/facilities`)
      .then((res) => setFacilities(Array.isArray(res.data) ? res.data.map((f) => f.name).filter(Boolean) : []))
      .catch(() => setFacilities([]));
  }, []);

  useEffect(() => {
    if (!from || !to || from > to) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE_URL}/reports/shipments`, {
      params: { from, to, ...(facility ? { facility } : {}) },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      signal: controller.signal,
    })
      .then((res) => setReport(res.data))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(err?.response?.data?.message || err.message || 'Failed to load report');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [from, to, facility, reloadKey]);

  const t = report?.totals;
  const granularity = report?.range.granularity || 'day';
  const selectClass = 'h-10 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Shipments</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">Reports</h1>
        <p className="text-sm text-gray-500">Shipments, deliveries and payments for the selected period (Lagos time).</p>
      </div>

      {/* Filters: one row above all charts */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
        <div className="relative lg:w-48">
          <CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={preset} onChange={(e) => setPreset(e.target.value)} className={selectClass} aria-label="Date range">
            {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {preset === 'custom' && (
          <div className="flex items-center gap-2">
            <input type="date" value={custom.from} max={custom.to} aria-label="From"
              onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))}
              className="h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            <span className="text-sm text-gray-400">to</span>
            <input type="date" value={custom.to} min={custom.from} max={today} aria-label="To"
              onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))}
              className="h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
          </div>
        )}
        <div className="relative lg:w-52">
          <Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={facility} onChange={(e) => setFacility(e.target.value)} className={selectClass} aria-label="Facility">
            <option value="">All facilities</option>
            {facilities.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 lg:ml-2">
          {report ? `${bucketLabel(report.range.from, 'day', true)} – ${bucketLabel(report.range.to, 'day', true)}` : ''}
        </p>
        <div className="flex gap-2 lg:ml-auto">
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} disabled={loading}
            className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 lg:flex-none">
            <RotateCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button type="button" onClick={() => report && exportCsv(report)} disabled={!report}
            className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 lg:flex-none">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {!report && loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />)}
        </div>
      ) : report && (
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {/* Headline numbers */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatTile icon={Package} label="Shipments created" value={int(t.created)} hint={`${int(t.open)} not yet delivered (now)`} tone="blue" />
            <StatTile icon={PackageCheck} label="Delivered" value={int(t.delivered)} hint="Delivered in this period" tone="green" />
            <StatTile icon={Timer} label="Avg. delivery time" value={t.avgDeliveryDays == null ? '—' : `${t.avgDeliveryDays} days`} hint="From creation to delivery" />
            <StatTile icon={Receipt} label="Billed" value={naira(t.billed)} hint="Cost of shipments created" />
            <StatTile icon={Wallet} label="Payments collected" value={naira(t.collected)} hint={`${int(t.paymentsCount)} payment${t.paymentsCount === 1 ? '' : 's'} received`} tone="green" />
            <StatTile icon={AlertCircle} label="Outstanding (now)" value={naira(t.outstanding)} hint={`${int(t.outstandingShipments)} shipment${t.outstandingShipments === 1 ? '' : 's'} with a balance`} tone={t.outstanding > 0 ? 'amber' : 'gray'} />
          </div>

          {/* Two single-series charts, each on its own axis */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SeriesChart
              title="Payments collected"
              subtitle={`Per ${granularity}, by payment date`}
              data={report.series}
              dataKey="collected"
              granularity={granularity}
              format={(v) => naira(v)}
              formatAxis={(v) => naira(v, true)}
            />
            <SeriesChart
              title="Shipments created"
              subtitle={`Per ${granularity}`}
              data={report.series}
              dataKey="created"
              granularity={granularity}
              format={(v) => `${int(v)} shipment${v === 1 ? '' : 's'}`}
              formatAxis={(v) => int(v)}
            />
          </div>

          {/* By facility */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">By facility</h2>
              <p className="text-xs text-gray-500">Outstanding and open are current totals; the rest are for the selected period</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-3">Facility</th>
                    <th className="px-3 py-3 text-right">Created</th>
                    <th className="px-3 py-3 text-right">Delivered</th>
                    <th className="px-3 py-3 text-right">Avg days</th>
                    <th className="px-3 py-3 text-right">Billed</th>
                    <th className="px-3 py-3 text-right">Collected</th>
                    <th className="px-3 py-3 text-right">Outstanding</th>
                    <th className="px-5 py-3 text-right">Open</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 tabular-nums">
                  {report.facilities.length === 0 && (
                    <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-500">No shipments for this selection.</td></tr>
                  )}
                  {report.facilities.map((f) => (
                    <tr key={f.facility} className="hover:bg-gray-50/80">
                      <td className="px-5 py-3 font-medium text-gray-900">{f.facility}</td>
                      <td className="px-3 py-3 text-right text-gray-700">{int(f.created)}</td>
                      <td className="px-3 py-3 text-right text-gray-700">{int(f.delivered)}</td>
                      <td className="px-3 py-3 text-right text-gray-700">{f.avgDeliveryDays ?? '—'}</td>
                      <td className="px-3 py-3 text-right text-gray-700">{naira(f.billed)}</td>
                      <td className="px-3 py-3 text-right text-gray-700">{naira(f.collected)}</td>
                      <td className={`px-3 py-3 text-right ${f.outstanding > 0 ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{naira(f.outstanding)}</td>
                      <td className="px-5 py-3 text-right text-gray-700">{int(f.open)}</td>
                    </tr>
                  ))}
                </tbody>
                {report.facilities.length > 0 && (
                  <tfoot className="border-t-2 border-gray-200 bg-gray-50/60 font-semibold tabular-nums text-gray-900">
                    <tr>
                      <td className="px-5 py-3">Total</td>
                      <td className="px-3 py-3 text-right">{int(t.created)}</td>
                      <td className="px-3 py-3 text-right">{int(t.delivered)}</td>
                      <td className="px-3 py-3 text-right">{t.avgDeliveryDays ?? '—'}</td>
                      <td className="px-3 py-3 text-right">{naira(t.billed)}</td>
                      <td className="px-3 py-3 text-right">{naira(t.collected)}</td>
                      <td className="px-3 py-3 text-right">{naira(t.outstanding)}</td>
                      <td className="px-5 py-3 text-right">{int(t.open)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
