import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import { getMessages, getUsers } from "@/hooks/requests";
import { useUserStore } from "@/hooks/userStore";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { token, hydrated, setFriends, setMessages } = useUserStore();

  useEffect(() => {
    if (!hydrated || !token) return;

    getUsers()
      .then((res) => setFriends(res))
      .catch((err) => console.log("get Users error", err));

    getMessages(token)
      .then((res) => {
        setMessages(res);
      })
      .catch((err) => console.log("get messages error", err));
  }, [token, hydrated]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          height: Platform.OS === "ios" ? 88 : 65,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="users"
        options={{
          title: "Chats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"
              }
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
