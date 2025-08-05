import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import ProfileMain from '../../assets/component/DashboardComponents.jsx/ProfileMain'

function Profile() {
  return (
    <>
    <Helmet>
        <title>Profile - Cargo Realm and Logistics</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <ProfileMain />
      </div>
    </div>
    </>
  )
}

export default Profile