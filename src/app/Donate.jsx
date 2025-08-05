import React from 'react'
import DonateMain from '../assets/component/HomeComponents.jsx/DonateMain'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'
import HeaderSection from '@/assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '@/assets/component/HomeComponents.jsx/FooterSection'

function Donate() {
  return (
    <>
    <Helmet>
      <title>Donate - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <DonateMain />
    <FooterSection />
    </>
  )
}

export default Donate