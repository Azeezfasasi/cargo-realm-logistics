import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Truck, AlertTriangle, PackageCheck, Clock, ChevronRight, X } from 'lucide-react';
import { daysSince, getStatusTone, formatStatus, STALE_AFTER_DAYS } from './shipmentStatusStyles';

function StatCard({ icon, label, value, hint, accent, onClick, active, to }) {
  const Icon = icon;
  const base = `group relative flex items-start gap-4 rounded-2xl border bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
    active ? 'border-amber-400 ring-2 ring-amber-200' : 'border-gray-200'
  }`;
  const content = (
    <>
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon size={20} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        <span className="mt-1 block text-2xl font-bold text-gray-900 tabular-nums">{value}</span>
        <span className="mt-0.5 block text-xs text-gray-500">{hint}</span>
      </span>
      {(onClick || to) && (
        <ChevronRight size={16} className="absolute right-4 top-5 text-gray-300 transition-colors group-hover:text-gray-500" />
      )}
    </>
  );
  if (to) return <Link to={to} className={base}>{content}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={`${base} cursor-pointer`}>{content}</button>;
  return <div className={base}>{content}</div>;
}

// stats comes from GET /api/shipments/stats (counts across all shipments, not just one page)
export default function InProgressSummary({
  stats: serverStats, selectedStatus, onStatusSelect, staleOnly, onToggleStale,
  canonicalStatus = (s) => String(s || '').trim().toLowerCase(), // groups 'In Transit' with 'in-transit'
  statusLabel = formatStatus,
}) {
  const stats = useMemo(() => {
    const byStatus = {};
    (serverStats?.byStatus || []).forEach(({ status, count }) => {
      const key = canonicalStatus(status) || 'unknown';
      byStatus[key] = (byStatus[key] || 0) + count;
    });
    const stages = Object.entries(byStatus)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
    return {
      open: serverStats?.open || 0,
      delivered: serverStats?.delivered || 0,
      stale: serverStats?.stale || 0,
      oldest: serverStats?.oldestOpenCreatedAt ? daysSince(serverStats.oldestOpenCreatedAt) : 0,
      stages,
    };
  }, [serverStats, canonicalStatus]);

  const total = serverStats?.total || 0;
  const openPct = total ? Math.round((stats.open / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Hero card: in-progress shipments */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-600 via-green-700 to-emerald-800 p-5 text-white shadow-lg shadow-green-900/10">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-white/5" />
          <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-200 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-100" />
            </span>
            In Progress
          </div>
          <div className="relative mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold tabular-nums">{stats.open}</span>
            <span className="mb-1 text-sm text-green-100">not yet delivered</span>
          </div>
          <div className="relative mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${openPct}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-green-100">{openPct}% of {total} total shipments</p>
          </div>
          <Truck size={56} className="pointer-events-none absolute bottom-3 right-3 text-white/10" />
        </div>

        <StatCard
          icon={AlertTriangle}
          label="Needs Attention"
          value={stats.stale}
          hint={staleOnly ? 'Showing only these · click to clear' : `Open for more than ${STALE_AFTER_DAYS} days`}
          accent={stats.stale ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}
          onClick={stats.stale || staleOnly ? onToggleStale : undefined}
          active={staleOnly}
        />
        <StatCard
          icon={Clock}
          label="Oldest Open"
          value={`${stats.oldest} ${stats.oldest === 1 ? 'day' : 'days'}`}
          hint="Longest time without delivery"
          accent="bg-sky-100 text-sky-700"
        />
        <StatCard
          icon={PackageCheck}
          label="Delivered"
          value={stats.delivered}
          hint="View delivered shipments"
          accent="bg-emerald-100 text-emerald-700"
          to="/app/account/archived-shipments"
        />
      </div>

      {/* Stage breakdown of in-progress shipments */}
      {stats.open > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Where open shipments are</h2>
              <p className="text-xs text-gray-500">Click a stage to filter the table</p>
            </div>
            {selectedStatus && (
              <button
                type="button"
                onClick={() => onStatusSelect('')}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                <X size={12} /> Clear stage filter
              </button>
            )}
          </div>

          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            {stats.stages.map(({ status, count }) => (
              <div
                key={status}
                title={`${statusLabel(status)}: ${count}`}
                className={`${getStatusTone(status).dot} h-full transition-opacity ${
                  selectedStatus && selectedStatus !== status ? 'opacity-30' : ''
                }`}
                style={{ width: `${(count / stats.open) * 100}%` }}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {stats.stages.map(({ status, count }) => {
              const tone = getStatusTone(status);
              const active = selectedStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusSelect(active ? '' : status)}
                  className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
                  <span className="truncate">{statusLabel(status)}</span>
                  <span className={`rounded-full px-1.5 tabular-nums ${active ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
