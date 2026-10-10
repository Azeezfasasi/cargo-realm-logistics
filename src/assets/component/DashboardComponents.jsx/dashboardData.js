// Shared helpers for the dashboard page
import axios from 'axios';
import { API_BASE_URL } from '../../../config/Api';

export const authGet = async (path, params) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please log in again.');
  const res = await axios.get(`${API_BASE_URL}${path}`, { headers: { Authorization: `Bearer ${token}` }, params });
  return res.data;
};

export const greeting = () => {
  // Lagos time (UTC+1), so the greeting matches the office
  const hour = (new Date().getUTCHours() + 1) % 24;
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const todayLabel = () =>
  new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' });

export const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'there';

export const naira = (n, compact = false) =>
  `₦${(Number(n) || 0).toLocaleString('en-NG', compact
    ? { notation: 'compact', maximumFractionDigits: 1 }
    : { maximumFractionDigits: 0 })}`;

export const int = (n) => (Number(n) || 0).toLocaleString('en-NG');

export const relativeDays = (date) => {
  if (!date) return '';
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 864e5);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
