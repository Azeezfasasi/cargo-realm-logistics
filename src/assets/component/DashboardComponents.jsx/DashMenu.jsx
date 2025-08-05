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
    '/app/dashboard': '1',
    '/app/account/allshipments': '2-1',
    '/app/account/myshipments': '2-2',
    '/app/account/createshipment': '2-3',
    '/app/trackshipment': '2-4',
    '/app/account/contactformresponses': '3',
    '/app/account/allposts': '4-1',
    '/app/account/allblogpost': '4-2',
    '/app/account/addnewpost': '4-3',
    '/app/account/allevents': '5-1',
    '/app/account/addevent': '5-2',
    '/app/account/myappointments': '6-1', 
    '/app/account/bookappointment': '6-2', 
    '/app/account/allappointments': '6-3', 
    '/app/account/sendnewsletter': '7-1',
    '/app/account/allnewsletter': '7-2',
    '/app/account/Newslettersubscribers': '7-3',
    '/app/account/allgalleryimages': '8-1',
    '/app/account/addnewgallery': '8-2',
    '/app/account/allusers': '9-1',
    '/app/account/addnewuser': '9-2',
    '/app/account/changeuserpassword': '9-3',
    '/app/account/profile': '10',
    '/app/mysettings': '11',
  };
  const activeKey = menuKeyByPath[location.pathname];

  return (
    <>
    <div style={{ width: 240 }} className='hidden lg:block'>
        <Sidenav>
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
                        {(isAdmin || isAgent || isClient || isEmployee) && (
                        <Nav.Item eventKey="2-4" as={Link} to="/app/trackshipment">Track Shipment</Nav.Item>
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
    </>
  )
}

export default DashMenu