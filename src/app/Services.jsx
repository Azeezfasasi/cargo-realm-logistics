import React from 'react'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import OurServicesSection from '../assets/component/HomeComponents.jsx/OurServices'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'

function Services() {
  return (
    <>
    <Helmet>
      <title>Our Services - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <OurServicesSection />
    <FooterSection />
    </>
  )
}

export default Services;