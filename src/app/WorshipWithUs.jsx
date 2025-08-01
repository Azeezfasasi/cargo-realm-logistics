import React from 'react'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import WorshipWithUsMain from '../assets/component/HomeComponents.jsx/WorshipWithUsMain'
import { Helmet } from 'react-helmet'

function WorshipWithUs() {
  return (
    <>
    <Helmet>
      <title>Worship With Us - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <WorshipWithUsMain />
    <Footer />
    </>
  )
}

export default WorshipWithUs