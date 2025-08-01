import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import GalleryUploadForm from '../../assets/component/DashboardComponents.jsx/GalleryUploadForm'

function AddNewGallery() {
  return (
    <>
    <Helmet>
        <title>Add Gallery - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <GalleryUploadForm />
      </div>
    </div>
    </>
  )
}

export default AddNewGallery