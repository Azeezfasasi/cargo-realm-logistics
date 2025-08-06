import React from 'react'
import AboutMain from '../assets/component/HomeComponents.jsx/AboutMain'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'
import { SubscribePopUp } from '@/assets/component/HomeComponents.jsx/SubscribePopUp'
import TawkToChat from '@/assets/component/HomeComponents.jsx/TawktoChat'

function About() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>About Us - Cargo Realm and Logistics</title>
    </Helmet>
    <SubscribePopUp />
    <HeaderSection />
    <AboutMain />
    <FooterSection />
    </>
  )
}

export default About