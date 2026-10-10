import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../../context-api/ProfileContext';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import TextImageIcon from '@rsuite/icons/TextImage';
import EventDetailIcon from '@rsuite/icons/EventDetail';
import CalendarIcon from '@rsuite/icons/Calendar';
import DetailIcon from '@rsuite/icons/Detail';
import OffRoundIcon from '@rsuite/icons/OffRound';
import { Search, Plus, ChevronDown, LayoutDashboard, UserRound, PackageSearch, Globe, LogOut, Menu, X } from 'lucide-react';
import LogoutButton from './LogoutButton';
import cargorealmlogo from '../../images/cargorealmlogo.png';

// Page names shown next to the logo (falls back to "Dashboard")
const PAGE_TITLES = {
  '/app/dashboard': ['Overview', 'Dashboard'],
  '/app/account/allshipments': ['Shipments', 'All Shipments'],
  '/app/account/myshipments': ['Shipments', 'My Shipments'],
  '/app/account/createshipment': ['Shipments', 'Create Shipment'],
  '/app/account/archived-shipments': ['Shipments', 'Delivered Shipments'],
  '/app/account/manage-shipment-status': ['Shipments', 'Shipment Statuses'],
  '/app/account/manage-facility': ['Shipments', 'Facilities'],
  '/app/account/reports': ['Shipments', 'Reports'],
  '/app/trackshipment': ['Shipments', 'Track Shipment'],
  '/app/account/contactformresponses': ['Customers', 'Quote Requests'],
  '/app/account/allposts': ['Blog', 'All Posts'],
  '/app/account/allblogpost': ['Blog', 'Manage Posts'],
  '/app/account/addnewpost': ['Blog', 'New Post'],
  '/app/account/allevents': ['Events', 'All Events'],
  '/app/account/addevent': ['Events', 'New Event'],
  '/app/account/myappointments': ['Appointments', 'My Appointments'],
  '/app/account/bookappointment': ['Appointments', 'Book Appointment'],
  '/app/account/allappointments': ['Appointments', 'All Appointments'],
  '/app/account/sendnewsletter': ['Newsletter', 'Send Newsletter'],
  '/app/account/allnewsletter': ['Newsletter', 'All Newsletters'],
  '/app/account/Newslettersubscribers': ['Newsletter', 'Subscribers'],
  '/app/account/allgalleryimages': ['Gallery', 'All Images'],
  '/app/account/addnewgallery': ['Gallery', 'Add Images'],
  '/app/account/allusers': ['Users', 'All Users'],
  '/app/account/addnewuser': ['Users', 'Add User'],
  '/app/account/changeuserpassword': ['Users', 'Change Password'],
  '/app/account/profile': ['Account', 'My Profile'],
  '/app/account/sms-dashboard': ['Messaging', 'SMS Dashboard'],
  '/app/account/manage-message-slides': ['Settings', 'Message Slides'],
  '/app/account/manage-hero-slides': ['Settings', 'Hero Slides'],
  '/app/account/manage-our-services': ['Settings', 'Our Services'],
};

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || '?';

function Avatar({ user, size = 'h-9 w-9 text-sm' }) {
  const [broken, setBroken] = useState(false);
  if (user?.profileImageUrl && !broken) {
    return (
      <img
        src={user.profileImageUrl}
        alt=""
        onError={() => setBroken(true)}
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white`}
      />
    );
  }
  return (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-600 to-emerald-700 font-semibold text-white ring-2 ring-white`}>
      {initials(user?.name)}
    </span>
  );
}

