import { Message } from "./userStore";

export function getReceiverMessages(messages: Message[], receiverId: string) {
    return messages.filter((message: Message) => {
        return (
            (message.senderId === receiverId || message.receiverId === receiverId)
        );
    });
    
}

export function getLastMessageForUser(friendId: string, messages: Message[], userId?: string) {
  const relevantMessages = getReceiverMessages(messages, friendId)
    .sort((a, b) => {  
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }); 
  return relevantMessages[0]?.content ?? '';
}