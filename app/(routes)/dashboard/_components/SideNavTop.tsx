"use client"
import React, { useEffect } from 'react'
import { ChevronDown, LayoutGrid, LogOut, Settings, Users } from 'lucide-react'
import Image from 'next/image'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import path from 'path'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs'
import { Separator } from '@/components/ui/separator'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'


export interface TEAM{
    createdBy:string,
    teamName:string,
    _id:string
}


function SideNavTop({user}:any) {

    const menu = [
        {
            id: 1,
            name: 'Create Team',
            path: '/teams/create',
            icon: Users
        },
        {
            id: 2,
            name: 'Settings',
            path: '',
            icon: Settings
        }
    ];

    const router = useRouter();
    const convex = useConvex();
    const [teamList, setTeamList] = React.useState<TEAM[]>();
    const [activeTeam, setActiveTeam] = React.useState<TEAM>();
    
    useEffect(() => {
        user&&getTeamList();
    }, [user]);

    const getTeamList = async () => {
        const result = await convex.query(api.teams.getTeams, { email: user?.email });
        console.log("Team List",result);
        setTeamList(result);
        setActiveTeam(result[0]);
    }

    const onMenuClick = (item: any) => {
        router.push(item.path);
    }

    return (
        <div>
        <Popover>
            <PopoverTrigger>
                <div className='flex items-center gap-3
        hover:bg-slate-200 p-3 rounded-md cursor-pointer'
                >
                    <Image src='/96.png'
                        alt='logo'
                        width={40}
                        height={40} />
                    <h2 className='flex gap-2 items-center
            font-bold text-[17px]'>{activeTeam?.teamName}
                        <ChevronDown />
                    </h2>

                </div>
            </PopoverTrigger>
            <PopoverContent className='ml-7 p-4' >
                {/* Team Section */}
                <div>
                    {teamList?.map((item,index)=>(
                        <h2 key={index}
                        className={`p-2 hover:bg-blue-500 hover:text-white
                         rounded-lg mb-1cursor-pointer  ${activeTeam?._id===item._id&&'bg-blue-500 text-white'}`} 
                        onClick={()=>setActiveTeam(item)}
                        >{item.teamName}</h2>
                    ))}
                </div>
                <Separator className='mt-2 bg-slate-100' />

                {/* Menu Section */}
                <div >
                    {menu.map((item,index)=>(
                        <h2 key={index} 
                        className='flex gap-2 items-center
                        p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-sm'
                        onClick={()=>onMenuClick(item)}>
                            <item.icon className='h-4 w-4'/>
                            {item.name}</h2>
                    ))}

                    <LogoutLink>
                        <h2 className='flex gap-2 items-center
                        p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-sm'>
                            <LogOut className='h-4 w-4'/>
                            Logout</h2>
                            </LogoutLink>
                            
                </div>
                <Separator className='mt-2 bg-slate-100'/>

                {/* User Info */}
                <div className='mt-2 flex gap-2 items-center'>
                    {user&&<Image src={user?.picture} 
                    alt='user' 
                    width={30} 
                    height={30}
                    className='rounded-full'>
                    </Image>}
                    <div>
                        <h2 className='text-[14px] font-bold'>{user?.given_name} {user?.family_name}</h2>
                        <h2 className='text-[12px] text-gray-500'>{user?.email}</h2>
                    </div>
                </div>
            </PopoverContent>
        </Popover>

        {/* All file button */}
        <Button variant='outline'
        className='w-full justify-start gap-2 font-bold
        mt-8'>
            <LayoutGrid className='h-5 w-5'/>
            All Files
        </Button>
        </div>

    )
}

export default SideNavTop