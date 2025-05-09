import { FileListContext } from '@/app/_context/FilesListContext'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Archive, MoreHorizontal, Trash } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { api } from '@/convex/_generated/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { useConvex, useMutation } from 'convex/react';
import { toast } from 'sonner';

export interface FILE{
  archive:boolean,
  createdBt:string,
  document:string,
  fileName:string,
  teamId:string,
  whiteboard:string,
  _id:string,
  _creationTime:number
}
function FileList({searchTerm}: {searchTerm: string}) {
  const convex = useConvex();
  const deleteFileMutation = useMutation(api.files.deleteFile);
  const archiveFileMutation = useMutation(api.files.archiveFile);
  const {fileList_,setFileList_}=useContext(FileListContext);
  const [fileList,setFileList]=useState<any>();
  const {user}:any=useKindeBrowserClient();
  const router=useRouter();

  // useEffect(()=>{
  //   fileList_&&setFileList(fileList_);
  //   console.log(fileList_);
  // },[fileList_])

  useEffect(() => {
    if (user) {
      getTeamAndFiles();
    }
  }, [user]);

  const getTeamAndFiles = async () => {
    try {
      const team = await convex.query(api.teams.getTeam, { email: user?.email });
      if (team?.length > 0) {
        const files = await convex.query(api.files.getFiles, { teamId: team[0]._id });
        setFileList_(files);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    if (fileList_) {
      if (searchTerm) {
        // Filter files based on searchTerm
        const filteredFiles = fileList_.filter((file: FILE) => 
          file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFileList(filteredFiles);
      } else {
        // If no search term, show all files
        setFileList(fileList_);
      }
    }
  }, [fileList_, searchTerm]);

  const handleDelete = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation(); // Prevent navigating to workspace
    try {
      // Convert string ID to proper Convex ID type
      deleteFileMutation({ fileId: fileId as any })
        .then((result) => {
          if (result && result.success) {
            toast('File deleted successfully');
            getTeamAndFiles(); // Refresh the file list
          } else {
            toast('Error deleting file: Operation failed');
          }
        })
        .catch((error) => {
          toast('Error deleting file');
          console.error('Error deleting file:', error);
        });
    } catch (error) {
      toast('Error preparing delete request');
      console.error('Error preparing delete request:', error);
    }
  };

  const handleArchiveFile = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation(); // Prevent navigating to workspace
    console.log("Attempting to archive file with ID:", fileId);
    
    try {
      // Using as any to bypass type checking for the ID conversion
      archiveFileMutation({ fileId: fileId as any })
        .then((result) => {
          console.log("Archive result:", result);
          if (result && result.success) {
            toast('File archived successfully');
            // Force refresh the file list
            setTimeout(() => {
              getTeamAndFiles();
            }, 300);
          } else {
            toast(`Archive failed: ${result?.error || 'Unknown error'}`);
          }
        })
        .catch((error) => {
          console.error("Archive error:", error);
          toast('Error during archive operation');
        });
    } catch (error) {
      console.error("Exception in archive handler:", error);
      toast('Failed to process archive request');
    }
  };

  return (
    <div className='mt-10'>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">File Name</td>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Created At</td>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Edited</td>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author</td>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {fileList && fileList.length > 0 ? (
              fileList.map((file:FILE, index:number) => (
                <tr key={index} className="odd:bg-gray-50 cursor-pointer"
                  onClick={() => router.push('/workspace/' + file._id)}
                >
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {file.fileName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {moment(file._creationTime).format('DD MMM YYYY')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {moment(file._creationTime).format('DD MMM YYYY')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {user && <Image 
                      src={user?.picture}
                      alt='user'
                      width={30}
                      height={30}
                      className='rounded-full'
                    />}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <DropdownMenu>
                      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className='gap-3' onClick={(e) => handleArchiveFile(e, file._id)}>
                          <Archive className='h-4 w-4'/> Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className='gap-3 text-red-600 focus:text-red-600' 
                          onClick={(e) => handleDelete(e, file._id)}
                        >
                          <Trash className='h-4 w-4'/> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  {searchTerm ? 'No files found matching your search' : 'No files available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileList