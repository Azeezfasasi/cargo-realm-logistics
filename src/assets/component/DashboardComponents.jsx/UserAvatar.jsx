import React, { useState } from 'react';
import { avatarTone, initials } from './quoteRequestUtils';

// Profile photo when there is one, otherwise coloured initials
export default function UserAvatar({ user, size = 'h-10 w-10 text-sm' }) {
  const [broken, setBroken] = useState(false);
  if (user?.profileImageUrl && !broken) {
    return <img src={user.profileImageUrl} alt="" onError={() => setBroken(true)} className={`${size} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${size} ${avatarTone(user?.name || user?.email || '')}`}>
      {initials(user?.name || user?.email || '?')}
    </span>
  );
}
