import React from 'react'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import OurServicesSection from '../assets/component/HomeComponents.jsx/OurServices'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'
import ContactForm from '@/assets/component/HomeComponents.jsx/ContactForm'

function Services() {
  return (
    <>
    <Helmet>
      <title>Our Services - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <OurServicesSection />
    <br />
    <ContactForm />
    <br />
    <FooterSection />
    </>
  )
}

export default Services;