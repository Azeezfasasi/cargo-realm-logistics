import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import account from '../../images/account.svg';
import { useProfile } from '../../context-api/ProfileContext';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import TagIcon from '@rsuite/icons/Tag';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import logo2 from '../../images/logo2.png'

function DashHeader() {
  const {currentUser, isAdmin, isAgent, isEmployee, isClient} = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Map route paths to eventKeys
  const menuKeyByPath = {
    '/app/dashboard': '1',
    '/app/account/allposts': '2-1',
    '/app/account/allblogpost': '2-2',
    '/app/account/addnewpost': '2-3',
    '/app/account/allevents': '3-1',
    '/app/account/addevent': '3-2',
    '/app/account/sendnewsletter': '4-1',
    '/app/account/allnewsletter': '4-2',
    '/app/account/Newslettersubscribers': '4-3',
    '/app/account/allprayers': '5-1',
    '/app/account/sendprayer': '5-2',
    '/app/account/allgalleryimages': '6-1',
    '/app/account/addnewgallery': '6-2',
    '/app/account/allusers': '7-1',
    '/app/account/addnewuser': '7-2',
    '/app/account/changeuserpassword': '7-3',
    '/app/account/alldonations': '8-1',
    '/app/account/senddonation': '8-2',
    '/app/account/donors': '8-3',
    '/app/account/myappointments': '9-1', 
    '/app/account/bookappointment': '9-2', 
    '/app/account/allappointments': '9-3', 
    '/app/account/contactformresponses': '10', 
    '/app/account/profile': '11',
    '/app/mysettings': '12',
  };
  const activeKey = menuKeyByPath[location.pathname];

  return (
    <nav className="bg-gray-500 text-white px-3 font-inter sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo2}
            alt="Adesola Plastic Stores Logo"
            className="h-[45px] w-[180px] md:h-[52px] md:w-[250px] rounded-full mr-0"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 text-lg">
          <Link to="/" className="hover:text-orange-400 transition-colors duration-300">Home</Link>
          <Link to="/app/about" className="hover:text-orange-400 transition-colors duration-300">About Us</Link>
          <Link to="/app/prayerrequest" className="hover:text-orange-400 transition-colors duration-300">Prayer Requests</Link>
          <Link to="/app/blog" className="hover:text-orange-400 transition-colors duration-300">Blog</Link>
          <Link to="/app/gallery" className="hover:text-orange-400 transition-colors duration-300">Gallery</Link>
          <Link to="/app/contactus" className="hover:text-orange-400 transition-colors duration-300">Contact Us</Link>
        </div>

        {/* Icons for Desktop (User, Wishlist, Cart) */}
        <div className="hidden lg:flex items-center space-x-4" ref={menuRef}>
            <button onClick={() => setOpenDropdown(!openDropdown)} className="hover:text-orange-400 transition-colors flex flex-row justify-start items-center gap-2 duration-300 cursor-pointer">
                <img 
                src={account} 
                alt={account} 
                className='w-7 h-7 text-blue-500' 
                />
                <div className='mr-4 flex flex-col items-start justify-center'>
                    <div className='text-[14px]'>{currentUser?.name}</div>
                    <div className='text-[12px] capitalize'>{currentUser?.role}</div>
                </div>
            </button>
        </div>
        {openDropdown && (
        <div className="absolute top-full mt-0 right-0 bg-white border rounded-md shadow-md z-50 w-48">
          <ul className="py-2">
            <li>
              <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setOpenDropdown(false)}>
                Back to Home
              </Link>
            </li>
            <li>
              <Link to="/app/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setOpenDropdown(false)}>
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  // Perform logout logic here
                  setOpenDropdown(false);
                }}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden flex items-center" ref={menuRef}>
          {/* Mobile Icons (User, Cart) */}
          <Link to="/app/dashboard" onClick={() => setOpenDropdown(!openDropdown)} className="hover:text-orange-400 transition-colors flex flex-row justify-start items-center gap-2 duration-300 mr-2">
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
          <Sidenav>
            <Sidenav.Body>
              <Nav activeKey={activeKey}>
                {(isAdmin || isEmployee) && (
                <Nav.Item eventKey="1" icon={<DashboardIcon />} as={Link} to="/app/dashboard">
                    Dashboard
                </Nav.Item>
                )}
                {(isAdmin || isEmployee || isClient || isAgent) && (
                <Nav.Menu eventKey="2" title="Shipments" icon={<ListIcon />}>
                    {(isAdmin || isEmployee) && (
                    <Nav.Item eventKey="2-1" as={Link} to="/app/account/allshipments">All Shipments</Nav.Item>
                    )}
                    {(isAdmin || isAgent || isEmployee) && (
                    <Nav.Item eventKey="2-2" as={Link} to="/app/account/createshipment">Create Shipment</Nav.Item>
                    )}
                    {(isAdmin || isAgent || isClient || isEmployee) && (
                    <Nav.Item eventKey="2-3" as={Link} to="/app/account/myshipments">My Shipment</Nav.Item>
                    )}
                    {(isAdmin || isAgent || isClient || isEmployee) && (
                    <Nav.Item eventKey="2-3" as={Link} to="/app/trackshipment">Track Shipment</Nav.Item>
                    )}
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee || isClient) && (
                <Nav.Menu eventKey="2" title="Blog Post" icon={<ListIcon />}>
                    <Nav.Item eventKey="2-1" as={Link} to="/app/account/allposts">All Posts</Nav.Item>
                    {(isAdmin || isAgent|| isEmployee) && (
                    <Nav.Item eventKey="2-2" as={Link} to="/app/account/allblogpost">Manage Blog Posts</Nav.Item>
                    )}
                    {(isAdmin || isAgent || isEmployee) && (
                    <Nav.Item eventKey="2-3" as={Link} to="/app/account/addnewpost">Add New Post</Nav.Item>
                    )}
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="3" title="Events" icon={<ListIcon />}>
                    <Nav.Item eventKey="3-1" as={Link} to="/app/account/allevents">Manage All Events</Nav.Item>
                    <Nav.Item eventKey="3-2" as={Link} to="/app/account/addevent">Add New Event</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="4" title="Newsletter" icon={<MessageIcon />}>
                    <Nav.Item eventKey="4-1" as={Link} to="/app/account/sendnewsletter">Send Newsletter</Nav.Item>
                    <Nav.Item eventKey="4-2" as={Link} to="/app/account/allnewsletter">All Newsletters</Nav.Item>
                    <Nav.Item eventKey="4-3" as={Link} to="/app/account/Newslettersubscribers">Subscribers</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="6" title="Gallery" icon={<GridIcon />}>
                    <Nav.Item eventKey="6-1" as={Link} to="/app/account/allgalleryimages">All Gallery</Nav.Item>
                    <Nav.Item eventKey="6-2" as={Link} to="/app/account/addnewgallery">Add New Gallery</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Menu eventKey="7" title="Manage Users" icon={<PeoplesIcon />}>
                    <Nav.Item eventKey="7-1" as={Link} to="/app/account/allusers">All Users</Nav.Item>
                    <Nav.Item eventKey="7-2" as={Link} to="/app/account/addnewuser">Add New User</Nav.Item>
                    <Nav.Item eventKey="7-3" as={Link} to="/app/account/changeuserpassword">Change User Password</Nav.Item>
                </Nav.Menu>
                )}
                {(isAdmin || isAgent || isEmployee || isClient) && (
                <Nav.Menu eventKey="9" title="Appointments" icon={<PeoplesIcon />}>
                    <Nav.Item eventKey="9-1" as={Link} to="/app/account/myappointments">My Appointments</Nav.Item>
                    <Nav.Item eventKey="9-2" as={Link} to="/app/account/bookappointment">Book Appointment</Nav.Item>
                    {(isAdmin || isEmployee) && (
                    <Nav.Item eventKey="9-3" as={Link} to="/app/account/allappointments">All Appointments</Nav.Item>
                    )}
                </Nav.Menu>
                )}
                {(isAdmin || isEmployee) && (
                <Nav.Item eventKey="10" icon={<TagIcon />} as={Link} to="/app/account/contactformresponses">
                    Contact Responses
                </Nav.Item>
                )}
                {(isAdmin || isAgent || isEmployee || isClient) && (
                <Nav.Item eventKey="11" icon={<UserInfoIcon />} as={Link} to="/app/account/profile">
                    Profile
                </Nav.Item>
                )}
                {(isAdmin || isAgent || isEmployee || isClient) && (
                <Nav.Item eventKey="12" icon={<GearIcon />} as={Link} to="/app/account/mysettings">
                    Settings
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
