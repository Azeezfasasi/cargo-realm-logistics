import React from 'react'
import DashHeader from '@/assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '@/assets/component/DashboardComponents.jsx/DashMenu'
import { Helmet } from 'react-helmet'
import HeroSlidesManager from '@/assets/component/DashboardComponents.jsx/HeroSlidesManager'


export default function ManageHeroSlides() {
  return (
      <>
        <Helmet>
            <title>All Events - Cargo Realm and Logistics</title>
        </Helmet>
        <DashHeader />
        <div className='flex flex-row justify-start gap-4'>
            <div className='hidden lg:block w-[20%]'>
                <DashMenu />
            </div>
        <div className='w-full lg:w-[80%]'>
            <HeroSlidesManager />
        </div>
        </div>
      </>
  )
}
