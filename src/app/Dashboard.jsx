import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../assets/component/DashboardComponents.jsx/DashMenu'
import StaffDashboard from '@/assets/component/DashboardComponents.jsx/StaffDashboard'
import ClientDashboard from '@/assets/component/DashboardComponents.jsx/ClientDashboard'
import { useProfile } from '@/assets/context-api/ProfileContext'

function Dashboard() {
  const { currentUser, isAdmin, isEmployee, isClient, isAgent } = useProfile()
  return (
    <>
    <Helmet>
        <title>Dashboard - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4 bg-gray-50/60'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%] min-w-0'>
        {(isAdmin || isEmployee) && <StaffDashboard />}
        {(isClient || isAgent) && <ClientDashboard />}
        {!currentUser && (
          <div className='space-y-6 p-4 lg:p-6' aria-hidden='true'>
            <div className='h-40 animate-pulse rounded-2xl bg-gray-200' />
            <div className='grid grid-cols-2 gap-3 xl:grid-cols-5'>
              {[0, 1, 2, 3, 4].map((i) => <div key={i} className='h-28 animate-pulse rounded-2xl bg-gray-100' />)}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Dashboard
