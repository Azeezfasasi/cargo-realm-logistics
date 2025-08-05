import React from 'react'
import RegisterMain from './assets/component/HomeComponents.jsx/RegisterMain'
import { Helmet } from 'react-helmet'
import HeaderSection from './assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from './assets/component/HomeComponents.jsx/FooterSection'

function Register() {
  return (
    <>
    <Helmet>
      <title>Register - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <RegisterMain />
    <FooterSection />
    </>
  )
}

export default Register