// Single source for the dashboard menu (desktop sidebar and mobile menu).
// `roles` lists who sees an entry; a group is shown if its own roles allow it,
// and each child is filtered again by its own roles.
import {
  LayoutDashboard, Package, FileText, CalendarDays, Newspaper, PartyPopper, Mail,
  Images, Users, MessageSquareText, Settings, UserRound,
} from 'lucide-react';

const ALL = ['admin', 'employee', 'agent', 'client'];
const STAFF = ['admin', 'employee'];

export const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/app/dashboard', roles: ALL },
    ],
  },
  {
    label: 'Logistics',
    items: [
      {
        label: 'Shipments', icon: Package, roles: ALL,
        children: [
          { label: 'All Shipments', to: '/app/account/allshipments', roles: STAFF },
          { label: 'My Shipments', to: '/app/account/myshipments', roles: ALL },
          { label: 'Create Shipment', to: '/app/account/createshipment', roles: ['admin', 'agent', 'employee'] },
          { label: 'Delivered Shipments', to: '/app/account/archived-shipments', roles: ['admin', 'agent', 'employee'] },
          { label: 'Track Shipment', to: '/app/trackshipment', roles: ALL },
          { label: 'Reports', to: '/app/account/reports', roles: STAFF },
          { label: 'Shipment Statuses', to: '/app/account/manage-shipment-status', roles: STAFF },
          { label: 'Facilities', to: '/app/account/manage-facility', roles: STAFF },
        ],
      },
      { label: 'Quote Requests', icon: FileText, to: '/app/account/contactformresponses', roles: STAFF },
      {
        label: 'Appointments', icon: CalendarDays, roles: ALL,
        children: [
          { label: 'My Appointments', to: '/app/account/myappointments', roles: ALL },
          { label: 'Book Appointment', to: '/app/account/bookappointment', roles: ALL },
          { label: 'All Appointments', to: '/app/account/allappointments', roles: STAFF },
        ],
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Blog', icon: Newspaper, roles: ['admin', 'employee', 'client'],
        children: [
          { label: 'All Posts', to: '/app/account/allposts', roles: ALL },
          { label: 'Manage Posts', to: '/app/account/allblogpost', roles: ['admin', 'agent', 'employee'] },
          { label: 'New Post', to: '/app/account/addnewpost', roles: ['admin', 'agent', 'employee'] },
        ],
      },
      {
        label: 'Events', icon: PartyPopper, roles: STAFF,
        children: [
          { label: 'All Events', to: '/app/account/allevents', roles: STAFF },
          { label: 'New Event', to: '/app/account/addevent', roles: STAFF },
        ],
      },
      {
        label: 'Newsletter', icon: Mail, roles: STAFF,
        children: [
          { label: 'Send Newsletter', to: '/app/account/sendnewsletter', roles: STAFF },
          { label: 'All Newsletters', to: '/app/account/allnewsletter', roles: STAFF },
          { label: 'Subscribers', to: '/app/account/Newslettersubscribers', roles: STAFF },
        ],
      },
      {
        label: 'Gallery', icon: Images, roles: STAFF,
        children: [
          { label: 'All Images', to: '/app/account/allgalleryimages', roles: STAFF },
          { label: 'Add Images', to: '/app/account/addnewgallery', roles: STAFF },
        ],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        label: 'Users', icon: Users, roles: STAFF,
        children: [
          { label: 'All Users', to: '/app/account/allusers', roles: STAFF },
          { label: 'Add User', to: '/app/account/addnewuser', roles: STAFF },
          { label: 'Change Password', to: '/app/account/changeuserpassword', roles: STAFF },
        ],
      },
      { label: 'SMS Dashboard', icon: MessageSquareText, to: '/app/account/sms-dashboard', roles: STAFF },
      {
        label: 'Site Settings', icon: Settings, roles: STAFF,
        children: [
          { label: 'Message Slides', to: '/app/account/manage-message-slides', roles: STAFF },
          { label: 'Hero Slides', to: '/app/account/manage-hero-slides', roles: STAFF },
          { label: 'Our Services', to: '/app/account/manage-our-services', roles: STAFF },
        ],
      },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'My Profile', icon: UserRound, to: '/app/account/profile', roles: ALL },
    ],
  },
];

// Sections/items/children the given role may see (empty groups and sections dropped)
export const navForRole = (role) => {
  const can = (roles) => !!role && roles.includes(role);
  return NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items
      .filter((item) => can(item.roles))
      .map((item) => (item.children ? { ...item, children: item.children.filter((c) => can(c.roles)) } : item))
      .filter((item) => !item.children || item.children.length > 0),
  })).filter((section) => section.items.length > 0);
};
