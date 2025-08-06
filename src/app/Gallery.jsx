import React from 'react'
import GalleryMain from '../assets/component/HomeComponents.jsx/GalleryMain'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'
import HeaderSection from '@/assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '@/assets/component/HomeComponents.jsx/FooterSection'
import { SubscribePopUp } from '@/assets/component/HomeComponents.jsx/SubscribePopUp'
import TawkToChat from '@/assets/component/HomeComponents.jsx/TawktoChat'

function Gallery() {
  return (
    <>
    <TawkToChat />
    <Helmet>
      <title>Gallery - Cargo Realm and Logistics</title>
    </Helmet>
    <SubscribePopUp />
    <HeaderSection />
    <GalleryMain />
    <FooterSection />
    </>
  )
}

export default Gallery