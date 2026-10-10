import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  Search, X, RotateCw, Inbox, ArrowRight, Reply, ChevronLeft, ChevronRight, ShieldAlert,
} from 'lucide-react';
import { API_BASE_URL } from '../../../config/Api';
import { useProfile } from '../../context-api/ProfileContext';
import ContactFormDetailModal from './ContactFormDetailModal';
import QuoteReplyModal from './QuoteReplyModal';
import QuoteEditModal from './QuoteEditModal';
import Avatar from './QuoteAvatar';
import { QUOTE_STATUS, shippingIcon, relativeTime, formatWeight } from './quoteRequestUtils';

const PAGE_SIZE = 10;
const QUERY_KEY = ['allContactForms'];

const TABS = [['all', 'All'], ['new', 'New'], ['read', 'Read'], ['replied', 'Replied'], ['archived', 'Archived']];

const apiError = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

function ContactFormResponsesMain() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isAdmin, isEmployee, isLoading: authLoading } = useProfile();
  const hasPermission = isAuthenticated && (isAdmin || isEmployee);

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);

  const { data: contacts = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/contact`);
      return response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    staleTime: 60 * 1000,
    enabled: hasPermission,
  });

  // Keep repliedBy (populated by the list endpoint) when merging an updated record
  const mergeLocal = (updated) =>
    queryClient.setQueryData(QUERY_KEY, (list = []) =>
      list.map((c) => (c._id === updated._id ? { ...c, ...updated, repliedBy: c.repliedBy && typeof updated.repliedBy === 'string' ? c.repliedBy : updated.repliedBy ?? c.repliedBy } : c)));

  const updateMutation = useMutation({
    mutationFn: async ({ id, changes }) => (await axios.put(`${API_BASE_URL}/contact/${id}`, changes)).data,
    onSuccess: (updated) => mergeLocal(updated),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`${API_BASE_URL}/contact/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData(QUERY_KEY, (list = []) => list.filter((c) => c._id !== id));
      toast.success('Quote request deleted');
    },
    onError: (err) => toast.error(apiError(err, 'Failed to delete quote request')),
  });
  const replyMutation = useMutation({
    mutationFn: async ({ id, subject, replyContent }) =>
      (await axios.post(`${API_BASE_URL}/contact/${id}/reply`, { subject, replyContent })).data,
    onSuccess: () => {
      toast.success('Reply sent');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY }); // picks up repliedBy/repliedAt
    },
  });

  const setStatus = (contact, status, { silent = false } = {}) => {
    updateMutation.mutate(
      { id: contact._id, changes: { status } },
      {
        onSuccess: () => !silent && toast.success(`Marked as ${QUOTE_STATUS[status].label.toLowerCase()}`),
        onError: (err) => toast.error(apiError(err, 'Failed to update status')),
      }
    );
  };

  // Opening a new request marks it as read
  const openContact = (contact) => {
    setOpenId(contact._id);
    if ((contact.status || 'new') === 'new') setStatus(contact, 'read', { silent: true });
  };

  const handleDelete = (contact) => {
    if (!window.confirm(`Delete the quote request from ${contact.name}? This cannot be undone.`)) return;
    deleteMutation.mutate(contact._id);
    if (openId === contact._id) setOpenId(null);
  };

  const counts = useMemo(() => {
    const c = { all: contacts.length, new: 0, read: 0, replied: 0, archived: 0 };
    contacts.forEach((x) => { c[x.status || 'new'] = (c[x.status || 'new'] || 0) + 1; });
    return c;
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (tab !== 'all' && (c.status || 'new') !== tab) return false;
      if (!q) return true;
      return [c.name, c.email, c.phoneNumber, c.message, c.originCountry, c.destinationCountry, c.shippingType]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [contacts, tab, search]);

  useEffect(() => setPage(1), [tab, search]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const openContactObj = contacts.find((c) => c._id === openId) || null;

  if (authLoading) {
    return <div className="space-y-4 p-4 lg:p-6">{[0, 1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />)}</div>;
  }

  if (!hasPermission) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><ShieldAlert size={22} /></span>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Access restricted</h2>
          <p className="mt-1 text-sm text-gray-500">Only administrators and employees can manage quote requests.</p>
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
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Customers</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">Quote Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            {counts.new > 0 ? <><strong className="text-gray-900">{counts.new}</strong> new request{counts.new === 1 ? '' : 's'} waiting for a response.</> : 'You’re all caught up.'}
          </p>
        </div>
        <button type="button" onClick={() => refetch()} disabled={isFetching}
          className="inline-flex h-10 cursor-pointer items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-60 sm:self-auto">
          <RotateCw size={15} className={isFetching ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Tabs + search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Filter by status">
          {TABS.map(([key, label]) => {
            const active = tab === key;
            return (
              <button key={key} type="button" role="tab" aria-selected={active} onClick={() => setTab(key)}
                className={`inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
                  active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {key !== 'all' && <span className={`h-2 w-2 rounded-full ${QUOTE_STATUS[key].dot}`} />}
                {label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>{counts[key] || 0}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block lg:ml-auto lg:w-80">
          <span className="sr-only">Search quote requests</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, route, message…"
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-9 text-sm focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20" />
          {search && (
            <button type="button" onClick={() => setSearch('')} aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"><X size={14} /></button>
          )}
        </label>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="divide-y divide-gray-100">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="flex gap-3 p-4"><div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" /><div className="flex-1 space-y-2"><div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" /><div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" /></div></div>)}</div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-rose-600">Couldn&apos;t load quote requests: {apiError(error, 'Unknown error')}</div>
        ) : pageItems.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"><Inbox size={26} /></span>
            <p className="mt-4 text-sm font-semibold text-gray-900">{search || tab !== 'all' ? 'No matching quote requests' : 'No quote requests yet'}</p>
            <p className="mt-1 text-xs text-gray-500">{search || tab !== 'all' ? 'Try another filter or search.' : 'Requests from the website will appear here.'}</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pageItems.map((c) => {
              const status = QUOTE_STATUS[c.status || 'new'] || QUOTE_STATUS.new;
              const isNew = (c.status || 'new') === 'new';
              const ShipIcon = shippingIcon(c.shippingType);
              const route = [c.originCountry, c.destinationCountry].filter(Boolean);
              return (
                <li key={c._id} className={`group relative ${openId === c._id ? 'bg-green-50/60' : 'hover:bg-gray-50/80'}`}>
                  {isNew && <span className="absolute inset-y-0 left-0 w-1 bg-amber-400" aria-hidden="true" />}
                  <button type="button" onClick={() => openContact(c)} className="flex w-full cursor-pointer items-start gap-3 p-4 pr-24 text-left sm:pr-28">
                    <Avatar name={c.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className={`truncate text-sm ${isNew ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>{c.name}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${status.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />{status.label}
                        </span>
                      </div>
                      <p className="truncate text-xs text-gray-500">{c.email}{c.phoneNumber ? ` · ${c.phoneNumber}` : ''}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1">
                          <ShipIcon size={13} className="text-gray-500" />
                          {c.shippingType || 'Shipment'}
                        </span>
                        {route.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1">
                            {c.originCountry || '—'} <ArrowRight size={12} className="text-gray-400" /> {c.destinationCountry || '—'}
                          </span>
                        )}
                        {c.weight && <span className="rounded-lg bg-gray-100 px-2 py-1">{formatWeight(c.weight)}</span>}
                      </div>
                      {c.message && <p className={`mt-2 line-clamp-2 text-sm ${isNew ? 'text-gray-700' : 'text-gray-500'}`}>{c.message}</p>}
                    </div>
                  </button>
                  <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
                    <span className="whitespace-nowrap text-xs text-gray-500" title={new Date(c.createdAt).toLocaleString()}>{relativeTime(c.createdAt)}</span>
                    {c.email && (
                      <button type="button" onClick={() => setReplyTo(c)}
                        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:border-green-300 hover:text-green-700">
                        <Reply size={13} /> Reply
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
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

      {openContactObj && (
        <ContactFormDetailModal
          contact={openContactObj}
          isAdmin={isAdmin}
          onClose={() => setOpenId(null)}
          onReply={() => setReplyTo(openContactObj)}
          onEdit={() => setEditing(openContactObj)}
          onDelete={() => handleDelete(openContactObj)}
          onSetStatus={(status) => setStatus(openContactObj, status)}
          busy={updateMutation.isPending}
        />
      )}

      {replyTo && (
        <QuoteReplyModal
          contact={replyTo}
          sending={replyMutation.isPending}
          onClose={() => setReplyTo(null)}
          onSend={(subject, replyContent, { onError }) =>
            replyMutation.mutate({ id: replyTo._id, subject, replyContent }, { onError: (err) => onError(apiError(err, 'Failed to send reply')) })}
        />
      )}

      {editing && (
        <QuoteEditModal
          contact={editing}
          saving={updateMutation.isPending}
          onClose={() => setEditing(null)}
          onSave={(changes, { onError }) =>
            updateMutation.mutate({ id: editing._id, changes }, {
              onSuccess: () => { toast.success('Quote request updated'); setEditing(null); },
              onError: (err) => onError(apiError(err, 'Failed to update quote request')),
            })}
        />
      )}
    </div>
  );
}

export default ContactFormResponsesMain;
