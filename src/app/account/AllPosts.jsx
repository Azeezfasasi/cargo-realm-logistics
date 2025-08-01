import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../../assets/component/DashboardComponents.jsx/DashHeader'
import DashMenu from '../../assets/component/DashboardComponents.jsx/DashMenu'
import AddNewPostMain from '../../assets/component/DashboardComponents.jsx/AddNewPostMain'
import AllBlog from '../../assets/component/HomeComponents.jsx/AllBlog'

function AllPosts() {
  return (
    <>
    <Helmet>
        <title>All Posts - CAC Lightway Assembly</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
       <AllBlog />
      </div>
    </div>
    </>
  )
}

export default AllPosts