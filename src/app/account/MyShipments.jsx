import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import AllUserMain from '../../assets/component/DashboardComponents.jsx/AllUserMain'
import MyShipmentMain from '@/assets/component/DashboardComponents.jsx/MyShipmentMain'

function MyShipments() {
  return (
    <>
    <Helmet>
        <title>My Shipments - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <MyShipmentMain />
      </div>
    </div>
    </>
  )
}

export default MyShipments