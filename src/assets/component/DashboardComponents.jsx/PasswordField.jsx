import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { passwordStrength } from './userUtils';

// Password input with show/hide and an optional strength meter
export default function PasswordField({ id, label, value, onChange, showStrength = false, autoComplete = 'new-password', placeholder, action }) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(value);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-gray-600">{label}</label>
        {action}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-3 pr-11 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {showStrength && value && (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? strength.bar : 'bg-gray-200'}`} />
            ))}
          </div>
          <span className="w-16 text-right text-xs text-gray-500">{strength.label}</span>
        </div>
      )}
    </div>
  );
}
