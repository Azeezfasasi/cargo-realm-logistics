import React from 'react'
import AboutMain from '../assets/component/HomeComponents.jsx/AboutMain'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'
import { SubscribePopUp } from '@/assets/component/HomeComponents.jsx/SubscribePopUp'

function About() {
  return (
    <>
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