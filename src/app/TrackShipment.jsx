import React from 'react'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import TrackShipmentComponent from '../assets/component/HomeComponents.jsx/TrackShipmentComponent'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'

function About() {
  return (
    <>
    <Helmet>
      <title>Track Shipment - Cargo Realm and Logistics</title>
    </Helmet>
    <HeaderSection />
    <TrackShipmentComponent />
    <FooterSection />
    </>
  )
}

export default About