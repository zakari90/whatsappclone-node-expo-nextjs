import { Message } from "@/lib/userStore";
import moment from "moment";

export function MessageBubble({ message ,userID }: {message :Message, userID: string}) {
    const isSender = message.senderId === userID;
    return (
        <div
            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[70%] rounded-lg p-3 ${
                    isSender ? 'bg-gray-600 text-white' : 'bg-green-200'
                }`}
            >
                <p>{message.content}</p>
                <span className="text-xs opacity-75">

                {moment(message.createdAt).format("hh:mm A")}
                    
                </span>
            </div>
        </div>
    );
}