"use client"
import React, { useEffect, useState } from 'react'
import WorkspaceHeader from '../_components/WorkspaceHeader'
import Editor from '../_components/Editor'
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FILE } from '../../dashboard/_components/FileList';
import Canvas from '../_components/Canvas';
import BudgetCalculator from '../_components/BudgetCalculator';
import CanvasSidebar from '../_components/CanvasSidebar';

function Workspace({params}:any) {
   const [triggerSave,setTriggerSave]=useState(false);
   const convex=useConvex();
   const [fileData,setFileData]=useState<FILE|any>();
   useEffect(()=>{
    console.log("FILEID",params.fileId)
    params.fileId&&getFileData();
   },[])

   const getFileData=async()=>{
    const result=await convex.query(api.files.getFileById,{_id:params.fileId})
    setFileData(result);
  }
  return (
    <div>
      <WorkspaceHeader onSave={()=>setTriggerSave(!triggerSave)} />

      {/* Workspace Layout  */}
      <div className='grid grid-cols-[1fr_15fr_4fr] h-screen'>
        {/* First Column - 1/8 */}
          <div className="">
            <CanvasSidebar/>
          </div>
        
        {/* Whiteboard/canvas  */}
        <div className='bg-custom-beige h-screen border-l'>
            <Canvas
             onSaveTrigger={triggerSave}
             fileId={params.fileId}
             fileData={fileData}
            />
        </div>

        {/* calculator */}
        <div className="bg-custom-beige border-l-2 border-custom-teal">
          <BudgetCalculator/>
        </div>

      </div>
    </div>
  )
}

export default Workspace