'use client';
import { getMessages, getUsers } from '@/actions/message';
import OutLet from '@/components/outLet';
import Sidebar from '@/components/sideBar';
import { useUserStore } from '@/lib/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
export default function ChatPage() {

    const router = useRouter();

    const {typing,token,setUser, hydrated ,user,currentReceiver, setSocket, setFriends, setMessages, setTyping} = useUserStore();
   
    useEffect(() => {        

        if (!hydrated) return;
        if (!token) {
          router.push('/');
        }
        getUsers()
          .then((res) => {setFriends(res);})
          .catch((err) => { console.log("get Users error",err);
           });
           //todo: dont fetch all the messages
        getMessages(token)
            .then((res) => {setMessages(res);})
            .catch((err) => {  console.log("get messages error", err) });

        const socket: Socket = io('http://localhost:8000', {
            query: { token: token },});
        setSocket(socket);
            
        socket.on('connect_error', (err) => {
            console.error('Connection error:', err);
        });
        socket.on('connect', () => {
            console.log('Connected to server', socket.id);
        })
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        })
        socket.on("newUser", (newUserData) => {
            if(newUserData._id === user?._id) return;
            setFriends(prev => [...prev, newUserData]);
        });
        socket.on("receiveMessage", (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        });
        
        socket.on("typing", () => {
            setTyping(true);
        });
        socket.on("stopTyping", () => {
            setTyping(false);
        });            
        socket.on("updateUser",(updatedUser)=>{
            console.log("updatedUser", updatedUser);
            if (user?._id === updatedUser._id) {
                setUser(updatedUser);
                
            }
            
        })
     
        return () => {
            socket.disconnect();
        }

      }, [currentReceiver, hydrated, router, setFriends, setMessages, setSocket, setTyping, setUser, token, typing, user?._id]);

    return (<>
        <div className='flex w-full h-screen'>
            <Sidebar/>
            <OutLet/>
        </div>
        </>

    );
}





