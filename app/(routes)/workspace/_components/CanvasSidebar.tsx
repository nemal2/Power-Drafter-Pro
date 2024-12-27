import React from 'react'
import { LayoutGrid, Cpu, FolderPlus, Text, ArrowRightFromLine } from 'lucide-react';

function CanvasSidebar() {
  return (
    <div className="flex flex-col min-h-screen space-y-12 text-gray-500 items-center p-6">
        <Text className="text-2xl" />
        <LayoutGrid className="text-2xl" />
        <Cpu className="text-2xl" />
        <FolderPlus className="text-2xl" />
        {/* Spacer to push the icon to the bottom */}
          {/* <ArrowRightFromLine className="text-2xl" /> */}
        {/* Bottom Icon */}
        
    </div>
  )
}

export default CanvasSidebar
