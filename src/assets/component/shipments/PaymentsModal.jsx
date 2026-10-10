import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Wallet, Trash2, Loader2, Plus } from 'lucide-react';
import { API_BASE_URL } from '../../../config/Api';
import { formatNaira, PAYMENT_BADGE } from './shipmentStatusStyles';

const METHODS = [
  ['cash', 'Cash'],
  ['bank-transfer', 'Bank transfer'],
  ['pos', 'POS'],
  ['card', 'Card'],
  ['other', 'Other'],
];
const methodLabel = (m) => METHODS.find(([v]) => v === m)?.[1] || 'Other';
const today = () => new Date().toISOString().slice(0, 10);

export default function PaymentsModal({ shipment: initialShipment, token, isAdmin, onUpdated, onClose }) {
  const [shipment, setShipment] = useState(initialShipment);
  const cost = Number(shipment.cost) || 0;
  const paid = Number(shipment.amountPaid) || 0;
  const balance = Math.max(0, Math.round((cost - paid) * 100) / 100);
  const status = shipment.paymentStatus || 'unpaid';
  const badge = PAYMENT_BADGE[status];

  const [form, setForm] = useState({
    amount: balance > 0 ? String(balance) : '',
    method: 'bank-transfer',
    reference: '',
    note: '',
    paidAt: today(),
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const payments = useMemo(
    () => [...(shipment.payments || [])].sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt)),
    [shipment.payments]
  );

  const authHeaders = { headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` } };

  const applyUpdate = (updated) => {
    setShipment(updated);
    onUpdated?.(updated);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a payment amount greater than zero');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/shipments/${shipment._id}/payments`, { ...form, amount }, authHeaders);
      applyUpdate(res.data);
      const newBalance = Math.max(0, (Number(res.data.cost) || 0) - (Number(res.data.amountPaid) || 0));
      setForm((f) => ({ ...f, amount: newBalance > 0 ? String(newBalance) : '', reference: '', note: '' }));
      toast.success(`Payment of ${formatNaira(amount)} recorded`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (payment) => {
    if (!window.confirm(`Remove the ${formatNaira(payment.amount)} payment? Only do this if it was recorded in error.`)) return;
    setDeletingId(payment._id);
    try {
      const res = await axios.delete(`${API_BASE_URL}/shipments/${shipment._id}/payments/${payment._id}`, authHeaders);
      applyUpdate(res.data);
      toast.success('Payment removed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove payment');
    } finally {
      setDeletingId(null);
    }
  };

  const fullyPaid = cost > 0 && balance <= 0;
  const input = 'h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 pr-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <Wallet size={20} />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
          <p className="font-mono text-xs text-gray-500">{shipment.trackingNumber}</p>
        </div>
        <span className={`ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Shipment cost', cost > 0 ? formatNaira(cost) : 'Not set', 'text-gray-900'],
          ['Paid', formatNaira(paid), 'text-green-700'],
          ['Balance due', formatNaira(balance), balance > 0 ? 'text-rose-600' : 'text-gray-900'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
            <p className={`mt-1 text-sm font-bold tabular-nums sm:text-base ${color}`}>{value}</p>
          </div>
        ))}
      </div>
      {cost <= 0 && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          This shipment has no cost set. Add the cost with Edit so the balance can be tracked.
        </p>
      )}

      {/* History */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Payment history</h4>
        {payments.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">No payments recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
            {payments.map((p) => (
              <li key={p._id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold tabular-nums text-gray-900">{formatNaira(p.amount)}</p>
                  <p className="truncate text-xs text-gray-500">
                    {new Date(p.paidAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{methodLabel(p.method)}
                    {p.reference ? ` · Ref ${p.reference}` : ''}
                    {p.note ? ` · ${p.note}` : ''}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    disabled={deletingId === p._id}
                    title="Remove payment (admin)"
                    aria-label="Remove payment"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  >
                    {deletingId === p._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Record payment */}
      {fullyPaid ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">This shipment is fully paid.</p>
      ) : (
        <form onSubmit={handleAdd} className="space-y-3 rounded-xl border border-gray-200 p-4">
          <h4 className="text-sm font-semibold text-gray-900">Record a payment</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-medium text-gray-600">
              Amount (₦)
              <input type="number" min="0.01" step="0.01" required value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} className={input} />
            </label>
            <label className="space-y-1 text-xs font-medium text-gray-600">
              Method
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={`${input} cursor-pointer`}>
                {METHODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs font-medium text-gray-600">
              Date received
              <input type="date" value={form.paidAt} max={today()}
                onChange={(e) => setForm({ ...form, paidAt: e.target.value })} className={input} />
            </label>
            <label className="space-y-1 text-xs font-medium text-gray-600">
              Reference (optional)
              <input type="text" value={form.reference} placeholder="e.g. transfer reference"
                onChange={(e) => setForm({ ...form, reference: e.target.value })} className={input} />
            </label>
          </div>
          <label className="block space-y-1 text-xs font-medium text-gray-600">
            Note (optional)
            <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={input} />
          </label>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="h-10 cursor-pointer rounded-xl px-4 text-sm font-medium text-gray-600 hover:bg-gray-100">
              Close
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Record payment
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
