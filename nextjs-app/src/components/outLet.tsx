"use client"
import { getReceiverMessages } from '@/lib/helpers';
import { Message, useUserStore } from '@/lib/userStore';
import React, { useEffect, useRef, useState } from 'react';
import { ChatFooter } from './chatFooter';
import { DiscussionHeader } from './discutionHeader';
import { MessageBubble } from './messageBubble';

function OutLet() {

    const { hydrated,messages,currentReceiver,user} = useUserStore();
    const [displayedMessage, setDisplayedMessage] = useState<Message[]>([]);


    useEffect(() => {        
        if (user && messages && currentReceiver) {
          const receivedMessages = getReceiverMessages(messages, currentReceiver?._id);
          setDisplayedMessage(receivedMessages);
        }
      }, [user, messages,currentReceiver,hydrated]);

      const messagesEndRef = useRef(null) as React.RefObject<HTMLDivElement | null>;

      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [displayedMessage]);

  return (
    <div className="w-4/5 flex flex-col h-screen ">

    <div>
     <DiscussionHeader/>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {displayedMessage.length > 0 && user && currentReceiver? (
             displayedMessage.map((message, i) => (
             <div ref={messagesEndRef} key={message._id || i}>
                 <MessageBubble userID={user?._id} message={message} />
             </div>
             ))
         ) : (
             <div className="flex justify-center items-center h-full">
             <p className="text-gray-500">Welcome to the chat</p>
             </div>
         )}
         </div>
    <ChatFooter/>
 </div>
  )
}

export default OutLet



