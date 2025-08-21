"use client";
import { User, useUserStore } from '@/lib/userStore';
import Image from 'next/image';
import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { IoFilter } from 'react-icons/io5';
import Profile from './profile';
import { getReceiverMessages } from '@/lib/helpers';
import { UserElement } from './userElement';

const Sidebar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [showUnseenMessages, setshowUnseenMessages] = useState(false);
    const {friends ,user ,socket ,messages ,currentReceiver, setCurrentReceiver} = useUserStore();

    if (showProfile) {
        return <Profile onClose={() => setShowProfile(false)} />;
      }

    function handleSearch(friend: User) {
    return friend.username.toLowerCase().includes(searchQuery.toLowerCase().trim());}
      
    function handShooseReceiver(friend: User) {
        setCurrentReceiver(friend);
        socket?.emit("readMessage", { receiverId: friend._id });

    }

    function handleUnseenMessages(friend: User) {
        console.log("friends",friend._id, showUnseenMessages);
        
        if (!showUnseenMessages) return true;
      
        const contactMessages = getReceiverMessages(messages,friend?._id)
        const contactUnseenMessages = contactMessages.some(
            messages=> !messages.seen
        )
    
    
        return contactUnseenMessages
      }
       

    return (
        <div className="w-1/4 min-w-[300px] scroll-auto h-screen bg-gray-800 border-r border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-600">
                            <Image
                            src={ user?.profilePicture || '/icon.png'}
                            width={100}
                            height={100}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover hover:cursor-pointer"
                            onClick={() => setShowProfile(true)}
                           />
                        </div>
                        <h1 className="ml-3 text-xl font-semibold text-white">{user?.username}</h1>
                    </div>

                </div>
                {/* Search Bar */}
                <div className='flex items-center justify-between '>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 pl-10 bg-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <BiSearch className='absolute left-3 top-3 w-4 h-4 text-gray-400'/>
                </div>
                <button 
                onClick={() => setshowUnseenMessages(!showUnseenMessages)}
                className='hover:cursor-pointer p-2 rounded-full hover:bg-gray-700'>
                    <IoFilter className='text-gray-300'/>
                </button>
                </div>

            </div>

            <div className="overflow-y-auto h-[calc(100vh-180px)]">
  {
    friends.length === 0 ? (
      <div className='text-gray-400 text-center'>No friends</div>
    ) : (
      friends
        .filter((friend) => handleSearch(friend))
        .filter((friend) => handleUnseenMessages(friend))
        .map((friend) => {
          if (friend._id === user?._id) return null;

          const unreadCount = messages.filter(
            (msg) =>
              msg.senderId === friend._id &&
              msg.receiverId === user?._id &&
              !msg.seen
          ).length;

          if (showUnseenMessages && unreadCount === 0) return null;

          return (
            <div
              key={friend._id}
              className={friend._id === currentReceiver?._id ? 'bg-blue-700' : ''}
              onClick={() => handShooseReceiver(friend)}
            >
              <UserElement
                selectedUser={friend.username}
                message=""
                unreadMessages={unreadCount}
              />
            </div>
          );
        })
    )
  }
</div>

        </div>
    );
};

export default Sidebar;

 
