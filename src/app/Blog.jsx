import React from 'react'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import AllBlog from '../assets/component/HomeComponents.jsx/AllBlog'
import { Helmet } from 'react-helmet'
import HeaderSection from '@/assets/component/HomeComponents.jsx/HeaderSection'
import FooterSection from '@/assets/component/HomeComponents.jsx/FooterSection'
import { SubscribePopUp } from '@/assets/component/HomeComponents.jsx/SubscribePopUp'

function Blog() {
  return (
    <>
    <Helmet>
      <title>Blog - Cargo Realm and Logistics</title>
    </Helmet>
    <SubscribePopUp />
    <HeaderSection />
    <AllBlog />
    <FooterSection />
    </>
  )
}

export default Blog