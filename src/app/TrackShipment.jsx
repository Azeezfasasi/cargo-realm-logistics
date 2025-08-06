import React from 'react'
import { Helmet } from 'react-helmet'
import HeaderSection from '../assets/component/HomeComponents.jsx/HeaderSection'
import TrackShipmentComponent from '../assets/component/HomeComponents.jsx/TrackShipmentComponent'
import FooterSection from '../assets/component/HomeComponents.jsx/FooterSection'
import { SubscribePopUp } from '@/assets/component/HomeComponents.jsx/SubscribePopUp'
import TawkToChat from '@/assets/component/HomeComponents.jsx/TawktoChat'

function About() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>Track Shipment - Cargo Realm and Logistics</title>
    </Helmet>
    <SubscribePopUp />
    <HeaderSection />
    <TrackShipmentComponent />
    <FooterSection />
    </>
  )
}

export default About