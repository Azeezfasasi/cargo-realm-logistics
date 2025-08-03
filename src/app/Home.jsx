import { Helmet } from 'react-helmet'
import AllBlog from '../assets/component/HomeComponents.jsx/AllBlog'
import ContactForm from '../assets/component/HomeComponents.jsx/ContactForm'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Hero from '../assets/component/HomeComponents.jsx/Hero'
import HomeAbout from '../assets/component/HomeComponents.jsx/HomeAbout'
import MeetOurPastors from '../assets/component/HomeComponents.jsx/MeetOurPastors'
import ReadBlog from '../assets/component/HomeComponents.jsx/ReadBlog'
import UpComingEvents from '../assets/component/HomeComponents.jsx/UpComingEvents'
import ViewEvents from '../assets/component/HomeComponents.jsx/ViewEvents'
import WelcomeCards from '../assets/component/HomeComponents.jsx/WelcomeCards'
import Worship from '../assets/component/HomeComponents.jsx/Worship'
import OurServicesSection from '../assets/component/HomeComponents.jsx/OurServices'
import CallToAction from '../assets/component/HomeComponents.jsx/CalloAction'
import WhoWeAre from '../assets/component/HomeComponents.jsx/WhoWeAre'
import HowItWorks from '../assets/component/HomeComponents.jsx/HowItWorks'
import TestimonialSection from '../assets/component/HomeComponents.jsx/TestimonialSection'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'

function Home() {
  return (
    <>
      <Helmet>
        <title>Cargo Realm and Logistics</title>
      </Helmet>
      <HeaderSection />
      <Hero />
      <OurServicesSection />
      <CallToAction />
      <WhoWeAre />
      <HowItWorks />
      <AllBlog />
      <TestimonialSection />
      <FooterSection />
    </>
  )
}

export default Home