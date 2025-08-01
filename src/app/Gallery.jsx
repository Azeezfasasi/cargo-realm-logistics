import React from 'react'
import GalleryMain from '../assets/component/HomeComponents.jsx/GalleryMain'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import { Helmet } from 'react-helmet'

function Gallery() {
  return (
    <>
    <Helmet>
      <title>Gallery - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <GalleryMain />
    <Footer />
    </>
  )
}

export default Gallery