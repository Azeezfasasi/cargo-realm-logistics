import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import SendNewsletterMain from '../../assets/component/DashboardComponents.jsx/SendNewsletterMain'

function SendNewsletter() {
  return (
    <>
    <Helmet>
        <title>Send Newsletter - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <SendNewsletterMain />
      </div>
    </div>
    </>
  )
}

export default SendNewsletter