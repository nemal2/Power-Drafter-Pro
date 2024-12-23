"use client"
import React, { useContext, useEffect, useState } from 'react'
// import SideNavTop from './SideNavTop'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import SideNavBottom from './SideNavBottom';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import SideNavTop, { TEAM } from './SideNavTop';
import { toast } from 'sonner';
import {  ConvexReactClient } from "convex/react";
import { FileListContext } from '@/app/_context/FilesList';



function SideNav() {
    
    const {user}=useKindeBrowserClient();

    const createFile = useMutation(api.file.createFile)

    const [activeTeam,setActiveTeam] = useState<TEAM>();

    const convex = useConvex();

    const [totalFiles,setTotalFiles] = useState<Number>();

    const {fileList_,setFileList_} =useContext(FileListContext)

    useEffect(()=>{
      activeTeam&&getFiles();   
    },[activeTeam])

    const onFileCreate =(fileName:string)=>{
      console.log(fileName)
      createFile({
        fileName:fileName,
        teamId:activeTeam?._id,
        createdBy:user?.email,
        archive:false,
        document:'',
        whiteboard:'',

      }).then(resp =>{
        if(resp){
          getFiles(); 
          toast("File created successfully!")
        }
      },(e)=>{
        toast("Error while creating file")
      }
    )
    }

    const getFiles = async()=>{
      const result = await convex.query(api.file.getFiles,{teamId:activeTeam?._id});
      console.log(result);
      setFileList_(result);
      setTotalFiles(result?.length)
    }
    



  return (
    <div 
    className='bg-gray-100 h-screen fixed w-72 border-rborder-[1px] p-6
    flex flex-col'
    >
        <div className='flex-1'>
        <SideNavTop user={user}
        setActiveTeamInfo={(activeTeam:TEAM)=>setActiveTeam(activeTeam)}
        />
        </div>
   
        <div>
            <SideNavBottom
            totalFiles={totalFiles}
            onFileCreate = {onFileCreate}
            />
        </div>
    </div>
  )
}

export default SideNav