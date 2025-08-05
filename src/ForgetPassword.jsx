import React from 'react'
import ForgetPasswordMain from './assets/component/HomeComponents.jsx/ForgetPasswordMain'
import { Helmet } from 'react-helmet'
import HeaderSection from './assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from './assets/component/HomeComponents.jsx/FooterSection'

function ForgetPassword() {
  return (
    <>
    <Helmet>
      <title>Forgot Password - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <ForgetPasswordMain />
    <FooterSection />
    </>
  )
}

export default ForgetPassword