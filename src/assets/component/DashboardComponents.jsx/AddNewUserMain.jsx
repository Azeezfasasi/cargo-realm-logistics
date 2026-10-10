import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Loader2, Wand2, Check, ShieldAlert, Mail, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../../../config/Api';
import { useProfile } from '../../context-api/ProfileContext';
import PasswordField from './PasswordField';
import { ROLES, STAFF_ROLES, assignableRoles, generatePassword } from './userUtils';

const input = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';
const EMPTY = { name: '', email: '', password: '', role: 'client', gender: '', phoneNumber: '', homeAddress: '', country: '', state: '' };

function AddNewUserMain() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isEmployee, isLoading: authLoading } = useProfile();
  const hasPermission = isAuthenticated && (isAdmin || isEmployee);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === 'object' && v?.target ? v.target.value : v }));
  const roles = assignableRoles(isAdmin);

  const addUser = useMutation({
    mutationFn: async (data) => (await axios.post(`${API_BASE_URL}/profile/register`, data)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      toast.success(`${data?.user?.name || 'User'} added as ${ROLES[data?.user?.role]?.label || 'client'}`);
      navigate('/app/account/allusers');
    },
    onError: (err) => setError(err?.response?.data?.message || 'Failed to add user. Please try again.'),
  });

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError('Name, email and password are required.');
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Please enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    const payload = Object.fromEntries(Object.entries({ ...form, name: form.name.trim(), email: form.email.trim() }).filter(([, v]) => v !== ''));
    addUser.mutate(payload);
  };

  if (authLoading) return <div className="p-4 lg:p-6"><div className="h-96 animate-pulse rounded-2xl bg-gray-100" /></div>;
  if (!hasPermission) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><ShieldAlert size={22} /></span>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Access restricted</h2>
          <p className="mt-1 text-sm text-gray-500">Only administrators and employees can add users.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 p-4 lg:p-6">
      <div>
        <Link to="/app/account/allusers" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800">
          <ArrowLeft size={15} /> All users
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">Add user</h1>
        <p className="mt-1 text-sm text-gray-500">Create an account and choose what they can access.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {/* Account */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Account</h2>
            <p className="mb-4 text-xs text-gray-500">Used to sign in.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-gray-600">Full name <span className="text-rose-500">*</span></span>
                <input value={form.name} onChange={set('name')} className={input} autoComplete="off" placeholder="e.g. Adaeze Okafor" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-gray-600">Email <span className="text-rose-500">*</span></span>
                <input type="email" value={form.email} onChange={set('email')} className={input} autoComplete="off" placeholder="name@example.com" />
              </label>
              <div className="sm:col-span-2">
                <PasswordField
                  id="new-user-password"
                  label={<>Password <span className="text-rose-500">*</span></>}
                  value={form.password}
                  onChange={set('password')}
                  showStrength
                  placeholder="At least 6 characters"
                  action={
                    <button type="button" onClick={() => set('password')(generatePassword())}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800">
                      <Wand2 size={13} /> Generate
                    </button>
                  }
                />
                <p className="mt-1.5 text-xs text-gray-500">Share it with them securely; they can change it later from My Profile.</p>
              </div>
            </div>
          </section>

          {/* Role */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Role</h2>
            <p className="mb-4 text-xs text-gray-500">{isAdmin ? 'Controls what they can see and do.' : 'Employees can add clients and agents. Ask an admin for staff accounts.'}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Role">
              {roles.map((r) => {
                const selected = form.role === r;
                return (
                  <button key={r} type="button" role="radio" aria-checked={selected} onClick={() => set('role')(r)}
                    className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors ${selected ? 'border-green-500 bg-green-50/60 ring-2 ring-green-500/20' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}>
                      {selected && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        {ROLES[r].label}{STAFF_ROLES.includes(r) && <ShieldCheck size={14} className="text-violet-600" />}
                      </span>
                      <span className="block text-xs text-gray-500">{ROLES[r].description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Contact &amp; location</h2>
            <p className="mb-4 text-xs text-gray-500">Optional.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-gray-600">Phone</span>
                <input value={form.phoneNumber} onChange={set('phoneNumber')} className={input} placeholder="+234…" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-gray-600">Gender</span>
                <select value={form.gender} onChange={set('gender')} className={`${input} cursor-pointer`}>
                  <option value="">Not specified</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label className="block space-y-1.5 sm:col-span-2">
                <span className="text-xs font-medium text-gray-600">Address</span>
                <input value={form.homeAddress} onChange={set('homeAddress')} className={input} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-gray-600">Country</span>
                <input value={form.country} onChange={set('country')} className={input} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-gray-600">State / Province</span>
                <input value={form.state} onChange={set('state')} className={input} />
              </label>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="xl:col-span-1">
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-[85px]">
            <h2 className="text-sm font-semibold text-gray-900">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-gray-500">Name</dt><dd className="truncate font-medium text-gray-900">{form.name || '—'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-gray-500">Email</dt><dd className="truncate font-medium text-gray-900">{form.email || '—'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-gray-500">Role</dt><dd>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${ROLES[form.role].badge}`}>{ROLES[form.role].label}</span>
              </dd></div>
            </dl>
            <p className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <Mail size={14} className="mt-0.5 shrink-0 text-gray-400" /> They&apos;ll get a welcome email at this address.
            </p>
            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <button type="submit" disabled={addUser.isPending}
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-60">
              {addUser.isPending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {addUser.isPending ? 'Creating…' : 'Create user'}
            </button>
            <Link to="/app/account/allusers" className="block text-center text-sm font-medium text-gray-500 hover:text-gray-800">Cancel</Link>
          </div>
        </aside>
      </div>
    </form>
  );
}

export default AddNewUserMain;
