import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import ManageEvents from '../../assets/component/DashboardComponents.jsx/ManageEvents'

function AllEvents() {
  return (
    <>
    <Helmet>
        <title>All Events - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
       <ManageEvents />
      </div>
    </div>
    </>
  )
}

export default AllEvents