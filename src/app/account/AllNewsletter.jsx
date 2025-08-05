import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import ManageNewsletter from '../../assets/component/DashboardComponents.jsx/ManageNewsletter'

function AllNewsletter() {
  return (
    <>
    <Helmet>
        <title>All Newsletter - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <ManageNewsletter />
      </div>
    </div>
    </>
  )
}

export default AllNewsletter