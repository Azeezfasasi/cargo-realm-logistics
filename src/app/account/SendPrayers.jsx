import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import PrayerRequestMain from '../../assets/component/HomeComponents.jsx/PrayerRequestMain'

function SendPrayers() {
  return (
    <>
    <Helmet>
        <title>Send Prayers - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
       <PrayerRequestMain />
      </div>
    </div>
    </>
  )
}

export default SendPrayers