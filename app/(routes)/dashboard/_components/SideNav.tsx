"use client"
import React from 'react'
import SideNavTop from './SideNavTop'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import SideNavBottom from './SideNavBottom';


function SideNav() {
    


    const {user}=useKindeBrowserClient();
  return (
    <div 
    className='bg-gray-100 h-screen fixed w-72 border-rborder-[1px] p-6
    flex flex-col'
    >
        <div className='flex-1'>
        <SideNavTop user={user}/>
        </div>
   
        <div>
            <SideNavBottom/>
        </div>
    </div>
  )
}

export default SideNav