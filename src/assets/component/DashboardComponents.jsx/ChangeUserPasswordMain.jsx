import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, KeyRound, Loader2, Wand2, Copy, Search, X, ShieldAlert, Mail, Check } from 'lucide-react';
import { API_BASE_URL } from '../../../config/Api';
import { useProfile } from '../../context-api/ProfileContext';
import PasswordField from './PasswordField';
import UserAvatar from './UserAvatar';
import { ROLES, canManage, generatePassword } from './userUtils';

function ChangeUserPasswordMain() {
  const { isAuthenticated, isAdmin, isEmployee, isLoading: authLoading, currentUser } = useProfile();
  const hasPermission = isAuthenticated && (isAdmin || isEmployee);
  const [searchParams] = useSearchParams();

  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(null); // { name, email } after success
  const pickerRef = useRef(null);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => (await axios.get(`${API_BASE_URL}/profile/all`)).data,
    staleTime: 60 * 1000,
    enabled: hasPermission,
  });

  // Only users this person may reset (admins: anyone but themselves; employees: clients and agents)
  const eligible = useMemo(
    () => users.filter((u) => canManage({ actorIsAdmin: isAdmin, actorId: currentUser?._id, target: u })),
    [users, isAdmin, currentUser?._id]
  );

  // Preselect from ?email= (e.g. coming from All Users)
  useEffect(() => {
    const email = searchParams.get('email');
    if (email && !selected && eligible.length) {
      const match = eligible.find((u) => u.email?.toLowerCase() === email.toLowerCase());
      if (match) setSelected(match);
    }
  }, [searchParams, eligible, selected]);

  useEffect(() => {
    if (!listOpen) return undefined;
    const close = (e) => { if (!pickerRef.current?.contains(e.target)) setListOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [listOpen]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? eligible.filter((u) => [u.name, u.email].some((v) => v?.toLowerCase().includes(q))) : eligible;
    return list.slice(0, 8);
  }, [eligible, query]);

  const change = useMutation({
    mutationFn: async (data) => (await axios.patch(`${API_BASE_URL}/profile/admin/change-password`, data)).data,
    onSuccess: () => {
      toast.success(`Password changed for ${selected.name}`);
      setDone({ name: selected.name, email: selected.email, password });
      setConfirm('');
    },
    onError: (err) => setError(err?.response?.data?.message || 'Failed to change password. Please try again.'),
  });

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!selected) return setError('Choose the user whose password you want to change.');
    if (password.length < 6) return setError('The new password must be at least 6 characters.');
    if (password !== confirm) return setError('The passwords don’t match.');
    change.mutate({ email: selected.email, newPassword: password });
  };

  const applyGenerated = () => {
    const pw = generatePassword();
    setPassword(pw);
    setConfirm(pw);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied');
    } catch {
      toast.error('Couldn’t copy; select and copy it manually');
    }
  };

  if (authLoading) return <div className="p-4 lg:p-6"><div className="h-80 animate-pulse rounded-2xl bg-gray-100" /></div>;
  if (!hasPermission) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><ShieldAlert size={22} /></span>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Access restricted</h2>
          <p className="mt-1 text-sm text-gray-500">Only administrators and employees can change other users&apos; passwords.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <div>
        <Link to="/app/account/allusers" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800">
          <ArrowLeft size={15} /> All users
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">Change password</h1>
        <p className="mt-1 text-sm text-gray-500">Set a new password for a user who can&apos;t sign in.</p>
      </div>

      <div className="max-w-2xl">
        {done ? (
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Check size={22} /></span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Password changed</h2>
            <p className="mt-1 text-sm text-gray-500">{done.name} ({done.email}) can now sign in with the new password. We&apos;ve emailed them to let them know it changed.</p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3">
              <code className="flex-1 truncate font-mono text-sm text-gray-900">{done.password}</code>
              <button type="button" onClick={() => copy(done.password)} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Copy size={13} /> Copy</button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Share it securely. It won&apos;t be shown again after you leave this page.</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => { setDone(null); setSelected(null); setPassword(''); setQuery(''); }}
                className="h-10 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">Change another</button>
              <Link to="/app/account/allusers" className="inline-flex h-10 items-center rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">Back to users</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            {/* User picker */}
            <div className="space-y-1.5" ref={pickerRef}>
              <span className="text-xs font-medium text-gray-600">User</span>
              {selected ? (
                <div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50/50 p-3">
                  <UserAvatar user={selected} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{selected.name}</p>
                    <p className="truncate text-xs text-gray-500">{selected.email}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${(ROLES[selected.role] || ROLES.client).badge}`}>{(ROLES[selected.role] || ROLES.client).label}</span>
                  <button type="button" onClick={() => { setSelected(null); setListOpen(true); }} aria-label="Choose a different user"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-gray-700"><X size={16} /></button>
                </div>
              ) : (
                <div className="relative">
                  <Search size={16} className="pointer-events-none absolute left-3 top-[22px] -translate-y-1/2 text-gray-400" />
                  <input value={query} onChange={(e) => { setQuery(e.target.value); setListOpen(true); }} onFocus={() => setListOpen(true)}
                    placeholder={usersLoading ? 'Loading users…' : 'Search by name or email'} aria-label="Search users"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                  {listOpen && !usersLoading && (
                    <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg" role="listbox">
                      {matches.length === 0 ? (
                        <li className="px-3 py-3 text-sm text-gray-500">No matching users{!isAdmin ? ' (employees can reset clients and agents only)' : ''}</li>
                      ) : matches.map((u) => (
                        <li key={u._id}>
                          <button type="button" role="option" aria-selected="false" onClick={() => { setSelected(u); setListOpen(false); setError(''); }}
                            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-gray-50">
                            <UserAvatar user={u} size="h-8 w-8 text-xs" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-gray-900">{u.name}</span>
                              <span className="block truncate text-xs text-gray-500">{u.email}</span>
                            </span>
                            <span className="text-xs text-gray-400">{(ROLES[u.role] || ROLES.client).label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <PasswordField id="admin-new-password" label="New password" value={password} onChange={setPassword} showStrength placeholder="At least 6 characters"
              action={<button type="button" onClick={applyGenerated} className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800"><Wand2 size={13} /> Generate</button>} />
            <PasswordField id="admin-confirm-password" label="Confirm new password" value={confirm} onChange={setConfirm} placeholder="Type it again" />
            {confirm && password !== confirm && <p className="-mt-3 text-xs text-rose-600">Passwords don&apos;t match yet.</p>}

            <p className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
              <Mail size={14} className="mt-0.5 shrink-0 text-gray-400" />
              The user is emailed that their password was changed by an administrator. Their current sessions stay signed in.
            </p>
            {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

            <div className="flex justify-end gap-2">
              <Link to="/app/account/allusers" className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</Link>
              <button type="submit" disabled={change.isPending}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60">
                {change.isPending ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                {change.isPending ? 'Changing…' : 'Change password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChangeUserPasswordMain;
