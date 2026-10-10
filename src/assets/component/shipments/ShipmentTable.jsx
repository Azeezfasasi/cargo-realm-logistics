import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pencil, Mail, Eye, Trash2, RefreshCcw, QrCode, Receipt, ScrollText, Wallet, Paperclip, MoreHorizontal, ArrowRight, MapPin, Building2, PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { isDelivered, daysSince, getStatusTone, formatStatus, STALE_AFTER_DAYS, PAYMENT_BADGE } from './shipmentStatusStyles';

const ITEMS_PER_PAGE = 10;

// Most-used actions stay visible; the rest live in the "More" menu
const PRIMARY_ACTIONS = [
  { type: 'print', label: 'View / print', icon: Eye, hover: 'hover:bg-violet-50 hover:text-violet-600' },
  { type: 'status', label: 'Change status', icon: RefreshCcw, hover: 'hover:bg-amber-50 hover:text-amber-600' },
  { type: 'edit', label: 'Edit shipment', icon: Pencil, hover: 'hover:bg-sky-50 hover:text-sky-600' },
  { type: 'payments', label: 'Payments', icon: Wallet, hover: 'hover:bg-green-50 hover:text-green-700' },
];
const MENU_ACTIONS = [
  { type: 'invoice', label: 'Invoice', icon: Receipt },
  { type: 'waybill', label: 'Waybill', icon: ScrollText },
  { type: 'documents', label: 'Documents', icon: Paperclip },
  { type: 'qr', label: 'QR code', icon: QrCode },
  { type: 'reply', label: 'Send email', icon: Mail },
  { type: 'delete', label: 'Delete', icon: Trash2, danger: true },
];

// Rendered with position: fixed so the table's scroll container can't clip it
function ActionsMenu({ anchor, actions, onPick, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onClose, true);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onClose, true);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  const menuHeight = actions.length * 36 + 8;
  const openUp = anchor.bottom + menuHeight > window.innerHeight - 8;
  const style = {
    position: 'fixed',
    right: Math.max(8, window.innerWidth - anchor.right),
    top: openUp ? Math.max(8, anchor.top - menuHeight - 4) : anchor.bottom + 4,
  };

  return (
    <div ref={ref} role="menu" style={style} className="z-50 w-44 rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
      {actions.map(({ type, label, icon, danger }) => {
        const Icon = icon;
        return (
          <button
            key={type}
            type="button"
            role="menuitem"
            onClick={() => onPick(type)}
            className={`flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors ${
              danger ? 'text-rose-600 hover:bg-rose-50' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={15} className={danger ? '' : 'text-gray-400'} /> {label}
          </button>
        );
      })}
    </div>
  );
}

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
  const menuActions = canDelete ? MENU_ACTIONS : MENU_ACTIONS.filter((a) => a.type !== 'delete');
  const [menu, setMenu] = useState(null); // { shipment, anchor: DOMRect }
  const closeMenu = useCallback(() => setMenu(null), []);
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
                    {(Number(shipment.cost) > 0 || Number(shipment.amountPaid) > 0) && (
                      <span className={`mt-1.5 flex w-fit items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${(PAYMENT_BADGE[shipment.paymentStatus] || PAYMENT_BADGE.unpaid).className}`}>
                        {(PAYMENT_BADGE[shipment.paymentStatus] || PAYMENT_BADGE.unpaid).label}
                      </span>
                    )}
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
                      {PRIMARY_ACTIONS.map(({ type, label, icon, hover }) => {
                        const ActionIcon = icon;
                        return (
                          <button
                            key={type}
                            type="button"
                            title={label}
                            aria-label={label}
                            onClick={() => onActionClick(shipment, type)}
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors ${hover}`}
                          >
                            <ActionIcon size={16} />
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        title="More actions"
                        aria-label="More actions"
                        aria-haspopup="menu"
                        aria-expanded={menu?.shipment._id === shipment._id}
                        onClick={(e) => {
                          const anchor = e.currentTarget.getBoundingClientRect();
                          setMenu((m) => (m?.shipment._id === shipment._id ? null : { shipment, anchor }));
                        }}
                        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-100 hover:text-gray-700 ${
                          menu?.shipment._id === shipment._id ? 'bg-gray-100 text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        <MoreHorizontal size={16} />
                      </button>
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

      {menu && (
        <ActionsMenu
          anchor={menu.anchor}
          actions={menuActions}
          onClose={closeMenu}
          onPick={(type) => {
            const { shipment } = menu;
            setMenu(null);
            onActionClick(shipment, type);
          }}
        />
      )}

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
