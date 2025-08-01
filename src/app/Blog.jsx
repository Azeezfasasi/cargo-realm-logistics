import React from 'react'
import Header from '../assets/component/HomeComponents.jsx/Header'
import Footer from '../assets/component/HomeComponents.jsx/Footer'
import AllBlog from '../assets/component/HomeComponents.jsx/AllBlog'
import { Helmet } from 'react-helmet'

function Blog() {
  return (
    <>
    <Helmet>
      <title>Blog - CAC Lightway Assembly Church</title>
    </Helmet>
    <Header />
    <AllBlog />
    <Footer />
    </>
  )
}

export default Blog