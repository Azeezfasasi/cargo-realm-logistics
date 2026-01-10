import { Sidenav, Nav } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import TextImageIcon from '@rsuite/icons/TextImage';
import CalendarIcon from '@rsuite/icons/Calendar';
import EventDetailIcon from '@rsuite/icons/EventDetail';
import OffRoundIcon from '@rsuite/icons/OffRound';
import { useProfile } from '../../context-api/ProfileContext';
import LogoutButton from './LogoutButton';

function DashMenu() {
    const {isAdmin, isAgent, isEmployee, isClient} = useProfile()
    const location = useLocation();

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
    '/app/account/manage-message-slides': { key: '11', parent: null },
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
    <>
    <div style={{ width: 240 }} className='hidden lg:block'>
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
                        <Nav.Item eventKey="2-5" as={Link} to="/app/account/manage-facility">Manage Facility</Nav.Item>
                        )}
                        {(isAdmin || isEmployee) && (
                        <Nav.Item eventKey="2-6" as={Link} to="/app/account/manage-shipment-status">Manage Shipment Status</Nav.Item>
                        )}
                        {(isAdmin || isAgent || isClient || isEmployee) && (
                        <Nav.Item eventKey="2-7" as={Link} to="/app/trackshipment">Track Shipment</Nav.Item>
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
                    <Nav.Menu eventKey="6" title="Appointments" icon={<CalendarIcon />}>
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
                    <Nav.Menu eventKey="11" title="Settings" icon={<GearIcon />}>
                        <Nav.Item eventKey="11-1" as={Link} to="/app/account/manage-message-slides">Manage Message Slides</Nav.Item>
                        {/* <Nav.Item eventKey="9-2" as={Link} to="/app/account/addnewuser">Add New User</Nav.Item>
                        <Nav.Item eventKey="9-3" as={Link} to="/app/account/changeuserpassword">Change User Password</Nav.Item> */}
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
    </>
  )
}

export default DashMenu