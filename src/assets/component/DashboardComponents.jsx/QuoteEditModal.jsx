import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const SHIPPING_TYPES = ['Air Freight', 'Sea Freight', 'Road Transport', 'Other'];
const STATUSES = [['new', 'New'], ['read', 'Read'], ['replied', 'Replied'], ['archived', 'Archived']];

// Edit a quote request's details (only the fields shown are sent)
export default function QuoteEditModal({ contact, saving, onSave, onClose }) {
  const [form, setForm] = useState({
    name: contact.name || '',
    email: contact.email || '',
    phoneNumber: contact.phoneNumber || '',
    shippingType: contact.shippingType || 'Air Freight',
    originCountry: contact.originCountry || '',
    destinationCountry: contact.destinationCountry || '',
    weight: contact.weight || '',
    length: contact.length || '',
    height: contact.height || '',
    message: contact.message || '',
    status: contact.status || 'new',
  });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !saving && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Name, email and message are required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onSave({ ...form, phoneNumber: form.phoneNumber || undefined }, { onError: setError });
  };

  const input = 'h-10 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';
  const Field = ({ label, children, wide }) => (
    <label className={`block space-y-1 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit quote request">
      <div className="absolute inset-0 bg-gray-900/50" onClick={() => !saving && onClose()} />
      <form onSubmit={submit} className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Edit quote request</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
          {Field({ label: 'Name', children: <input value={form.name} onChange={set('name')} className={input} /> })}
          {Field({ label: 'Email', children: <input type="email" value={form.email} onChange={set('email')} className={input} /> })}
          {Field({ label: 'Phone', children: <input value={form.phoneNumber} onChange={set('phoneNumber')} className={input} /> })}
          {Field({ label: 'Status', children: (
            <select value={form.status} onChange={set('status')} className={`${input} cursor-pointer`}>
              {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          ) })}
          {Field({ label: 'Shipping type', children: (
            <select value={form.shippingType} onChange={set('shippingType')} className={`${input} cursor-pointer`}>
              {SHIPPING_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          ) })}
          {Field({ label: 'Weight', children: <input value={form.weight} onChange={set('weight')} className={input} placeholder="e.g. 25" /> })}
          {Field({ label: 'From', children: <input value={form.originCountry} onChange={set('originCountry')} className={input} /> })}
          {Field({ label: 'To', children: <input value={form.destinationCountry} onChange={set('destinationCountry')} className={input} /> })}
          {Field({ label: 'Length', children: <input value={form.length} onChange={set('length')} className={input} /> })}
          {Field({ label: 'Height', children: <input value={form.height} onChange={set('height')} className={input} /> })}
          {Field({ label: 'Message', wide: true, children: (
            <textarea value={form.message} onChange={set('message')} rows={5} className={`${input} h-auto resize-y py-2.5`} />
          ) })}
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:col-span-2">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 cursor-pointer rounded-xl px-4 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
          <button type="submit" disabled={saving}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin" />} {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
