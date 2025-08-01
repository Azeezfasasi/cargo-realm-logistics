import React from 'react'
import Header from './assets/component/HomeComponents.jsx/Header'
import ForgetPasswordMain from './assets/component/HomeComponents.jsx/ForgetPasswordMain'
import Footer from './assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'

function ForgetPassword() {
  return (
    <>
    <Helmet>
      <title>Forgot Password - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <ForgetPasswordMain />
    <Footer />
    </>
  )
}

export default ForgetPassword