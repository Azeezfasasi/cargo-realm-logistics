import { Sidenav, Nav } from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import DetailIcon from '@rsuite/icons/Detail';
import ListIcon from '@rsuite/icons/List';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import PeoplesIcon from '@rsuite/icons/Peoples';
import GridIcon from '@rsuite/icons/Grid';
import TagIcon from '@rsuite/icons/Tag';
import MessageIcon from '@rsuite/icons/Message';
import GearIcon from '@rsuite/icons/Gear';
import { useProfile } from '../../context-api/ProfileContext';

function DashMenu() {
    const {isAdmin, isAgent, isEmployee, isClient} = useProfile()
    const location = useLocation();

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
    <>
    <div style={{ width: 240 }} className='hidden lg:block'>
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
                        <Nav.Item eventKey="2-1" as={Link} to="">All Shipments</Nav.Item>
                        )}
                        {(isAdmin || isAgent || isEmployee) && (
                        <Nav.Item eventKey="2-2" as={Link} to="">Create Shipment</Nav.Item>
                        )}
                        {(isAdmin || isAgent || isClient || isEmployee) && (
                        <Nav.Item eventKey="2-3" as={Link} to="">My Shipment</Nav.Item>
                        )}
                        {(isAdmin || isAgent || isClient || isEmployee) && (
                        <Nav.Item eventKey="2-3" as={Link} to="">Track Shipment</Nav.Item>
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
    </>
  )
}

export default DashMenu