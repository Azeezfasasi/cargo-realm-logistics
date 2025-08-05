import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../assets/component/DashboardComponents.jsx/DashMenu'
import DashboardStats from '../assets/component/DashboardComponents.jsx/DashboardStats'
import AppointmentStatusChart from '../assets/component/DashboardComponents.jsx/AppointmentChart'
import PrayerRequestStatusChart from '../assets/component/DashboardComponents.jsx/PrayerRequestStatusChart'
import ShipmentChart from '@/assets/component/DashboardComponents.jsx/ShipmentChart'
import QuoteChart from '@/assets/component/DashboardComponents.jsx/QuoteChart'
import UserRolesChart from '@/assets/component/DashboardComponents.jsx/UserChart'
import { useProfile } from '@/assets/context-api/ProfileContext'
import UserDashboardStats from '@/assets/component/DashboardComponents.jsx/UserDashboardStats'

function Dashboard() {
  const { isAdmin, isEmployee, isClient } = useProfile()
  return (
    <>
    <Helmet>
        <title>Dashboard - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
      {(isAdmin || isEmployee) &&
        <DashboardStats />
          }
      {(isAdmin || isEmployee) &&
      <>
       <UserRolesChart />
       <ShipmentChart />
       <QuoteChart />
       <AppointmentStatusChart />
       </>
      }
      {(isClient) &&
      <>
       <UserDashboardStats />
       </>
      }
      </div>
    </div>
    </>
  )
}

export default Dashboard