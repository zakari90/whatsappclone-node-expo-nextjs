import { useUserStore } from "@/lib/userStore";
import { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";


export function ChatFooter() {

    const { socket,currentReceiver} = useUserStore();
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {    
        e.preventDefault();
        if (newMessage.trim() && socket && currentReceiver?._id) {
            socket.emit("sendMessage", {
            receiverId: currentReceiver._id,
            content: newMessage
            });
            setNewMessage('');
        }
    };

    useEffect(() => {
        if (currentReceiver === null) return;

        if (newMessage !== "") {   
            console.log("typing", newMessage);
                     
            socket?.emit("typing",{ receiverId: currentReceiver._id })
            
        } else {
            socket?.emit("stopTyping",{ receiverId: currentReceiver._id }) 
        }            

    },[newMessage, socket, currentReceiver?._id, currentReceiver]);
    return (
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex gap-2">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-gray-500"
            />
            <button
                className="hover:cursor-pointer  bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-300"
            >
                <FiSend/>
            </button>
        </div>
    </form>
    )
    
}
