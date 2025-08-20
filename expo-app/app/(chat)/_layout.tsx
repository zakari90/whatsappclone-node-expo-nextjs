import "@/global.css";
import { API_URL, getMessages, getUsers } from "@/hooks/requests";
import { useUserStore } from "@/hooks/userStore";
import { Stack } from 'expo-router';
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import 'react-native-reanimated';
import { io, Socket } from "socket.io-client";

export default function RootLayout() {

const {typing,token,setUser, hydrated ,user,currentReceiver, setSocket, setFriends, setMessages, setTyping} = useUserStore();

useEffect(() => {
  if (!hydrated) return;    
  if (!token) return;

  getUsers()
    .then((res) => setFriends(res))
    .catch((err) => console.log("get Users error", err));

  getMessages(token)
    .then((res) => {setMessages(res)})
    .catch((err) => console.log("get messages error", err));

   const socket: Socket = io(API_URL, {
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
      }, [currentReceiver, hydrated, setFriends, setMessages, setSocket, setTyping, setUser, token, typing, user?._id]);

   if (!hydrated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
  <Stack>        
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="chat/[id]" options={{ headerShown: false, presentation:"card" }} />
  </Stack>

  );
}
