import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import AllShipmentsMain from '../../assets/component/DashboardComponents.jsx/AllShipmentsMain'

function AllShipments() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  return (
    <>
    <Helmet>
        <title>All Shipments - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%] overflow-x-hidden'>
        <AllShipmentsMain token={token} />
      </div>
    </div>
    </>
  )
}

export default AllShipments