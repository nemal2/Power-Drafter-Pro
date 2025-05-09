"use client"
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useConvex, useMutation, useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import Header from '../dashboard/_components/Header'
import ArchivedFileList from '../dashboard/_components/ArchivedFileList'
import AdBanner from '../../_components/AdBanner'

function ArchivedFilesPage() {
  const convex = useConvex();
  const {user}:any = useKindeBrowserClient();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='p-8'>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Archived Files</h1>
        <p className="text-gray-500 mt-1">View and manage your archived files here</p>
      </div>
      
      <Header onSearch={setSearchTerm}/>
      
      <ArchivedFileList searchTerm={searchTerm} />
      
      <AdBanner
        data-ad-slot="4796371341"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default ArchivedFilesPage 