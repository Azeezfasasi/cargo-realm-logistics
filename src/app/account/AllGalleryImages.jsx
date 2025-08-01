import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import GalleryManager from '../../assets/component/DashboardComponents.jsx/GalleryManager'

function AllGalleryImages() {
  return (
    <>
    <Helmet>
        <title>All Images - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <GalleryManager />
      </div>
    </div>
    </>
  )
}

export default AllGalleryImages