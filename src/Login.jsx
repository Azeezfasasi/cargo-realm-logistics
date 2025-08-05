import React from 'react'
import Header from './assets/component/HomeComponents.jsx/Header'
import LoginMain from './assets/component/HomeComponents.jsx/LoginMain'
import { Helmet } from 'react-helmet'
import HeaderSection from './assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from './assets/component/HomeComponents.jsx/FooterSection'

function Login() {
  return (
    <>
    <Helmet>
      <title>Login - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <LoginMain />
    <FooterSection />
    </>
  )
}

export default Login