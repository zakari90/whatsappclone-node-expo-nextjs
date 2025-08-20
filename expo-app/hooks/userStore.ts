import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';

export type User = {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  status: string;
};

export type Message = {
_id: string;
content: string;
seen: boolean;
senderId: string;
receiverId: string;
createdAt: string;

};

interface UserStore {
  user: User | null;
  token: string | null;
  friends: User[];
  currentReceiver: User | null;
  setCurrentReceiver: (currentReceiver: User) => void;
  messages: Message[];
  setFriends: (updater: User[] | ((prev: User[]) => User[])) => void;
  setMessages: (updater: Message[] | ((prev: Message[]) => Message[])) => void;
  hydrated: boolean;
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
  typing: boolean;
  setTyping: (typing: boolean) => void;
}

export const useUserStore = create<UserStore>()(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      friends: [],
      messages: [],
      socket: null,
      typing: false,
      currentReceiver: null,
      setCurrentReceiver: (currentReceiver) => set({ currentReceiver }),
      setSocket: (socket) => set({ socket }),
      setFriends: (updater) =>
        set((state) => ({
          friends: typeof updater === "function" ? updater(state.friends) : updater,
        })),
      setMessages: (updater) =>
        set((state) => ({
          messages: typeof updater === "function" ? updater(state.messages) : updater,
        })),
      setToken:async (token) => {
        if (token) {          
          await AsyncStorage.setItem("token", JSON.stringify(token))
        }
        return set({ token })},
      setUser:async (user) =>{ 
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user))
        }
        return set({ user })},
      clearUser: async () => {
        await AsyncStorage.clear()
        return set({ user: null, token: null, friends: [], messages: [], socket: null, currentReceiver: null, typing: false })
      },
      setHydrated: (hydrated) => set({ hydrated }),
      setTyping: (typing) => set({ typing }),

    })
);
