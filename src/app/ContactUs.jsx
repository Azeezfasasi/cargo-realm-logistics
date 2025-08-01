import React from 'react'
import ContactInfo from '../assets/component/HomeComponents.jsx/ContactInfo'
import ContactForm from '../assets/component/HomeComponents.jsx/ContactForm'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'

function ContactUs() {
  return (
    <>
    <Helmet>
      <title>Contact Us - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <ContactInfo />
    <ContactForm />
    <FooterSection />
    </>
  )
}

export default ContactUs