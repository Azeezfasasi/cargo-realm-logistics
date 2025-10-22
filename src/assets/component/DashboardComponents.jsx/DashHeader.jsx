import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import account from '../../images/account.svg';
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
import LogoutButton from './LogoutButton';
import cargorealmlogo from '../../images/cargorealmlogo.png';


function DashHeader() {
  const {currentUser, isAdmin, isAgent, isEmployee, isClient} = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // const [openDropdown, setOpenDropdown] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Map route paths to eventKeys
  const menuKeyByPath = {
    '/app/dashboard': { key: '1', parent: null },
    '/app/account/allshipments': { key: '2-1', parent: '2' },
    '/app/account/myshipments': { key: '2-2', parent: '2' },
    '/app/account/createshipment': { key: '2-3', parent: '2' },
    '/app/account/archived-shipments': { key: '2-4', parent: '2' },
    '/app/trackshipment': { key: '2-5', parent: '2' },
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
    '/app/mysettings': { key: '11', parent: null },
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

  return (
    <nav className="bg-gray-500 text-white px-3 font-inter sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center relative py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center bg-gray-100 p-2 rounded-md">
          <img
            src={cargorealmlogo}
            alt="Adesola Plastic Stores Logo"
            className="h-[30px] w-[120px] md:h-40px] md:w-[220px] mr-0"
          />
        </Link>

        {/* Icons for Desktop (User, Wishlist, Cart) */}
        <div className="hidden lg:flex items-center space-x-4" ref={menuRef}>
            <Link to="/app/dashboard" className="hover:text-orange-400 transition-colors flex flex-row justify-start items-center gap-2 duration-300 cursor-pointer">
                <img 
                src={account} 
                alt={account} 
                className='w-7 h-7 text-blue-500' 
                />
                <div className='mr-4 flex flex-col items-start justify-center'>
                    <div className='text-[14px]'>{currentUser?.name}</div>
                    <div className='text-[12px] capitalize'>{currentUser?.role}</div>
                </div>
            </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden flex items-center" ref={menuRef}>
          {/* Mobile Icons (User, Cart) */}
          <Link to="/app/dashboard" className="hover:text-orange-400 transition-colors flex flex-row justify-start items-center gap-1 duration-300 mr-0">
            <img 
            src={account} 
            alt={account} 
            className='w-7 h-7 text-blue-500' 
            />
            <div className='mr-4 flex flex-col items-start justify-center'>
                <div className='text-[11px] md:text-[14px]'>{currentUser?.name}</div>
                <div className='text-[11px] capitalize'>{currentUser?.role}</div>
            </div>
          </Link>
          

          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      <div
        className={`lg:hidden ${
          isOpen ? 'block' : 'hidden'
        } py-2 px-0 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col space-y-2">
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
                  <Nav.Item eventKey="2-4" as={Link} to="/app/account/archived-shipments">Archived Shipment</Nav.Item>
                  )}
                  {(isAdmin || isAgent || isClient || isEmployee) && (
                  <Nav.Item eventKey="2-5" as={Link} to="/app/trackshipment">Track Shipment</Nav.Item>
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
                {(isAdmin || isAgent || isEmployee || isClient) && (
                <Nav.Item eventKey="11" icon={<GearIcon />} as={Link} to="/app/account/mysettings">
                    Settings
                </Nav.Item>
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
      </div>
    </nav>
  );
}

export default DashHeader;
