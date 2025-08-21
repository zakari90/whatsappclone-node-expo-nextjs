'use client';

import { updateProfile } from '@/actions/auth';
import { useUserStore } from '@/lib/userStore';
import axios from 'axios';
import Image from 'next/image';
import React, { useActionState, useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { CgArrowLeft } from 'react-icons/cg';


const Profile = ({ onClose }: {onClose: () => void}) => {
  const {user,token,setUser} = useUserStore();
  const [state, action, isPending] = useActionState(updateProfile,undefined)

  const [previewImage, setPreviewImage] = useState<string>(user?.profilePicture || '');
  const [userName, setuserName] = useState<string>(user?.username || '');
  const [status, setstatus] = useState<string>(user?.status || '');

  useEffect(() => {
    console.log(state);
    
  }, [state, user, setUser]);

  
  const  handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];    
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('profilePicture', file);
      await axios.post(
        "http://localhost:8000/user/updateprofilepicture",
        formData,
        {
        headers: {
            "Content-Type": "multipart/form-data",
            authorization: `bearer ${token}`,
        },
        }
    );
    }
  };

  return (
    <div className="w-1/4 min-w-[300px] h-screen bg-gray-800 border-r border-gray-700">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        
        <form action={action} className="space-y-4">
        <div className="relative flex items-center justify-center mb-8">
          <button
            onClick={onClose}
            className="absolute left-0 top-0 p-2 bg-gray-200 rounded-full hover:bg-gray-300 hover:cursor-pointer"
          >
            <CgArrowLeft className="w-6 h-6 text-gray-600" />
          </button>

          <Image
            src={ previewImage}
            width={100}
            height={100}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />

          <input
            type="file"
            name='profilePictures'
            accept="image/*"
            className="hidden"
            id="profilePicture"
            onChange={handleFileChange}
          />
          <label
            htmlFor="profilePicture"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-1 bg-white rounded-full shadow hover:cursor-pointer hover:bg-gray-100"
          >
            <BiEdit className="w-4 h-4 text-blue-500" />
          </label>
        </div>
        <div className="flex flex-col gap-6 mb-6">
          <div className="space-y-2">
            <p className="text-gray-600">{user?.username}</p>
            <input
            name='username'
            type="text"
            value={userName }
            onChange={(e) => setuserName(e.target.value)}
            className="border rounded px-2 py-1 text-gray-800"
            />
          </div>
          <div className="space-y-2">
          <p className="text-gray-600">{user?.status}</p>
          <input
            name='status'
            type="text"
            value={status }
            onChange={(e) => setstatus(e.target.value)}
            className="border rounded px-2 py-1 text-gray-800"
            />

          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Email</p>
            <p className="text-gray-800">New@York.USA</p>
          </div>
        </div>
        <input type="hidden" name="token" value={token||""} />
        <div >
        <button
          type='submit'
          disabled={isPending}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
        </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;
