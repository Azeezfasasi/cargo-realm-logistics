import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import CreateShipmentMain from '../../assets/component/DashboardComponents.jsx/CreateShipmentMain'

function CreateShipment() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
        <CreateShipmentMain token={token} />
      </div>
    </div>
    </>
  )
}

export default CreateShipment