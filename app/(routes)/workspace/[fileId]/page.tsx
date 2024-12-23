import React from 'react'
import WorkspaceHeader from './_components/WorkspaceHeader'
import Canvas from './_components/Canvas'


function workspace() {
  return (
    <div>
        <WorkspaceHeader/>

        {/* workspace layout */}

        <div className='grid grid-cols-1
        md:grid-cols-[4fr_1fr]'>
            {/* Canvas */}
            <div className='  h-screen'>
                <Canvas/>
            </div>




            {/* calculator */}
            <div className=' bg-lime-200'>
                calculator
            </div>
        </div>
    </div>
  )
}

export default workspace