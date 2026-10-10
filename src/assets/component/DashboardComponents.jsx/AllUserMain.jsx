import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus, Search, X, RotateCw, Users, ShieldCheck, Briefcase, UserRound, UserX, MoreHorizontal, Pencil,
  KeyRound, PauseCircle, PlayCircle, Ban, CheckCircle2, Trash2, ChevronLeft, ChevronRight, ShieldAlert, Phone, MapPin,
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/Api';
import { useProfile } from '../../context-api/ProfileContext';
import UserAvatar from './UserAvatar';
import UserEditModal from './UserEditModal';
import { ROLES, STAFF_ROLES, accountStatus, canManage, joinedLabel } from './userUtils';

const PAGE_SIZE = 15;
const QUERY_KEY = ['allUsers'];
const ROLE_TABS = [['all', 'All'], ['admin', 'Admins'], ['employee', 'Employees'], ['agent', 'Agents'], ['client', 'Clients']];
const apiError = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

function Stat({ icon, label, value, tone }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={18} /></span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-xl font-bold tabular-nums text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Row actions menu, fixed-positioned so the table's scroll area can't clip it
function RowMenu({ anchor, items, onClose }) {
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
  const height = items.length * 38 + 8;
  const openUp = anchor.bottom + height > window.innerHeight - 8;
  return (
    <div ref={ref} role="menu" className="fixed z-50 w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
      style={{ right: Math.max(8, window.innerWidth - anchor.right), top: openUp ? Math.max(8, anchor.top - height - 4) : anchor.bottom + 4 }}>
      {items.map(({ label, icon, onClick, danger }) => {
        const Icon = icon;
        return (
          <button key={label} type="button" role="menuitem" onClick={onClick}
            className={`flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-sm ${danger ? 'text-rose-600 hover:bg-rose-50' : 'text-gray-700 hover:bg-gray-100'}`}>
            <Icon size={15} className={danger ? '' : 'text-gray-400'} /> {label}
          </button>
        );
      })}
    </div>
  );
}

function AllUserMain() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isEmployee, isLoading: authLoading, currentUser } = useProfile();
  const hasPermission = isAuthenticated && (isAdmin || isEmployee);

  const [roleTab, setRoleTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [menu, setMenu] = useState(null); // { user, anchor }
  const closeMenu = useCallback(() => setMenu(null), []);

  const { data: users = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => (await axios.get(`${API_BASE_URL}/profile/all`)).data,
    staleTime: 60 * 1000,
    enabled: hasPermission,
  });

  const replaceUser = (updated) =>
    queryClient.setQueryData(QUERY_KEY, (list = []) => list.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)));

  const editMutation = useMutation({
    mutationFn: async ({ id, changes }) => (await axios.put(`${API_BASE_URL}/profile/edit/${id}`, changes)).data,
    onSuccess: (updated) => replaceUser(updated),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`${API_BASE_URL}/profile/delete/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData(QUERY_KEY, (list = []) => list.filter((u) => u._id !== id));
      toast.success('User deleted');
    },
    onError: (err) => toast.error(apiError(err, 'Failed to delete user')),
  });

  const setFlag = (user, changes, message) => {
    editMutation.mutate({ id: user._id, changes }, {
      onSuccess: () => toast.success(message),
      onError: (err) => toast.error(apiError(err, 'Failed to update user')),
    });
  };

  const menuItems = (u) => {
    const items = [
      { label: 'Edit details', icon: Pencil, onClick: () => { closeMenu(); setEditing(u); } },
      { label: 'Change password', icon: KeyRound, onClick: () => navigate(`/app/account/changeuserpassword?email=${encodeURIComponent(u.email)}`) },
      u.isSuspended
        ? { label: 'Unsuspend', icon: PlayCircle, onClick: () => { closeMenu(); setFlag(u, { isSuspended: false }, `${u.name} unsuspended`); } }
        : { label: 'Suspend', icon: PauseCircle, onClick: () => { closeMenu(); if (window.confirm(`Suspend ${u.name}? They won't be able to log in until unsuspended.`)) setFlag(u, { isSuspended: true }, `${u.name} suspended`); } },
      u.isDisabled
        ? { label: 'Enable account', icon: CheckCircle2, onClick: () => { closeMenu(); setFlag(u, { isDisabled: false }, `${u.name} enabled`); } }
        : { label: 'Disable account', icon: Ban, onClick: () => { closeMenu(); if (window.confirm(`Disable ${u.name}'s account? They won't be able to log in.`)) setFlag(u, { isDisabled: true }, `${u.name} disabled`); } },
    ];
    if (isAdmin) {
      items.push({ label: 'Delete user', icon: Trash2, danger: true, onClick: () => {
        closeMenu();
        if (window.confirm(`Permanently delete ${u.name} (${u.email})? This cannot be undone.`)) deleteMutation.mutate(u._id);
      } });
    }
    return items;
  };

  const counts = useMemo(() => {
    const c = { all: users.length, admin: 0, employee: 0, agent: 0, client: 0, inactive: 0 };
    users.forEach((u) => {
      c[u.role] = (c[u.role] || 0) + 1;
      if (u.isDisabled || u.isSuspended) c.inactive += 1;
    });
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleTab !== 'all' && u.role !== roleTab) return false;
      if (statusFilter !== 'all' && accountStatus(u).key !== statusFilter) return false;
      if (!q) return true;
      return [u.name, u.email, u.phoneNumber, u.country, u.state].some((v) => v?.toLowerCase().includes(q));
    });
  }, [users, roleTab, statusFilter, search]);

  useEffect(() => setPage(1), [roleTab, statusFilter, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (authLoading) {
    return <div className="space-y-4 p-4 lg:p-6">{[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />)}</div>;
  }
  if (!hasPermission) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><ShieldAlert size={22} /></span>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Access restricted</h2>
          <p className="mt-1 text-sm text-gray-500">Only administrators and employees can manage users.</p>
          <Link to="/app/dashboard" className="mt-5 inline-flex h-10 items-center rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Administration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage accounts, roles and access.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => refetch()} disabled={isFetching}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-60">
            <RotateCw size={15} className={isFetching ? 'animate-spin' : ''} /> <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link to="/app/account/addnewuser"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
            <UserPlus size={16} /> Add user
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Users} label="Total users" value={isLoading ? '—' : counts.all} tone="bg-green-100 text-green-700" />
        <Stat icon={UserRound} label="Clients" value={isLoading ? '—' : counts.client} tone="bg-gray-100 text-gray-600" />
        <Stat icon={Briefcase} label="Staff & agents" value={isLoading ? '—' : counts.admin + counts.employee + counts.agent} tone="bg-sky-100 text-sky-700" />
        <Stat icon={UserX} label="Suspended / disabled" value={isLoading ? '—' : counts.inactive} tone={counts.inactive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm xl:flex-row xl:items-center">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Filter by role">
          {ROLE_TABS.map(([key, label]) => {
            const active = roleTab === key;
            return (
              <button key={key} type="button" role="tab" aria-selected={active} onClick={() => setRoleTab(key)}
                className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{counts[key] || 0}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row xl:ml-auto">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status"
            className="h-10 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 sm:w-40">
            <option value="all">Any status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="disabled">Disabled</option>
          </select>
          <label className="relative block sm:w-72">
            <span className="sr-only">Search users</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, country…"
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-9 text-sm focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20" />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"><X size={14} /></button>
            )}
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && [0, 1, 2, 3, 4].map((i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-10 animate-pulse rounded-lg bg-gray-100" /></td></tr>
              ))}
              {isError && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-rose-600">Couldn&apos;t load users: {apiError(error, 'Unknown error')}</td></tr>
              )}
              {!isLoading && !isError && pageItems.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-14 text-center">
                  <p className="text-sm font-semibold text-gray-900">No users found</p>
                  <p className="mt-1 text-xs text-gray-500">Try another filter or search.</p>
                </td></tr>
              )}
              {pageItems.map((u) => {
                const role = ROLES[u.role] || ROLES.client;
                const status = accountStatus(u);
                const isMe = String(u._id) === String(currentUser?._id);
                const manageable = canManage({ actorIsAdmin: isAdmin, actorId: currentUser?._id, target: u });
                return (
                  <tr key={u._id} className="hover:bg-gray-50/80">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={u} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 truncate font-semibold text-gray-900">
                            <span className="truncate">{u.name}</span>
                            {isMe && <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-green-800">You</span>}
                          </p>
                          <p className="truncate text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${role.badge}`}>
                        {STAFF_ROLES.includes(u.role) && <ShieldCheck size={12} />}{role.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">
                      {u.phoneNumber ? <p className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" />{u.phoneNumber}</p> : <p className="text-gray-400">No phone</p>}
                      {(u.country || u.state) && <p className="mt-0.5 flex items-center gap-1.5"><MapPin size={12} className="text-gray-400" />{[u.state, u.country].filter(Boolean).join(', ')}</p>}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${status.pill}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />{status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-500">{joinedLabel(u.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {isMe ? (
                          <Link to="/app/account/profile" className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-50">My profile</Link>
                        ) : manageable ? (
                          <>
                            <button type="button" onClick={() => setEditing(u)} title="Edit" aria-label={`Edit ${u.name}`}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-sky-50 hover:text-sky-600"><Pencil size={15} /></button>
                            <button type="button" aria-label={`More actions for ${u.name}`} aria-haspopup="menu"
                              onClick={(e) => { const anchor = e.currentTarget.getBoundingClientRect(); setMenu((m) => (m?.user._id === u._id ? null : { user: u, anchor })); }}
                              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-700 ${menu?.user._id === u._id ? 'bg-gray-100 text-gray-700' : 'text-gray-400'}`}>
                              <MoreHorizontal size={16} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400" title="Only an admin can manage staff accounts">Admin only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{(page - 1) * PAGE_SIZE + 1}</span>–<span className="font-semibold text-gray-700">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span>
            </p>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={14} /> Prev</button>
              <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {menu && <RowMenu anchor={menu.anchor} items={menuItems(menu.user)} onClose={closeMenu} />}

      {editing && (
        <UserEditModal
          user={editing}
          actorIsAdmin={isAdmin}
          saving={editMutation.isPending}
          onClose={() => setEditing(null)}
          onSave={(changes, { onError }) => editMutation.mutate({ id: editing._id, changes }, {
            onSuccess: () => { toast.success('User updated'); setEditing(null); },
            onError: (err) => onError(apiError(err, 'Failed to update user')),
          })}
        />
      )}
    </div>
  );
}

export default AllUserMain;
