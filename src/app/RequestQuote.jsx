import React from 'react'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import RequestQuoteComponent from '../assets/component/HomeComponents.jsx/RequestQuoteComponent'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'

function RequestQuote() {
  return (
    <>
    <Helmet>
      <title>Request Quote - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <RequestQuoteComponent />
    <FooterSection />
    </>
  )
}

export default RequestQuote