import React from 'react'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import WorshipWithUsMain from '../assets/component/HomeComponents.jsx/WorshipWithUsMain'
import { Helmet } from 'react-helmet'
import HeaderSection from '@/assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '@/assets/component/HomeComponents.jsx/FooterSection'

function WorshipWithUs() {
  return (
    <>
    <Helmet>
      <title>Worship With Us - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <WorshipWithUsMain />
    <FooterSection />
    </>
  )
}

export default WorshipWithUs