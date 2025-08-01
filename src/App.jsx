import { Route, Routes } from "react-router-dom"
import Home from "./app/Home"
import Login from "./Login"
import ForgetPassword from "./ForgetPassword"
import Donate from "./app/Donate"
import About from "./app/About"
import Blog from "./app/Blog"
import ContactUs from "./app/ContactUs"
import Events from "./app/Events"
import Gallery from "./app/Gallery"
import PrayerRequest from "./app/PrayerRequest"
import ScheduleAppointment from "./app/ScheduleAppointment"
import Sermon from "./app/Sermon"
import SubscribeToNewsletter from "./app/SubscribeToNewsletter"
import Register from "./Register"
import WorshipWithUs from "./app/WorshipWithUs"
import { ProfileProvider } from "./assets/context-api/UseProfile"
import Dashboard from "./app/Dashboard"
import PrivateRoute from "./assets/component/PrivateRoute"
import 'rsuite/dist/rsuite-no-reset.min.css';
import AllBlogPost from "./app/account/AllBlogPost"
import AddNewPost from "./app/account/AddNewPost"
import AddEvent from "./app/account/AddEvent"
import AddNewGallery from "./app/account/AddNewGallery"
import AddNewUser from "./app/account/AddNewUser"
import AllAppointments from "./app/account/AllAppointments"
import AllDonations from "./app/account/AllDonations"
import AllEvents from "./app/account/AllEvents"
import AllNewsletter from "./app/account/AllNewsletter"
import AllPrayers from "./app/account/AllPrayers"
import AllUsers from "./app/account/AllUsers"
import BookAppointment from "./app/account/BookAppointment"
import ChangeUserPassword from "./app/account/ChangeUserPassword"
import ContactFormResponses from "./app/account/ContactFormResponses"
import Donors from "./app/account/Donors"
import MyAppointments from "./app/account/MyAppointments"
import MySettings from "./app/account/MySettings"
import NewsletterSubscribers from "./app/account/NewsletterSubscribers"
import Profile from "./app/account/Profile"
import SendDonation from "./app/account/SendDonation"
import SendNewsletter from "./app/account/SendNewsletter"
import SendPrayers from "./app/account/SendPrayers"
import AllGalleryImages from "./app/account/AllGalleryImages"
import ScrollToTop from "./assets/component/ScrollToTop"
import AllPosts from "./app/account/AllPosts"
import BlogDetail from "./app/account/BlogDetail"
import Services from "./app/Services"
import TrackShipment from "./app/TrackShipment"
import RequestQuote from "./app/RequestQuote"

function App() {

  return (
    <>
      <ProfileProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/app/donate" element={<Donate />} />
          <Route path="/app/about" element={<About />} />
          <Route path="/app/blog" element={<Blog />} />
          <Route path="/app/account/blogdetail/:id" element={<BlogDetail />} />
          <Route path="/app/contactus" element={<ContactUs />} />
          <Route path="/app/events" element={<Events />} />
          <Route path="/app/gallery" element={<Gallery />} />
          <Route path="/app/prayerrequest" element={<PrayerRequest />} />
          <Route path="/app/scheduleappointment" element={<ScheduleAppointment />} />
          <Route path="/app/sermon" element={<Sermon />} />
          <Route path="/app/subscribetonewsletter" element={<SubscribeToNewsletter />} />
          <Route path="/app/worshipwithus" element={<WorshipWithUs />} />
          <Route path="/app/services" element={<Services />} />
          <Route path="/app/trackshipment" element={<TrackShipment/>} />
          <Route path="/app/requestquote" element={<RequestQuote/>} />

          {/* Private Routes */}
          <Route path="/app/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/app/account/allblogpost" element={<PrivateRoute><AllBlogPost /></PrivateRoute>} />
          <Route path="/app/account/allposts" element={<PrivateRoute><AllPosts /></PrivateRoute>} />
          <Route path="/app/account/addnewpost" element={<PrivateRoute><AddNewPost /></PrivateRoute>} />
          <Route path="/app/account/addevent" element={<PrivateRoute><AddEvent /></PrivateRoute>} />
          <Route path="/app/account/addnewgallery" element={<PrivateRoute><AddNewGallery /></PrivateRoute>} />
          <Route path="/app/account/addnewuser" element={<PrivateRoute><AddNewUser /></PrivateRoute>} />
          <Route path="/app/account/allappointments" element={<PrivateRoute><AllAppointments /></PrivateRoute>} />
          <Route path="/app/account/alldonations" element={<PrivateRoute><AllDonations /></PrivateRoute>} />
          <Route path="/app/account/allevents" element={<PrivateRoute><AllEvents /></PrivateRoute>} />
          <Route path="/app/account/allgalleryimages" element={<PrivateRoute><AllGalleryImages /></PrivateRoute>} />
          <Route path="/app/account/allnewsletter" element={<PrivateRoute><AllNewsletter/></PrivateRoute>} />
          <Route path="/app/account/allprayers" element={<PrivateRoute><AllPrayers /></PrivateRoute>} />
          <Route path="/app/account/allusers" element={<PrivateRoute><AllUsers /></PrivateRoute>} />
          <Route path="/app/account/bookappointment" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
          <Route path="/app/account/changeuserpassword" element={<PrivateRoute><ChangeUserPassword /></PrivateRoute>} />
          <Route path="/app/account/contactformresponses" element={<PrivateRoute><ContactFormResponses /></PrivateRoute>} />
          <Route path="/app/account/donors" element={<PrivateRoute><Donors /></PrivateRoute>} />
          <Route path="/app/account/myappointments" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
          <Route path="/app/account/mysettings" element={<PrivateRoute><MySettings /></PrivateRoute>} />
          <Route path="/app/account/newslettersubscribers" element={<PrivateRoute><NewsletterSubscribers /></PrivateRoute>} />
          <Route path="/app/account/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/app/account/senddonation" element={<PrivateRoute><SendDonation /></PrivateRoute>} />
          <Route path="/app/account/sendnewsletter" element={<PrivateRoute><SendNewsletter /></PrivateRoute>} />
          <Route path="/app/account/sendprayer" element={<PrivateRoute><SendPrayers /></PrivateRoute>} />
        </Routes>
      </ProfileProvider>
    </>
  )
}

export default App
