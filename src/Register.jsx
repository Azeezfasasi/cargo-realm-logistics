import React from 'react'
import Header from './assets/component/HomeComponents.jsx/Header'
import RegisterMain from './assets/component/HomeComponents.jsx/RegisterMain'
import Footer from './assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'

function Register() {
  return (
    <>
    <Helmet>
      <title>Register - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <RegisterMain />
    <Footer />
    </>
  )
}

export default Register