function DashHeader() {
  const { currentUser, isAdmin, isAgent, isEmployee, isClient, logout } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [trackNumber, setTrackNumber] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const isStaff = isAdmin || isEmployee || isAgent;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menus when navigating to another page
  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close the user menu on outside click or Escape
  useEffect(() => {
    if (!userMenuOpen) return undefined;
    const onClick = (e) => { if (!userMenuRef.current?.contains(e.target)) setUserMenuOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setUserMenuOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  const handleTrack = (e) => {
    e.preventDefault();
    const tn = trackNumber.trim();
    if (!tn) return;
    navigate(`/app/trackshipment?tracking=${encodeURIComponent(tn)}`);
    setTrackNumber('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Map route paths to eventKeys
  const menuKeyByPath = {
    '/app/dashboard': { key: '1', parent: null },
    '/app/account/allshipments': { key: '2-1', parent: '2' },
    '/app/account/myshipments': { key: '2-2', parent: '2' },
    '/app/account/createshipment': { key: '2-3', parent: '2' },
    '/app/account/archived-shipments': { key: '2-4', parent: '2' },
    '/app/account/manage-shipment-status': { key: '2-5', parent: '2' },
    '/app/account/manage-facility': { key: '2-6', parent: '2' },
    '/app/trackshipment': { key: '2-7', parent: '2' },
    '/app/account/reports': { key: '2-8', parent: '2' },
    '/app/account/contactformresponses': { key: '3', parent: null },
    '/app/account/allposts': { key: '4-1', parent: '4' },
    '/app/account/allblogpost': { key: '4-2', parent: '4' },
    '/app/account/addnewpost': { key: '4-3', parent: '4' },
    '/app/account/allevents': { key: '5-1', parent: '5' },
    '/app/account/addevent': { key: '5-2', parent: '5' },
    '/app/account/myappointments': { key: '6-1', parent: '6' },
    '/app/account/bookappointment': { key: '6-2', parent: '6' },
    '/app/account/allappointments': { key: '6-3', parent: '6' },
    '/app/account/sendnewsletter': { key: '7-1', parent: '7' },
    '/app/account/allnewsletter': { key: '7-2', parent: '7' },
    '/app/account/Newslettersubscribers': { key: '7-3', parent: '7' },
    '/app/account/allgalleryimages': { key: '8-1', parent: '8' },
    '/app/account/addnewgallery': { key: '8-2', parent: '8' },
    '/app/account/allusers': { key: '9-1', parent: '9' },
    '/app/account/addnewuser': { key: '9-2', parent: '9' },
    '/app/account/changeuserpassword': { key: '9-3', parent: '9' },
    '/app/account/profile': { key: '10', parent: null },
    '/app/account/send-test-sms': { key: '11', parent: null },
    '/app/account/manage-message-slides': { key: '12-1', parent: '11' },
    '/app/account/manage-hero-slides': { key: '12-2', parent: '11' },
    '/app/account/manage-our-services': { key: '12-3', parent: '11' },
  };

  // Normalize pathname to handle trailing slashes and query params
    const cleanPath = location.pathname.replace(/\/$/, '').split('?')[0];
    const routeInfo = menuKeyByPath[location.pathname] || menuKeyByPath[cleanPath];
    const activeKey = routeInfo ? routeInfo.key : null;
    // Compute defaultOpenKeys for Sidenav
    let defaultOpenKeys = [];
    if (routeInfo) {
        if (routeInfo.parent) {
            defaultOpenKeys = [routeInfo.parent];
        } else if (Object.values(menuKeyByPath).some(info => info.parent === routeInfo.key)) {
            defaultOpenKeys = [routeInfo.key];
        }
    }

  const [section, pageTitle] = PAGE_TITLES[cleanPath] || PAGE_TITLES[location.pathname] || ['Overview', 'Dashboard'];

  const menuLink = 'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100';

  return (
    <header className="sticky top-0 z-50 font-inter">
      <div className="h-1 bg-linear-to-r from-green-700 via-green-600 to-amber-500" />
      <nav className="border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-16 items-center gap-3 px-3 sm:px-4 lg:gap-6 lg:px-6">
          {/* Logo + current page */}
          <Link to="/" className="flex shrink-0 items-center" aria-label="Cargo Realm and Logistics home">
            <img src={cargorealmlogo} alt="Cargo Realm and Logistics" className="h-8 w-auto sm:h-10" />
          </Link>
          <div className="hidden h-8 w-px bg-gray-200 md:block" />
          <div className="hidden min-w-0 md:block">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-green-700">{section}</p>
            <p className="truncate text-sm font-semibold text-gray-900">{pageTitle}</p>
          </div>

          {/* Quick track */}
          <form onSubmit={handleTrack} className="ml-auto hidden w-full max-w-xs lg:block xl:max-w-sm" role="search">
            <label className="relative block">
              <span className="sr-only">Track a shipment</span>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
                placeholder="Track a shipment… (e.g. CAR123…)"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-[4.5rem] text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <button
                type="submit"
                disabled={!trackNumber.trim()}
                className="absolute right-1.5 top-1/2 h-7 -translate-y-1/2 cursor-pointer rounded-lg bg-green-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Track
              </button>
            </label>
          </form>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {isStaff && (
              <Link
                to="/app/account/createshipment"
                className="hidden h-10 items-center gap-1.5 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white shadow-sm shadow-green-900/20 transition-colors hover:bg-green-700 md:inline-flex"
              >
                <Plus size={16} /> New shipment
              </Link>
            )}

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-gray-100 ${userMenuOpen ? 'bg-gray-100' : ''}`}
              >
                <Avatar user={currentUser} />
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block max-w-[160px] truncate text-sm font-semibold text-gray-900">{currentUser?.name || 'Account'}</span>
                  <span className="block text-xs capitalize text-gray-500">{currentUser?.role || ''}</span>
                </span>
                <ChevronDown size={16} className={`hidden text-gray-400 transition-transform sm:block ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-4 py-3">
                    <Avatar user={currentUser} size="h-10 w-10 text-sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                      <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
                      {currentUser?.role && (
                        <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-green-800">
                          {currentUser.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-1.5">
                    <Link to="/app/dashboard" role="menuitem" className={menuLink}><LayoutDashboard size={16} className="text-gray-400" /> Dashboard</Link>
                    <Link to="/app/account/profile" role="menuitem" className={menuLink}><UserRound size={16} className="text-gray-400" /> My profile</Link>
                    <Link to="/app/trackshipment" role="menuitem" className={menuLink}><PackageSearch size={16} className="text-gray-400" /> Track a shipment</Link>
                    <Link to="/" role="menuitem" className={menuLink}><Globe size={16} className="text-gray-400" /> Visit website</Link>
                  </div>
                  <div className="border-t border-gray-100 p-1.5">
                    <button type="button" role="menuitem" onClick={handleLogout} className={`${menuLink} cursor-pointer text-rose-600 hover:bg-rose-50`}>
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="max-h-[calc(100vh-4.25rem)] overflow-y-auto border-b border-gray-200 bg-[#055b08] shadow-lg lg:hidden">
          <form onSubmit={handleTrack} className="p-3" role="search">
            <label className="relative block">
              <span className="sr-only">Track a shipment</span>
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={trackNumber}
                onChange={(e) => setTrackNumber(e.target.value)}
                placeholder="Track a shipment…"
                className="h-10 w-full rounded-xl border-0 bg-white pl-9 pr-[4.5rem] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={!trackNumber.trim()}
                className="absolute right-1.5 top-1/2 h-7 -translate-y-1/2 cursor-pointer rounded-lg bg-green-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Track
              </button>
            </label>
          </form>
          <Sidenav defaultOpenKeys={defaultOpenKeys}>
            <Sidenav.Body>
              <Nav activeKey={activeKey}>
                {(isAdmin || isEmployee || isClient || isAgent) && (
                  <Nav.Item eventKey="1" icon={<DashboardIcon />} as={Link} to="/app/dashboard">
                      Dashboard
                </Nav.Item>
                )}
                {(isAdmin || isEmployee || isClient || isAgent) && (
                <Nav.Menu eventKey="2" title="Shipments" icon={<DetailIcon />}>
                  {(isAdmin || isEmployee) && (
                  <Nav.Item eventKey="2-1" as={Link} to="/app/account/allshipments">All Shipments</Nav.Item>
                  )}
                  {(isAdmin || isAgent || isClient || isEmployee) && (
                  <Nav.Item eventKey="2-2" as={Link} to="/app/account/myshipments">My Shipment</Nav.Item>
                  )}
                  {(isAdmin || isAgent || isEmployee) && (
                  <Nav.Item eventKey="2-3" as={Link} to="/app/account/createshipment">Create Shipment</Nav.Item>
                  )}
                   {(isAdmin || isAgent || isEmployee) && (
                  <Nav.Item eventKey="2-4" as={Link} to="/app/account/archived-shipments">Delivered Shipment</Nav.Item>
                  )}
                  {(isAdmin || isEmployee) && (
                  <Nav.Item eventKey="2-5" as={Link} to="/app/account/manage-shipment-status">Manage Shipment Status</Nav.Item>
                  )}
                  {(isAdmin || isEmployee) && (
                  <Nav.Item eventKey="2-6" as={Link} to="/app/account/manage-facility">Manage Facility</Nav.Item>
                  )}
                  {(isAdmin || isAgent || isClient || isEmployee) && (
                  <Nav.Item eventKey="2-7" as={Link} to="/app/trackshipment">Track Shipment</Nav.Item>
                  )}
                  {(isAdmin || isEmployee) && (
                  <Nav.Item eventKey="2-8" as={Link} to="/app/account/reports">Reports</Nav.Item>
                  )}
                  </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Item eventKey="3" icon={<TextImageIcon />} as={Link} to="/app/account/contactformresponses">
                    Quote Request Responses
                </Nav.Item>
                )}
                {(isAdmin || isEmployee || isClient) && (
                <Nav.Menu eventKey="4" title="Blog Post" icon={<ListIcon />}>
                    <Nav.Item eventKey="4-1" as={Link} to="/app/account/allposts">All Posts</Nav.Item>
                    {(isAdmin || isAgent|| isEmployee) && (
                    <Nav.Item eventKey="4-2" as={Link} to="/app/account/allblogpost">Manage Blog Posts</Nav.Item>
                    )}
                    {(isAdmin || isAgent || isEmployee) && (
                    <Nav.Item eventKey="4-3" as={Link} to="/app/account/addnewpost">Add New Post</Nav.Item>
                    )}
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="5" title="Events" icon={<EventDetailIcon />}>
                    <Nav.Item eventKey="5-1" as={Link} to="/app/account/allevents">Manage All Events</Nav.Item>
                    <Nav.Item eventKey="5-2" as={Link} to="/app/account/addevent">Add New Event</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isAgent || isEmployee || isClient) && (
                <Nav.Menu eventKey="6" title="Appointments" icon={<CalendarIcon/>}>
                    <Nav.Item eventKey="6-1" as={Link} to="/app/account/myappointments">My Appointments</Nav.Item>
                    <Nav.Item eventKey="6-2" as={Link} to="/app/account/bookappointment">Book Appointment</Nav.Item>
                    {(isAdmin || isEmployee) && (
                    <Nav.Item eventKey="6-3" as={Link} to="/app/account/allappointments">All Appointments</Nav.Item>
                    )}
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="7" title="Newsletter" icon={<MessageIcon />}>
                    <Nav.Item eventKey="7-1" as={Link} to="/app/account/sendnewsletter">Send Newsletter</Nav.Item>
                    <Nav.Item eventKey="7-2" as={Link} to="/app/account/allnewsletter">All Newsletters</Nav.Item>
                    <Nav.Item eventKey="7-3" as={Link} to="/app/account/Newslettersubscribers">Subscribers</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="8" title="Gallery" icon={<GridIcon />}>
                    <Nav.Item eventKey="8-1" as={Link} to="/app/account/allgalleryimages">All Gallery</Nav.Item>
                    <Nav.Item eventKey="8-2" as={Link} to="/app/account/addnewgallery">Add New Gallery</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="9" title="Manage Users" icon={<PeoplesIcon />}>
                    <Nav.Item eventKey="9-1" as={Link} to="/app/account/allusers">All Users</Nav.Item>
                    <Nav.Item eventKey="9-2" as={Link} to="/app/account/addnewuser">Add New User</Nav.Item>
                    <Nav.Item eventKey="9-3" as={Link} to="/app/account/changeuserpassword">Change User Password</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isAgent || isEmployee || isClient) && (
                <Nav.Item eventKey="10" icon={<UserInfoIcon />} as={Link} to="/app/account/profile">
                    Profile
                </Nav.Item>
                )}
                {(isAdmin || isEmployee) && (
                    <Nav.Item eventKey="11" icon={<UserInfoIcon />} as={Link} to="/app/account/sms-dashboard">
                        SMS Dashboard
                    </Nav.Item>
                    )}
                {(isAdmin || isEmployee) && (
                    <Nav.Menu eventKey="12" title="Settings" icon={<GearIcon />}>
                    <Nav.Item eventKey="12-1" as={Link} to="/app/account/manage-message-slides">Manage Message Slides</Nav.Item>
                    <Nav.Item eventKey="12-2" as={Link} to="/app/account/manage-hero-slides">Manage Hero Slides</Nav.Item>
                    <Nav.Item eventKey="12-3" as={Link} to="/app/account/manage-our-services">Manage Our Services</Nav.Item>
                    </Nav.Menu>
                    )}
                {(isAdmin || isAgent || isEmployee || isClient) && (
                <Nav.Item icon={<OffRoundIcon />}>
                    <LogoutButton />
                </Nav.Item>
                )}
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>
      )}
    </header>
  );
}

export default DashHeader;
