import DashHeader from '@/assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '@/assets/component/DashboardComponents.jsx/DashMenu'
import React from 'react'
import { Helmet } from 'react-helmet'

export default function ManageShipmentStatus() {
  return (
      <>
        <Helmet>
            <title>Create Shipment - Cargo Realm and Logistics</title>
        </Helmet>
        <DashHeader />
        <div className='flex flex-row justify-start gap-4'>
            <div className='hidden lg:block w-[20%]'>
                <DashMenu />
            </div>
            <div className='w-full lg:w-[80%]'>
                
            </div>
        </div>
      </>
  )
}
