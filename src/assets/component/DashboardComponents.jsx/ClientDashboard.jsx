import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Truck, PackageCheck, CircleDollarSign, PackageSearch, Plus, CalendarPlus, UserRound, ArrowRight, Package, ChevronRight,
} from 'lucide-react';
import { useProfile } from '@/assets/context-api/ProfileContext';
import { authGet, greeting, todayLabel, firstName, naira, int, relativeDays } from './dashboardData';
import { getStatusTone, isDelivered, makeStatusCanonicalizer, makeStatusLabeler, PAYMENT_BADGE } from '../shipments/shipmentStatusStyles';

const Skeleton = ({ className }) => <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />;

function Stat({ icon, label, value, hint, tone, loading }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        {loading ? <Skeleton className="mt-1 h-6 w-16" /> : <p className="truncate text-xl font-bold tabular-nums text-gray-900">{value}</p>}
        {hint && <p className="truncate text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}

function Shortcut({ icon, title, text, to }) {
  const Icon = icon;
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 group-hover:bg-green-100">
        <Icon size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="truncate text-xs text-gray-500">{text}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
    </Link>
  );
}

// Dashboard for clients and agents: their own shipments and shortcuts
export default function ClientDashboard() {
  const { currentUser, isAgent } = useProfile();
  const mine = useQuery({ queryKey: ['dash', 'myShipments'], queryFn: () => authGet('/shipments/my-shipments'), staleTime: 2 * 60 * 1000 });
  const statuses = useQuery({ queryKey: ['dash', 'statuses'], queryFn: () => authGet('/shipment-statuses'), staleTime: 10 * 60 * 1000 });
  const canonical = useMemo(() => makeStatusCanonicalizer(statuses.data || []), [statuses.data]);
  const label = useMemo(() => makeStatusLabeler(statuses.data || []), [statuses.data]);

  const list = useMemo(
    () => [...(mine.data || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [mine.data]
  );
  const open = list.filter((s) => !isDelivered(s.status)).length;
  const delivered = list.length - open;
  const balance = list.reduce((t, s) => t + (Number(s.cost) > 0 ? Math.max(0, Number(s.cost) - (Number(s.amountPaid) || 0)) : 0), 0);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#06660b] via-green-700 to-emerald-800 p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-amber-400/15" />
        <Truck size={120} strokeWidth={1.2} className="pointer-events-none absolute -bottom-4 right-6 hidden text-white/10 md:block" />
        <div className="relative">
          <p className="text-sm text-green-100">{todayLabel()}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{greeting()}, {firstName(currentUser?.name)}</h1>
          <p className="mt-1 max-w-xl text-sm text-green-100">
            {mine.data ? (open > 0
              ? <>You have <strong className="text-white">{open}</strong> shipment{open === 1 ? '' : 's'} on the way.</>
              : 'All your shipments have been delivered.') : 'Welcome back to your dashboard.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/app/trackshipment" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-green-800 shadow-sm hover:bg-green-50">
              <PackageSearch size={16} /> Track a shipment
            </Link>
            {isAgent && (
              <Link to="/app/account/createshipment" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 hover:bg-white/25">
                <Plus size={16} /> New shipment
              </Link>
            )}
            <Link to="/app/account/bookappointment" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 hover:bg-white/25">
              <CalendarPlus size={16} /> Book appointment
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat icon={Truck} tone="bg-green-100 text-green-700" label="On the way" value={int(open)} loading={mine.isLoading} />
        <Stat icon={PackageCheck} tone="bg-emerald-100 text-emerald-700" label="Delivered" value={int(delivered)} loading={mine.isLoading} />
        <Stat icon={CircleDollarSign} tone={balance > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'} label="Balance due"
          value={naira(balance)} hint={balance > 0 ? 'Across your shipments' : 'Nothing outstanding'} loading={mine.isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">My recent shipments</h2>
              <p className="text-xs text-gray-500">Latest first</p>
            </div>
            <Link to="/app/account/myshipments" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-50">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {mine.isLoading ? (
            <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : list.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"><Package size={22} /></span>
              <p className="text-sm font-semibold text-gray-900">No shipments yet</p>
              <p className="text-xs text-gray-500">Shipments sent in your name will appear here.</p>
            </div>
          ) : (
            <ul className="-mx-2 divide-y divide-gray-100">
              {list.slice(0, 5).map((sh) => {
                const tone = getStatusTone(canonical(sh.status));
                const pay = Number(sh.cost) > 0 ? (PAYMENT_BADGE[sh.paymentStatus] || PAYMENT_BADGE.unpaid) : null;
                return (
                  <li key={sh._id}>
                    <Link to={`/app/trackshipment?tracking=${encodeURIComponent(sh.trackingNumber)}`} className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-gray-50">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500"><Truck size={16} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[13px] font-semibold text-gray-900">{sh.trackingNumber}</p>
                        <p className="truncate text-xs text-gray-500">To {sh.recipientName || '—'} · {sh.destination || '—'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`inline-flex max-w-[150px] items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone.pill}`}>
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                          <span className="truncate">{label(canonical(sh.status))}</span>
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {pay && <span className={`mr-1.5 rounded px-1.5 py-0.5 font-medium ring-1 ring-inset ${pay.className}`}>{pay.label}</span>}
                          {relativeDays(sh.createdAt)}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="space-y-3 xl:col-span-2">
          <Shortcut icon={Package} title="My shipments" text="Details, invoices and waybills" to="/app/account/myshipments" />
          <Shortcut icon={PackageSearch} title="Track a shipment" text="Follow any tracking number" to="/app/trackshipment" />
          <Shortcut icon={CalendarPlus} title="Appointments" text="Book or view your appointments" to="/app/account/myappointments" />
          <Shortcut icon={UserRound} title="My profile" text="Contact details and password" to="/app/account/profile" />
        </div>
      </div>
    </div>
  );
}
