import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Truck, AlertTriangle, PackageCheck, Wallet, CircleDollarSign, Plus, PackageSearch, BarChart3,
  ArrowRight, Users, FileText, CalendarDays, PartyPopper, Newspaper, ChevronRight,
} from 'lucide-react';
import { useProfile } from '@/assets/context-api/ProfileContext';
import { authGet, greeting, todayLabel, firstName, naira, int, relativeDays } from './dashboardData';
import { getStatusTone, makeStatusCanonicalizer, makeStatusLabeler, PAYMENT_BADGE } from '../shipments/shipmentStatusStyles';

const SERIES = '#2a78d6';
const GRID = '#e5e7eb';
const AXIS_TEXT = '#6b7280';
const STALE_MS = 2 * 60 * 1000;

// --- small building blocks -------------------------------------------------------
function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const ViewAll = ({ to, label = 'View all' }) => (
  <Link to={to} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-50">
    {label} <ArrowRight size={13} />
  </Link>
);

const Skeleton = ({ className }) => <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />;

function Kpi({ icon, label, value, hint, to, tone, loading }) {
  const Icon = icon;
  const tones = {
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    sky: 'bg-sky-100 text-sky-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <Link
      to={to}
      className="group relative flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone] || tones.gray}`}>
          <Icon size={18} />
        </span>
        <ChevronRight size={16} className="text-gray-300 transition-colors group-hover:text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        {loading ? <Skeleton className="mt-1.5 h-7 w-20" /> : (
          <p className="mt-0.5 truncate text-2xl font-bold tabular-nums text-gray-900">{value}</p>
        )}
        <p className="mt-0.5 truncate text-xs text-gray-500">{loading ? ' ' : hint}</p>
      </div>
    </Link>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = new Date(`${label}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const v = payload[0].value;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="text-gray-500">{d}</p>
      <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-gray-900">
        <span className="h-2 w-2 rounded-sm" style={{ background: SERIES }} />
        {v} shipment{v === 1 ? '' : 's'}
      </p>
    </div>
  );
}

function MiniTile({ icon, label, value, detail, to, badge, loading }) {
  const Icon = icon;
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 hover:bg-gray-50">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 group-hover:bg-white">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {loading ? <Skeleton className="mt-1 h-5 w-24" /> : (
          <p className="truncate text-sm text-gray-600">
            <span className="mr-1.5 text-lg font-bold tabular-nums text-gray-900">{value}</span>{detail}
          </p>
        )}
      </div>
      {!loading && badge}
    </Link>
  );
}

// --- page --------------------------------------------------------------------------
export default function StaffDashboard() {
  const { currentUser } = useProfile();

  const stats = useQuery({ queryKey: ['dash', 'shipmentStats'], queryFn: () => authGet('/shipments/stats'), staleTime: STALE_MS });
  const report = useQuery({ queryKey: ['dash', 'report30'], queryFn: () => authGet('/reports/shipments'), staleTime: STALE_MS });
  const recent = useQuery({ queryKey: ['dash', 'recent'], queryFn: () => authGet('/shipments', { page: 1, limit: 6 }), staleTime: STALE_MS });
  const statuses = useQuery({ queryKey: ['dash', 'statuses'], queryFn: () => authGet('/shipment-statuses'), staleTime: 10 * 60 * 1000 });
  const users = useQuery({ queryKey: ['dash', 'users'], queryFn: () => authGet('/profile/all'), staleTime: STALE_MS });
  const quotes = useQuery({ queryKey: ['dash', 'quotes'], queryFn: () => authGet('/contact'), staleTime: STALE_MS });
  const appts = useQuery({ queryKey: ['dash', 'appointments'], queryFn: () => authGet('/appointments'), staleTime: STALE_MS });
  const events = useQuery({ queryKey: ['dash', 'events'], queryFn: () => authGet('/events/admin/all'), staleTime: STALE_MS });
  const blogs = useQuery({ queryKey: ['dash', 'blogs'], queryFn: () => authGet('/blogs/admin/all'), staleTime: STALE_MS });

  const canonical = useMemo(() => makeStatusCanonicalizer(statuses.data || []), [statuses.data]);
  const label = useMemo(() => makeStatusLabeler(statuses.data || []), [statuses.data]);

  // Open shipments by stage (merging "In Transit"/"in-transit" etc.)
  const stages = useMemo(() => {
    const byKey = {};
    (stats.data?.byStatus || []).forEach(({ status, count }) => {
      const key = canonical(status) || 'unknown';
      byKey[key] = (byKey[key] || 0) + count;
    });
    return Object.entries(byKey).map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
  }, [stats.data, canonical]);

  const t = report.data?.totals;
  const s = stats.data;
  const oldestDays = s?.oldestOpenCreatedAt ? Math.floor((Date.now() - new Date(s.oldestOpenCreatedAt)) / 864e5) : 0;

  const roleCounts = useMemo(() => {
    const c = {};
    (users.data || []).forEach((u) => { c[u.role] = (c[u.role] || 0) + 1; });
    return c;
  }, [users.data]);
  const newQuotes = (quotes.data || []).filter((q) => (q.status || 'new') === 'new').length;
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const pendingAppts = (appts.data || []).filter((a) => a.status === 'pending').length;
  const upcomingAppts = (appts.data || []).filter((a) =>
    a.appointmentDate && new Date(a.appointmentDate) >= todayStart && !['cancelled', 'completed'].includes(a.status)).length;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#06660b] via-green-700 to-emerald-800 p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-amber-400/15" />
        <Truck size={120} strokeWidth={1.2} className="pointer-events-none absolute -bottom-4 right-6 hidden text-white/10 md:block" />
        <div className="relative">
          <p className="text-sm text-green-100">{todayLabel()}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting()}, {firstName(currentUser?.name)}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-green-100">
            {s ? (
              <>Here&apos;s where things stand: <strong className="text-white">{int(s.open)}</strong> shipment{s.open === 1 ? '' : 's'} in progress
              {s.stale > 0 && <>, <strong className="text-amber-300">{int(s.stale)}</strong> needing attention</>}.</>
            ) : 'Here’s where things stand today.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/app/account/createshipment" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-green-800 shadow-sm transition-colors hover:bg-green-50">
              <Plus size={16} /> New shipment
            </Link>
            <Link to="/app/trackshipment" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/25">
              <PackageSearch size={16} /> Track
            </Link>
            <Link to="/app/account/reports" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/25">
              <BarChart3 size={16} /> Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Logistics KPIs */}
      {/* 5 tiles: on 2-column phones the last one spans the row instead of sitting alone */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1">
        <Kpi icon={Truck} tone="green" label="In progress" to="/app/account/allshipments" loading={stats.isLoading}
          value={int(s?.open)} hint={`of ${int(s?.total)} shipments`} />
        <Kpi icon={AlertTriangle} tone={s?.stale ? 'amber' : 'gray'} label="Needs attention" to="/app/account/allshipments" loading={stats.isLoading}
          value={int(s?.stale)} hint={s?.stale ? `Oldest open ${oldestDays} days` : 'Nothing overdue'} />
        <Kpi icon={PackageCheck} tone="emerald" label="Delivered" to="/app/account/archived-shipments" loading={report.isLoading}
          value={int(t?.delivered)} hint="Last 30 days" />
        <Kpi icon={Wallet} tone="sky" label="Collected" to="/app/account/reports" loading={report.isLoading}
          value={naira(t?.collected)} hint={`${int(t?.paymentsCount)} payment${t?.paymentsCount === 1 ? '' : 's'} · 30 days`} />
        <Kpi icon={CircleDollarSign} tone={t?.outstanding > 0 ? 'rose' : 'gray'} label="Outstanding" to="/app/account/reports" loading={report.isLoading}
          value={naira(t?.outstanding)} hint={`${int(t?.outstandingShipments)} with a balance`} />
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3" title="Shipments created" subtitle="Per day, last 30 days" action={<ViewAll to="/app/account/reports" label="Reports" />}>
          {report.isLoading ? <Skeleton className="h-56" /> : !report.data?.series?.some((d) => d.created) ? (
            <div className="flex h-56 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">No shipments created in the last 30 days</div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.data.series} margin={{ top: 4, right: 4, bottom: 0, left: -12 }} barCategoryGap={2}>
                  <CartesianGrid vertical={false} stroke={GRID} />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: AXIS_TEXT }} axisLine={{ stroke: GRID }} tickLine={false} minTickGap={20}
                    tickFormatter={(b) => new Date(`${b}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: AXIS_TEXT }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} content={<ChartTooltip />} />
                  <Bar dataKey="created" fill={SERIES} radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="xl:col-span-2" title="Open shipments by stage" subtitle={s ? `${int(s.open)} not yet delivered` : ' '} action={<ViewAll to="/app/account/allshipments" />}>
          {stats.isLoading ? (
            <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-8" />)}</div>
          ) : stages.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 text-sm text-gray-500">
              <PackageCheck size={22} className="text-emerald-500" /> Every shipment has been delivered
            </div>
          ) : (
            <ul className="space-y-3">
              {stages.slice(0, 7).map(({ key, count }) => (
                <li key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex min-w-0 items-center gap-2 text-gray-700">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${getStatusTone(key).dot}`} />
                      <span className="truncate">{label(key)}</span>
                    </span>
                    <span className="font-semibold tabular-nums text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${getStatusTone(key).dot}`} style={{ width: `${Math.max(4, (count / s.open) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Recent + business */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3" title="Recent shipments" subtitle="Latest created" action={<ViewAll to="/app/account/allshipments" />}>
          {recent.isLoading ? (
            <div className="space-y-3">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (recent.data?.items || []).length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No shipments yet.</p>
          ) : (
            <ul className="-mx-2 divide-y divide-gray-100">
              {recent.data.items.map((sh) => {
                const tone = getStatusTone(canonical(sh.status));
                const pay = Number(sh.cost) > 0 ? (PAYMENT_BADGE[sh.paymentStatus] || PAYMENT_BADGE.unpaid) : null;
                return (
                  <li key={sh._id} className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-gray-50">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                      <Truck size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[13px] font-semibold text-gray-900">{sh.trackingNumber}</p>
                      <p className="truncate text-xs text-gray-500">{sh.senderName || '—'} → {sh.recipientName || '—'}</p>
                    </div>
                    <div className="hidden flex-col items-end gap-1 sm:flex">
                      <span className={`inline-flex max-w-[170px] items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone.pill}`}>
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                        <span className="truncate">{label(canonical(sh.status))}</span>
                      </span>
                      {pay && <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${pay.className}`}>{pay.label}</span>}
                    </div>
                    <span className="w-20 shrink-0 text-right text-xs text-gray-500">{relativeDays(sh.createdAt)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="xl:col-span-2" title="Across the business">
          <div className="space-y-2">
            <MiniTile icon={FileText} label="Quote requests" to="/app/account/contactformresponses" loading={quotes.isLoading}
              value={int(quotes.data?.length)} detail="total"
              badge={newQuotes > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">{newQuotes} new</span>} />
            <MiniTile icon={CalendarDays} label="Appointments" to="/app/account/allappointments" loading={appts.isLoading}
              value={int(appts.data?.length)} detail={`· ${int(upcomingAppts)} upcoming`}
              badge={pendingAppts > 0 && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">{pendingAppts} pending</span>} />
            <MiniTile icon={Users} label="Users" to="/app/account/allusers" loading={users.isLoading}
              value={int(users.data?.length)}
              detail={`· ${int(roleCounts.client)} clients · ${int((roleCounts.admin || 0) + (roleCounts.employee || 0) + (roleCounts.agent || 0))} staff`} />
            <MiniTile icon={PartyPopper} label="Events" to="/app/account/allevents" loading={events.isLoading}
              value={int(events.data?.length)} detail="events" />
            <MiniTile icon={Newspaper} label="Blog posts" to="/app/account/allblogpost" loading={blogs.isLoading}
              value={int(blogs.data?.length)} detail="posts" />
          </div>
        </Card>
      </div>
    </div>
  );
}
