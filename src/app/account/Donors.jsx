import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import DonorsMain from '../../assets/component/DashboardComponents.jsx/DonorsMain'

function Donors() {
  return (
    <>
    <Helmet>
        <title>Donors - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%] overflow-x-hidden'>
        <DonorsMain />
      </div>
    </div>
    </>
  )
}

export default Donors