import { Message } from "./userStore";

export function getReceiverMessages(messages: Message[], receiverId: string) {
    return messages.filter((message: Message) => {
        return (
            (message.senderId === receiverId || message.receiverId === receiverId)
        );
    });
    
}