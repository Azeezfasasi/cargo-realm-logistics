// Shared helpers for the Users pages (All Users, Add User, Change Password)

export const ROLES = {
  admin: { label: 'Admin', badge: 'bg-violet-50 text-violet-700 ring-violet-600/20', description: 'Full access, including staff accounts and settings' },
  employee: { label: 'Employee', badge: 'bg-sky-50 text-sky-700 ring-sky-600/20', description: 'Manages shipments, customers and content' },
  agent: { label: 'Agent', badge: 'bg-amber-50 text-amber-800 ring-amber-600/20', description: 'Creates and tracks shipments for customers' },
  client: { label: 'Client', badge: 'bg-gray-50 text-gray-700 ring-gray-500/20', description: 'Tracks their own shipments and appointments' },
};

export const STAFF_ROLES = ['admin', 'employee'];

// Roles the current user may assign: admins any, employees only client/agent (matches the API)
export const assignableRoles = (actorIsAdmin) => (actorIsAdmin ? ['client', 'agent', 'employee', 'admin'] : ['client', 'agent']);

// Whether the current user may manage (edit/suspend/reset password for) a target user
export const canManage = ({ actorIsAdmin, actorId, target }) => {
  if (!target) return false;
  if (String(target._id) === String(actorId)) return false; // own account: use My Profile
  return actorIsAdmin || !STAFF_ROLES.includes(target.role);
};

export const accountStatus = (u) => {
  if (u?.isDisabled) return { key: 'disabled', label: 'Disabled', pill: 'bg-rose-50 text-rose-700 ring-rose-600/20', dot: 'bg-rose-500' };
  if (u?.isSuspended) return { key: 'suspended', label: 'Suspended', pill: 'bg-amber-50 text-amber-800 ring-amber-600/20', dot: 'bg-amber-500' };
  return { key: 'active', label: 'Active', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' };
};

// 0-4 score with a label, for the password strength meter
export const passwordStrength = (pw = '') => {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1;
  if (pw.length < 6) score = 0;
  const levels = [
    { label: 'Too short', bar: 'bg-rose-500' },
    { label: 'Weak', bar: 'bg-rose-500' },
    { label: 'Fair', bar: 'bg-amber-500' },
    { label: 'Good', bar: 'bg-emerald-500' },
    { label: 'Strong', bar: 'bg-emerald-600' },
  ];
  return { score, ...levels[score] };
};

// Random password that is easy to read aloud (no 0/O, 1/l/I)
export const generatePassword = (length = 12) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => chars[v % chars.length]).join('');
};

export const joinedLabel = (date) =>
  date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
