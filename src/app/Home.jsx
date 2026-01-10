import { Helmet } from 'react-helmet'
import AllBlog from '../assets/component/HomeComponents.jsx/AllBlog'
import Hero from '../assets/component/HomeComponents.jsx/Hero'
import OurServicesSection from '../assets/component/HomeComponents.jsx/OurServices'
import CallToAction from '../assets/component/HomeComponents.jsx/CalloAction'
import WhoWeAre from '../assets/component/HomeComponents.jsx/WhoWeAre'
import HowItWorks from '../assets/component/HomeComponents.jsx/HowItWorks'
import TestimonialSection from '../assets/component/HomeComponents.jsx/TestimonialSection'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import { SubscribePopUp } from '@/assets/component/HomeComponents.jsx/SubscribePopUp'
import TawkToChat from '@/assets/component/HomeComponents.jsx/TawktoChat'

function Home() {
  return (
    <>
      <TawkToChat />
      <Helmet>
        <title>Cargo Realm and Logistics</title>
      </Helmet>
      <SubscribePopUp />
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