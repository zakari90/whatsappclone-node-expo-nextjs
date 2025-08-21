"use client"
import { useUserStore } from "@/lib/userStore";
import Image from "next/image";

export function DiscussionHeader() {
    const {user, currentReceiver, typing} = useUserStore();
    

    return(
        <div className="flex bg-gray-800 p-4 text-white">
        
                <div className="w-12 h-12 rounded-full bg-gray-600">
                <Image
                    src={currentReceiver?.profilePicture|| user?.profilePicture || '/icon.png'}
                    width={100}
                    height={100}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover hover:cursor-pointer"
                    />
                </div>
                <div className="ml-4">
                    <h3 className="text-white font-medium">{currentReceiver?.username || user?.username} </h3>
                    <div className="text-gray-400 text-sm">{typing ? 
                    (<p className="animate-pulse"> Typing...</p> ):
                    currentReceiver?.status} </div>
                </div>

            </div>    
    )
}
