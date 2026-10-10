import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { ROLES, assignableRoles } from './userUtils';

const input = 'h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

export default function UserEditModal({ user, actorIsAdmin, saving, onSave, onClose }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'client',
    gender: user.gender || '',
    phoneNumber: user.phoneNumber || '',
    homeAddress: user.homeAddress || '',
    country: user.country || '',
    state: user.state || '',
  });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const roles = assignableRoles(actorIsAdmin);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !saving && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return setError('Name and email are required.');
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Please enter a valid email address.');
    setError('');
    onSave({ ...form, name: form.name.trim(), email: form.email.trim() }, { onError: setError });
  };

  const field = (label, control, wide) => (
    <label className={`block space-y-1 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs font-medium text-gray-600">{label}</span>
      {control}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Edit ${user.name}`}>
      <div className="absolute inset-0 bg-gray-900/50" onClick={() => !saving && onClose()} />
      <form onSubmit={submit} className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <UserAvatar user={user} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-gray-900">Edit {user.name}</h2>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
          {field('Full name', <input value={form.name} onChange={set('name')} className={input} />)}
          {field('Email', <input type="email" value={form.email} onChange={set('email')} className={input} />)}
          {field('Role', (
            <select value={form.role} onChange={set('role')} className={`${input} cursor-pointer`}>
              {/* keep the current role selectable even if this user couldn't assign it */}
              {[...new Set([form.role, ...roles])].map((r) => <option key={r} value={r}>{ROLES[r]?.label || r}</option>)}
            </select>
          ))}
          {field('Gender', (
            <select value={form.gender} onChange={set('gender')} className={`${input} cursor-pointer`}>
              <option value="">Not specified</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              {form.gender && !['male', 'female'].includes(form.gender) && <option value={form.gender}>{form.gender}</option>}
            </select>
          ))}
          {field('Phone', <input value={form.phoneNumber} onChange={set('phoneNumber')} className={input} />)}
          {field('Country', <input value={form.country} onChange={set('country')} className={input} />)}
          {field('State / Province', <input value={form.state} onChange={set('state')} className={input} />)}
          {field('Address', <input value={form.homeAddress} onChange={set('homeAddress')} className={input} />)}
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
