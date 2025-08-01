import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import MyAppointmentMain from '../../assets/component/DashboardComponents.jsx/MyAppointmentMain'

function MyAppointments() {
  return (
    <>
    <Helmet>
        <title>My Appointmnets - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <MyAppointmentMain />
      </div>
    </div>
    </>
  )
}

export default MyAppointments