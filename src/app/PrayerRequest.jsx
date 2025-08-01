import React from 'react'
import Header from '../assets/component/HomeComponents.jsx/Header'
import PrayerRequestMain from '../assets/component/HomeComponents.jsx/PrayerRequestMain'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'

function PrayerRequest() {
  return (
    <>
    <Helmet>
      <title>Prayer Request - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <PrayerRequestMain />
    <Footer />
    </>
  )
}

export default PrayerRequest