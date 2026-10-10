import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useProfile } from '../../context-api/ProfileContext';
import { navForRole } from './dashboardNav';

const normalizePath = (p) => p.replace(/\/$/, '').toLowerCase();

// The dashboard menu, shared by the desktop sidebar (DashMenu) and the mobile menu (DashHeader)
export default function SidebarNav({ onNavigate }) {
  const { currentUser, logout } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const current = normalizePath(location.pathname);
  const sections = useMemo(() => navForRole(currentUser?.role), [currentUser?.role]);
  const isActive = (to) => normalizePath(to) === current;

  // Groups start open when they contain the current page; users can toggle any group
  const activeGroup = useMemo(() => {
    for (const s of sections) {
      for (const item of s.items) {
        if (item.children?.some((c) => isActive(c.to))) return item.label;
      }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, current]);
  const [openGroups, setOpenGroups] = useState(() => new Set(activeGroup ? [activeGroup] : []));
  useEffect(() => {
    if (activeGroup) setOpenGroups((prev) => (prev.has(activeGroup) ? prev : new Set(prev).add(activeGroup)));
  }, [activeGroup]);

  const toggle = (label) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const rowBase = 'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors';
  const idle = 'text-white/75 hover:bg-white/10 hover:text-white';
  const activeRow = 'bg-white/[0.14] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]';

  if (!currentUser) {
    return (
      <div className="space-y-2 p-4" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-9 animate-pulse rounded-xl bg-white/10" />)}
      </div>
    );
  }

  return (
    <nav aria-label="Dashboard" className="flex h-full flex-col">
      <div className="flex-1 space-y-5 px-3 py-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                if (!item.children) {
                  const active = isActive(item.to);
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`${rowBase} ${active ? activeRow : idle}`}
                      >
                        {active && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-amber-400" />}
                        <Icon size={18} className={active ? 'text-amber-300' : 'text-white/60 group-hover:text-white'} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                }

                const open = openGroups.has(item.label);
                const containsActive = item.children.some((c) => isActive(c.to));
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggle(item.label)}
                      aria-expanded={open}
                      className={`${rowBase} cursor-pointer ${containsActive ? 'text-white' : idle}`}
                    >
                      <Icon size={18} className={containsActive ? 'text-amber-300' : 'text-white/60 group-hover:text-white'} />
                      <span className={`flex-1 truncate text-left ${containsActive ? 'font-semibold' : ''}`}>{item.label}</span>
                      <ChevronDown size={16} className={`shrink-0 text-white/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {/* grid-rows trick animates height without measuring */}
                    <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <ul className="ml-[22px] min-h-0 space-y-0.5 overflow-hidden border-l border-white/15 pl-3">
                        {item.children.map((child) => {
                          const active = isActive(child.to);
                          return (
                            <li key={child.to} className="first:mt-1 last:mb-1">
                              <Link
                                to={child.to}
                                onClick={onNavigate}
                                tabIndex={open ? undefined : -1}
                                aria-current={active ? 'page' : undefined}
                                className={`relative flex items-center rounded-lg px-3 py-2 text-[13px] transition-colors ${
                                  active ? 'bg-white/[0.14] font-semibold text-amber-300' : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {active && <span className="absolute -left-[15px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-400 ring-4 ring-[#055b08]" />}
                                <span className="truncate">{child.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-white/75 transition-colors hover:bg-rose-500/90 hover:text-white"
        >
          <LogOut size={18} className="text-white/60" />
          Log out
        </button>
      </div>
    </nav>
  );
}
