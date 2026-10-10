import React, { useEffect, useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import Avatar from './QuoteAvatar';

// Email reply to a quote request (sent by the backend; marks the request as replied)
export default function QuoteReplyModal({ contact, sending, onSend, onClose }) {
  const route = [contact.originCountry, contact.destinationCountry].filter(Boolean).join(' to ');
  const [subject, setSubject] = useState(`Re: Your ${contact.shippingType || 'shipping'} quote request${route ? ` (${route})` : ''}`);
  // The email template already adds the greeting, sign-off and their original message
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !sending && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, sending]);

  const submit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setError('Subject and message are required.');
      return;
    }
    setError('');
    onSend(subject.trim(), body.trim(), { onError: setError });
  };

  const input = 'w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Reply to ${contact.name}`}>
      <div className="absolute inset-0 bg-gray-900/50" onClick={() => !sending && onClose()} />
      <form onSubmit={submit} className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Reply by email</h2>
          <button type="button" onClick={onClose} disabled={sending} aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4 overflow-y-auto p-5">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">To</span>
            <Avatar name={contact.name} size="h-7 w-7 text-xs" />
            <span className="min-w-0 truncate text-sm text-gray-900">{contact.name} <span className="text-gray-500">&lt;{contact.email}&gt;</span></span>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-600">Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={`${input} h-10`} disabled={sending} />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-gray-600">Message</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={9} className={`${input} resize-y py-2.5 leading-relaxed`} disabled={sending} autoFocus
              placeholder="e.g. The cost to ship 30 kg by sea from Nigeria to the United States is ₦… and takes about … weeks." />
            <span className="block text-xs text-gray-500">The email adds &ldquo;Hi {contact.name},&rdquo; at the top and our sign-off and their original message at the bottom.</span>
          </label>
          {contact.message && (
            <details className="rounded-xl border border-gray-200 px-3 py-2 text-sm">
              <summary className="cursor-pointer text-xs font-medium text-gray-500">Their original message</summary>
              <p className="mt-2 whitespace-pre-wrap border-l-2 border-gray-200 pl-3 text-gray-600">{contact.message}</p>
            </details>
          )}
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button type="button" onClick={onClose} disabled={sending} className="h-10 cursor-pointer rounded-xl px-4 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
          <button type="submit" disabled={sending}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} {sending ? 'Sending…' : 'Send reply'}
          </button>
        </div>
      </form>
    </div>
  );
}
