import React from 'react';
import { avatarTone, initials } from './quoteRequestUtils';

export default function QuoteAvatar({ name, size = 'h-10 w-10 text-sm' }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${size} ${avatarTone(name)}`}>
      {initials(name)}
    </span>
  );
}
