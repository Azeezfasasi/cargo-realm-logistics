import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../assets/component/DashboardComponents.jsx/DashMenu'
import DashboardStats from '../assets/component/DashboardComponents.jsx/DashboardStats'
import AppointmentStatusChart from '../assets/component/DashboardComponents.jsx/AppointmentChart'
import PrayerRequestStatusChart from '../assets/component/DashboardComponents.jsx/PrayerRequestStatusChart'

function Dashboard() {
  return (
    <>
    <Helmet>
        <title>Dashboard - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
       <DashboardStats />
       <AppointmentStatusChart />
       <PrayerRequestStatusChart />
      </div>
    </div>
    </>
  )
}

export default Dashboard