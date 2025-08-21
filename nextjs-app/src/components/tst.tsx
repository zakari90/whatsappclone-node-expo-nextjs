import { getReceiverMessages } from "@/lib/helpers";
import { useUserStore } from "@/lib/userStore";
import Image from "next/image";


export function UserElement({selectedUser, message}: { selectedUser: string, message?: string}) {
    
    const {user  ,messages ,currentReceiver, } = useUserStore();

    const unreadMessages =  getReceiverMessages(
        messages,currentReceiver?._id).filter(
        (msg) => !msg.seen && msg.receiverId === user?._id).length;    
    
    return (
        <div
        
        className="flex items-center p-4 hover:bg-gray-500 cursor-pointer border-b border-gray-700"
    >
        <div className="w-12 h-12 rounded-full bg-gray-600">
        <Image
            src={ '/icon.png'}
            width={100}
            height={100}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover hover:cursor-pointer"
            />
        </div>
        <div className="ml-4">
            <h3 className="text-white font-medium">User {selectedUser} </h3>
            <p className="text-gray-400 text-sm">Latest message... {message}</p>
        </div>
        <div className="ml-auto text-xs text-gray-400 rounded-2xl bg-gray-600 px-2 py-1">
           {unreadMessages}
        </div>
    </div>    
     )
}