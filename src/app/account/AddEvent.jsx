import React from 'react'
import { Helmet } from 'react-helmet'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import AddEventMain from '../../assets/component/DashboardComponents.jsx/AddEventMain'

function AddEvent() {
  return (
    <>
    <Helmet>
        <title>Add New Event - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
       <AddEventMain />
      </div>
    </div>
    </>
  )
}

export default AddEvent