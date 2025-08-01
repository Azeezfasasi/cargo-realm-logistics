import React from 'react'
import DonateMain from '../assets/component/HomeComponents.jsx/DonateMain'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'

function Donate() {
  return (
    <>
    <Helmet>
      <title>Donate - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <DonateMain />
    <Footer />
    </>
  )
}

export default Donate