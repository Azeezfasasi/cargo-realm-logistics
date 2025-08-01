import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import BookAppointMain from '../../assets/component/DashboardComponents.jsx/BookAppointMain'

function BookAppointment() {
  return (
    <>
    <Helmet>
        <title>Book Appointment - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <BookAppointMain />
      </div>
    </div>
    </>
  )
}

export default BookAppointment