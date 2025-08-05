import React from 'react'
import Header from '../assets/component/HomeComponents.jsx/Header'
import PrayerRequestMain from '../assets/component/HomeComponents.jsx/PrayerRequestMain'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'
import FooterSection from '@/assets/component/HomeComponents.jsx/FooterSection'
import HeaderSection from '@/assets/component/HomeComponents.jsx/HeaderSection'

function PrayerRequest() {
  return (
    <>
    <Helmet>
      <title>Prayer Request - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <PrayerRequestMain />
    <FooterSection />
    </>
  )
}

export default PrayerRequest