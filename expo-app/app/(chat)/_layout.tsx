import "@/global.css";
import { API_URL, getMessages, getUsers } from "@/hooks/requests";
import { useUserStore } from "@/hooks/userStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View, StatusBar } from "react-native";
import "react-native-reanimated";
import { io, Socket } from "socket.io-client";

export default function RootLayout() {
  const {
    token,
    setUser,
    hydrated,
    user,
    setSocket,
    setFriends,
    setMessages,
    setTyping,
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
  } = useUserStore();

  useEffect(() => {
    if (!hydrated || !token) return;

    // Initial Data Fetch
    getUsers()
      .then((res) => setFriends(res))
      .catch((err) => console.log("get Users error", err));

    getMessages(token)
      .then((res) => setMessages(res))
      .catch((err) => console.log("get messages error", err));

    // Socket Initialization
    const socket: Socket = io(API_URL, {
      query: { token: token },
    });
    setSocket(socket);

    socket.on("connect", () => console.log("Connected to server"));

    socket.on("newUser", (newUserData) => {
      if (newUserData._id === user?._id) return;
      setFriends((prev) => {
        if (prev.find((f) => f._id === newUserData._id)) return prev;
        return [newUserData, ...prev];
      });
    });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    });

    socket.on("readMessage", (userIdWhoRead) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === user?._id && msg.receiverId === userIdWhoRead
            ? { ...msg, seen: true }
            : msg,
        ),
      );
    });

    socket.on("typing", (senderId) => {
      setTyping(senderId);
    });

    socket.on("stopTyping", () => {
      setTyping(null);
    });

    socket.on("updateUser", (updatedUser) => {
      if (user?._id === updatedUser._id) {
        setUser(updatedUser);
      }
      setFriends((prev) =>
        prev.map((f) => (f._id === updatedUser._id ? updatedUser : f)),
      );
    });

    // Online status tracking
    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("userConnected", (userId: string) => {
      addOnlineUser(userId);
    });

    socket.on("userDisconnected", (userId: string) => {
      removeOnlineUser(userId);
    });

    return () => {
      socket.disconnect();
    };
  }, [hydrated, token, user?._id]);

  if (!hydrated) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="chat/[id]"
          options={{ headerShown: false, presentation: "card" }}
        />
      </Stack>
    </View>
  );
}
