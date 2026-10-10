import React, { useEffect } from 'react';
import { X, Mail, Phone, Reply, Archive, ArchiveRestore, Pencil, Trash2, MailOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import Avatar from './QuoteAvatar';
import { QUOTE_STATUS, shippingIcon, relativeTime, formatWeight } from './quoteRequestUtils';

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">{value || <span className="text-gray-400">—</span>}</dd>
    </div>
  );
}

// Slide-over panel with the full quote request and its actions
export default function ContactFormDetailModal({ contact, isAdmin, onClose, onReply, onEdit, onDelete, onSetStatus, busy }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!contact) return null;
  const statusKey = contact.status || 'new';
  const status = QUOTE_STATUS[statusKey] || QUOTE_STATUS.new;
  const ShipIcon = shippingIcon(contact.shippingType);
  const dims = [contact.length, contact.width, contact.height].filter(Boolean);
  const btn = 'inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label={`Quote request from ${contact.name}`}>
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-gray-100 p-5">
          <Avatar name={contact.name} size="h-12 w-12 text-base" />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-gray-900">{contact.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${status.pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />{status.label}
              </span>
              <span title={new Date(contact.createdAt).toLocaleString()}>Received {relativeTime(contact.createdAt)}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* Contact */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <a href={`mailto:${contact.email}`} className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:border-green-300 hover:text-green-700">
              <Mail size={15} className="shrink-0 text-gray-400" /><span className="truncate">{contact.email}</span>
            </a>
            {contact.phoneNumber ? (
              <a href={`tel:${contact.phoneNumber}`} className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:border-green-300 hover:text-green-700">
                <Phone size={15} className="shrink-0 text-gray-400" /><span className="truncate">{contact.phoneNumber}</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-3 py-2.5 text-sm text-gray-400"><Phone size={15} /> No phone number</span>
            )}
          </div>

          {/* Shipment */}
          <section className="rounded-2xl bg-gray-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-green-700 shadow-xs"><ShipIcon size={16} /></span>
              <h3 className="text-sm font-semibold text-gray-900">{contact.shippingType || 'Shipment'} quote</h3>
            </div>
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-white p-3 shadow-xs">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">From</p>
                <p className="truncate text-sm font-semibold text-gray-900">{contact.originCountry || '—'}</p>
              </div>
              <ArrowRight size={18} className="shrink-0 text-green-600" />
              <div className="min-w-0 flex-1 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">To</p>
                <p className="truncate text-sm font-semibold text-gray-900">{contact.destinationCountry || '—'}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <Detail label="Weight" value={formatWeight(contact.weight)} />
              <Detail label="Dimensions" value={dims.length ? dims.join(' × ') : ''} />
            </dl>
          </section>

          {/* Message */}
          <section>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Message</h3>
            <p className="whitespace-pre-wrap rounded-2xl border border-gray-200 p-4 text-sm leading-relaxed text-gray-800">{contact.message || '—'}</p>
          </section>

          {/* Reply info */}
          {contact.repliedAt && (
            <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>
                Replied {relativeTime(contact.repliedAt)}
                {contact.repliedBy?.name ? <> by <strong>{contact.repliedBy.name}</strong></> : ''}
                <span className="block text-xs text-emerald-700/80">{new Date(contact.repliedAt).toLocaleString()}</span>
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 border-t border-gray-100 p-4">
          <button type="button" onClick={onReply} disabled={!contact.email}
            className={`${btn} w-full bg-green-600 font-semibold text-white hover:bg-green-700`}>
            <Reply size={16} /> {statusKey === 'replied' ? 'Send another reply' : 'Reply by email'}
          </button>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {statusKey === 'archived' ? (
              <button type="button" disabled={busy} onClick={() => onSetStatus('read')} className={`${btn} border border-gray-200 text-gray-700 hover:bg-gray-50`}>
                <ArchiveRestore size={15} /> Restore
              </button>
            ) : (
              <button type="button" disabled={busy} onClick={() => onSetStatus('archived')} className={`${btn} border border-gray-200 text-gray-700 hover:bg-gray-50`}>
                <Archive size={15} /> Archive
              </button>
            )}
            <button type="button" disabled={busy || statusKey === 'new'} onClick={() => onSetStatus('new')} className={`${btn} border border-gray-200 text-gray-700 hover:bg-gray-50`} title="Mark as new">
              <MailOpen size={15} /> Unread
            </button>
            <button type="button" onClick={onEdit} className={`${btn} border border-gray-200 text-gray-700 hover:bg-gray-50`}>
              <Pencil size={15} /> Edit
            </button>
            {isAdmin && (
              <button type="button" onClick={onDelete} className={`${btn} border border-rose-200 text-rose-600 hover:bg-rose-50`}>
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
