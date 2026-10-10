import React, { useEffect, useState } from 'react';
import { Pencil, Mail, Eye, Trash2, RefreshCcw, QrCode, ArrowRight, MapPin, Building2, PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { isDelivered, daysSince, getStatusTone, formatStatus, STALE_AFTER_DAYS } from './shipmentStatusStyles';

const ITEMS_PER_PAGE = 10;

const ACTIONS = [
  { type: 'qr', label: 'QR code', icon: QrCode, hover: 'hover:bg-indigo-50 hover:text-indigo-600' },
  { type: 'print', label: 'View / print', icon: Eye, hover: 'hover:bg-violet-50 hover:text-violet-600' },
  { type: 'edit', label: 'Edit shipment', icon: Pencil, hover: 'hover:bg-sky-50 hover:text-sky-600' },
  { type: 'reply', label: 'Send email', icon: Mail, hover: 'hover:bg-emerald-50 hover:text-emerald-600' },
  { type: 'status', label: 'Change status', icon: RefreshCcw, hover: 'hover:bg-amber-50 hover:text-amber-600' },
  { type: 'delete', label: 'Delete', icon: Trash2, hover: 'hover:bg-rose-50 hover:text-rose-600', danger: true },
];

function AgeBadge({ days }) {
  const tone =
    days > STALE_AFTER_DAYS ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
    : days > 7 ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
    : 'bg-gray-50 text-gray-600 ring-gray-500/20';
  const label = days === 0 ? 'Today' : `${days} ${days === 1 ? 'day' : 'days'}`;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset tabular-nums ${tone}`}>
      {label}
    </span>
  );
}

export default function ShipmentTable({ shipments, onActionClick, canDelete = true, selectedShipments = [], onSelectShipment, onSelectAll }) {
  const actions = canDelete ? ACTIONS : ACTIONS.filter((a) => a.type !== 'delete');
  const [currentPage, setCurrentPage] = useState(1);

  // Delivered shipments live on the Delivered Shipments page
  const visibleShipments = shipments.filter((s) => !isDelivered(s.status));

  const totalPages = Math.ceil(visibleShipments.length / ITEMS_PER_PAGE) || 1;

  // Jump back to page 1 whenever the filtered list changes size
  useEffect(() => {
    setCurrentPage(1);
  }, [visibleShipments.length]);

  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = visibleShipments.slice(start, start + ITEMS_PER_PAGE);

  const allPagedSelected = paginated.length > 0 && paginated.every((s) => selectedShipments.includes(s._id));
  const somePagedSelected = paginated.some((s) => selectedShipments.includes(s._id)) && !allPagedSelected;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">In-progress shipments</h2>
          <p className="text-xs text-gray-500">Shipments that have not been marked as delivered</p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 tabular-nums">
          {visibleShipments.length} open
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="w-12 px-5 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all on this page"
                  checked={allPagedSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = somePagedSelected;
                  }}
                  onChange={(e) => onSelectAll?.(e.target.checked, paginated.map((s) => s._id))}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-green-600"
                />
              </th>
              <th className="px-3 py-3">Shipment</th>
              <th className="whitespace-nowrap px-3 py-3">Sender → Receiver</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Route</th>
              <th className="whitespace-nowrap px-3 py-3">Open for</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((shipment, idx) => {
              const selected = selectedShipments.includes(shipment._id);
              const tone = getStatusTone(shipment.status);
              const days = daysSince(shipment.createdAt);
              return (
                <tr
                  key={shipment._id}
                  className={`group transition-colors duration-150 ${selected ? 'bg-green-50/70' : 'hover:bg-gray-50/80'}`}
                >
                  <td className="px-5 py-4 align-top">
                    <input
                      type="checkbox"
                      aria-label={`Select ${shipment.trackingNumber}`}
                      checked={selected}
                      onChange={(e) => onSelectShipment?.(shipment._id, e.target.checked)}
                      className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 accent-green-600"
                    />
                  </td>
                  <td className="px-3 py-4 align-top">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 tabular-nums">{start + idx + 1}.</span>
                      <span className="font-mono text-[13px] font-semibold tracking-tight text-gray-900">
                        {shipment.trackingNumber}
                      </span>
                    </div>
                    <div className="mt-1 pl-5 text-xs text-gray-500">
                      {shipment.createdAt
                        ? new Date(shipment.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </div>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <div className="max-w-[220px]">
                      <div className="truncate font-medium text-gray-900" title={shipment.senderName}>
                        {shipment.senderName || '—'}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                        <ArrowRight size={12} className="shrink-0 text-gray-400" />
                        <span className="truncate" title={shipment.recipientName}>{shipment.recipientName || '—'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <span
                      className={`inline-flex max-w-[200px] items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone.pill}`}
                      title={formatStatus(shipment.status)}
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                      <span className="truncate">{formatStatus(shipment.status)}</span>
                    </span>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <div className="max-w-[220px] space-y-1 text-xs">
                      <div className="flex items-start gap-1.5 text-gray-700">
                        <MapPin size={13} className="mt-0.5 shrink-0 text-gray-400" />
                        <span className="line-clamp-2">{shipment.destination || '—'}</span>
                      </div>
                      {shipment.shipmentFacility && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Building2 size={13} className="shrink-0 text-gray-400" />
                          <span className="truncate">{shipment.shipmentFacility}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <AgeBadge days={days} />
                  </td>
                  <td className="px-3 py-4 align-top">
                    <div className="flex items-center justify-end gap-0.5">
                      {actions.map(({ type, label, icon, hover, danger }) => {
                        const ActionIcon = icon;
                        return (
                          <button
                            key={type}
                            type="button"
                            title={label}
                            aria-label={label}
                            onClick={() => onActionClick(shipment, type)}
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                              danger ? 'text-rose-400' : 'text-gray-400'
                            } ${hover}`}
                          >
                            <ActionIcon size={16} />
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16">
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <PackageSearch size={26} />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-gray-900">No in-progress shipments found</p>
                    <p className="mt-1 text-xs text-gray-500">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 sm:flex-row">
        <p className="text-xs text-gray-500">
          {visibleShipments.length > 0 ? (
            <>
              Showing <span className="font-semibold text-gray-700">{start + 1}</span>–
              <span className="font-semibold text-gray-700">{start + paginated.length}</span> of{' '}
              <span className="font-semibold text-gray-700">{visibleShipments.length}</span>
            </>
          ) : 'No results'}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setCurrentPage(page - 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="px-1 text-xs text-gray-500 tabular-nums">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setCurrentPage(page + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
