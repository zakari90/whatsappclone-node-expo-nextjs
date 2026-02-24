import { getLastMessageForUser } from "@/hooks/helpers";
import { resolveProfilePicture } from "@/hooks/utils";
import { User, useUserStore } from "@/hooks/userStore";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UsersScreen() {
  const { hydrated, friends, user, messages, clearUser } = useUserStore();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  const filteredFriends = friends.filter(
    (friend) =>
      friend._id !== user?._id &&
      friend.username.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const handleLogout = () => {
    clearUser();
    router.replace("/");
  };

  if (!hydrated) return null;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Chats</Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/(chat)/(tabs)/profile")}
            className="mr-3"
          >
            <Image
              source={
                user?.profilePicture
                  ? { uri: resolveProfilePicture(user.profilePicture) }
                  : require("@/assets/images/adaptive-icon.png")
              }
              className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-5 py-3">
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-3 py-2">
          <Ionicons name="search-outline" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search conversations..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* User List */}
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const lastMessage = getLastMessageForUser(
            item._id,
            messages,
            user?._id,
          );
          const unreadMessages = messages.filter(
            (msg) => msg.senderId === item._id && !msg.seen,
          ).length;

          return (
            <SimpleUserElement
              selectedUser={item}
              message={lastMessage}
              unreadMessages={unreadMessages}
            />
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Ionicons name="chatbubbles-outline" size={64} color="#e5e7eb" />
            <Text className="text-gray-400 mt-4 text-lg">
              {searchQuery ? "No results found" : "No active chats yet"}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function SimpleUserElement({
  selectedUser,
  message,
  unreadMessages,
}: {
  selectedUser: User;
  message?: string;
  unreadMessages: number;
}) {
  const router = useRouter();
  const { setCurrentReceiver, socket, onlineUsers } = useUserStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  const handlePress = () => {
    setCurrentReceiver(selectedUser);
    socket?.emit("readMessage", { receiverId: selectedUser._id });
    router.replace(`/chat/${selectedUser._id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className="flex-row items-center px-5 py-3 border-b border-gray-50 active:bg-gray-50"
      onPress={handlePress}
    >
      <View className="relative">
        <Image
          source={
            selectedUser.profilePicture
              ? { uri: resolveProfilePicture(selectedUser.profilePicture) }
              : require("@/assets/images/adaptive-icon.png")
          }
          className="w-14 h-14 rounded-full bg-gray-100"
        />
        {/* Presence indicator */}
        {isOnline && (
          <View className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>

      <View className="flex-1 ml-4 py-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
            {selectedUser.username}
          </Text>
          {unreadMessages > 0 && (
            <View className="bg-blue-500 rounded-full px-1.5 py-0.5 min-w-[20px] items-center justify-center">
              <Text className="text-[10px] text-white font-bold">
                {unreadMessages}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-between items-center mt-0.5">
          <Text
            className={`text-sm flex-1 ${unreadMessages > 0 ? "text-gray-900 font-bold" : "text-gray-500"}`}
            numberOfLines={1}
          >
            {message || "Tap to start chatting"}
          </Text>
          {/* Optional: Message time could go here if available */}
        </View>
      </View>
    </TouchableOpacity>
  );
}
