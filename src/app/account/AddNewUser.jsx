import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import AddNewUserMain from '../../assets/component/DashboardComponents.jsx/AddNewUserMain'

function AddNewUser() {
  return (
    <>
    <Helmet>
        <title>Add New User - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <AddNewUserMain />
      </div>
    </div>
    </>
  )
}

export default AddNewUser