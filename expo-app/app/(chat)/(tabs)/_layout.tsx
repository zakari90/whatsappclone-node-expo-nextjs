import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { getMessages, getUsers } from '@/hooks/requests';
import { useUserStore } from '@/hooks/userStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  
const {token,hydrated , setFriends, setMessages} = useUserStore();

useEffect(() => {
  if (!hydrated) return;    
  if (!token) return;

  getUsers()
    .then((res) => setFriends(res))
    .catch((err) => console.log("get Users error", err));

  getMessages(token)
    .then((res) => {
      setMessages(res);
    })
    .catch((err) => console.log("get messages error", err));
}, [token, setFriends, setMessages, hydrated]);

  return (
    <Tabs  
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="users"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="people" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
