import { FileListContext } from '@/app/_context/FilesListContext'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Trash, RotateCcw } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { api } from '@/convex/_generated/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { useConvex, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { FILE } from './FileList';
import { Button } from '@/components/ui/button';

interface ArchivedFileListProps {
  searchTerm?: string;
}

function ArchivedFileList({ searchTerm = '' }: ArchivedFileListProps) {
  const convex = useConvex();
  const deleteFileMutation = useMutation(api.files.deleteFile);
  const restoreFileMutation = useMutation(api.files.restoreFile);
  const [archivedFiles, setArchivedFiles] = useState<any>([]);
  const [filteredFiles, setFilteredFiles] = useState<any>([]);
  const {user}:any=useKindeBrowserClient();
  const router=useRouter();

  useEffect(() => {
    if (user) {
      getTeamAndArchivedFiles();
    }
  }, [user]);

  useEffect(() => {
    if (archivedFiles) {
      if (searchTerm) {
        // Filter files based on searchTerm
        const filtered = archivedFiles.filter((file: FILE) => 
          file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFiles(filtered);
      } else {
        // If no search term, show all files
        setFilteredFiles(archivedFiles);
      }
    }
  }, [archivedFiles, searchTerm]);

  const getTeamAndArchivedFiles = async () => {
    const team = await convex.query(api.teams.getTeam, { email: user?.email });
    if (team?.length > 0) {
      const files = await convex.query(api.files.getArchivedFiles, { teamId: team[0]._id });
      setArchivedFiles(files);
    }
  };

  const handleDelete = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation(); // Prevent navigating to workspace
    try {
      // Convert string ID to proper Convex ID type
      deleteFileMutation({ fileId: fileId as any })
        .then((result) => {
          if (result && result.success) {
            toast('File deleted permanently');
            getTeamAndArchivedFiles(); // Refresh the file list
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

  const handleRestore = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation(); // Prevent navigating to workspace
    try {
      // Convert string ID to proper Convex ID type
      restoreFileMutation({ fileId: fileId as any })
        .then((result) => {
          if (result && result.success) {
            toast('File restored successfully');
            getTeamAndArchivedFiles(); // Refresh the archived files list
          } else {
            toast('Error restoring file: Operation failed');
          }
        })
        .catch((error) => {
          toast('Error restoring file');
          console.error('Error restoring file:', error);
        });
    } catch (error) {
      toast('Error preparing restore request');
      console.error('Error preparing restore request:', error);
    }
  };

  if (filteredFiles.length === 0) {
    return (
      <div className="mt-10 text-center p-8 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">
          {searchTerm ? 'No archived files found matching your search' : 'No archived files'}
        </h3>
        <p className="text-gray-500 mt-1">
          {searchTerm ? 'Try a different search term' : 'Files you archive will appear here'}
        </p>
      </div>
    );
  }

  return (
    <div className='mt-10'>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">File Name</td>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Archived Date</td>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Author</td>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Actions</td>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredFiles.map((file:FILE, index:number) => (
              <tr key={index} className="odd:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {file.fileName}
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
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 flex space-x-2">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={(e) => handleRestore(e, file._id)}
                    className="flex items-center space-x-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Restore</span>
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={(e) => handleDelete(e, file._id)}
                    className="flex items-center space-x-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ArchivedFileList 