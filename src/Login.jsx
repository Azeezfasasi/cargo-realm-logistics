import React from 'react'
import Header from './assets/component/HomeComponents.jsx/Header'
import LoginMain from './assets/component/HomeComponents.jsx/LoginMain'
import Footer from './assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'

function Login() {
  return (
    <>
    <Helmet>
      <title>Login - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <LoginMain />
    <Footer />
    </>
  )
}

export default Login