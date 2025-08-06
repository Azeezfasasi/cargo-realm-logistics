import React from 'react'
import ContactInfo from '../assets/component/HomeComponents.jsx/ContactInfo'
import ContactForm from '../assets/component/HomeComponents.jsx/ContactForm'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'
import { SubscribePopUp } from '@/assets/component/HomeComponents.jsx/SubscribePopUp'
import TawkToChat from '@/assets/component/HomeComponents.jsx/TawktoChat'

function ContactUs() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>Contact Us - Cargo Realm and Logistics</title>
    </Helmet>
    <SubscribePopUp />
    <HeaderSection />
    <ContactInfo />
    <ContactForm />
    <FooterSection />
    </>
  )
}

export default ContactUs