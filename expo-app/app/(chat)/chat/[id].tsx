import { Message, useUserStore } from "@/hooks/userStore";
import { resolveProfilePicture } from "@/hooks/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const {
    hydrated,
    messages,
    currentReceiver,
    user,
    typing,
    socket,
    onlineUsers,
  } = useUserStore();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const isReceiverOnline = onlineUsers.includes(id as string);

  // Scroll to bottom when messages change or typing status changes
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  }, [messages, typing]);

  if (!hydrated) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const isOtherUserTyping = typing === id;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(chat)/(tabs)/users");
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" />

      {/* Gradient Header */}
      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: Math.max(insets.top, 20) }}
        className="pb-4 px-4"
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center flex-1 ml-3">
            <View className="relative">
              <Image
                source={
                  currentReceiver?.profilePicture
                    ? {
                        uri: resolveProfilePicture(
                          currentReceiver.profilePicture,
                        ),
                      }
                    : require("@/assets/images/adaptive-icon.png")
                }
                className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30"
              />
              <View
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                style={{
                  backgroundColor: isReceiverOnline ? "#34d399" : "#9ca3af",
                }}
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-lg font-bold text-white">
                {currentReceiver?.username}
              </Text>
              {isOtherUserTyping ? (
                <View className="flex-row items-center">
                  <Text className="text-sm text-indigo-100 italic">typing</Text>
                  <TypingDots />
                </View>
              ) : isReceiverOnline ? (
                <Text className="text-sm text-emerald-300">Online</Text>
              ) : (
                <Text className="text-sm text-indigo-200">Offline</Text>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-2">
              <Ionicons name="videocam" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Ionicons name="call" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Messages Area */}
      <FlatList
        ref={flatListRef}
        data={messages.filter(
          (msg) => msg.receiverId === id || msg.senderId === id,
        )}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble message={item} isMe={item.senderId === user?._id} />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full bg-indigo-100 items-center justify-center mb-4">
              <Ionicons name="chatbubbles-outline" size={36} color="#6366f1" />
            </View>
            <Text className="text-gray-500 text-center">
              No messages yet.{"\n"}Say hi! 👋
            </Text>
          </View>
        }
      />

      <ChatFooter />
    </View>
  );
}

function TypingDots() {
  return (
    <View className="flex-row ml-1">
      <View className="w-1.5 h-1.5 rounded-full bg-indigo-200 mx-0.5 animate-bounce" />
      <View
        className="w-1.5 h-1.5 rounded-full bg-indigo-200 mx-0.5 animate-bounce"
        style={{ animationDelay: "0.1s" }}
      />
      <View
        className="w-1.5 h-1.5 rounded-full bg-indigo-200 mx-0.5 animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
    </View>
  );
}

function MessageBubble({ message, isMe }: { message: Message; isMe: boolean }) {
  return (
    <View className={`mb-3 flex-row ${isMe ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] px-4 py-3 ${
          isMe
            ? "bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl rounded-br-lg"
            : "bg-white rounded-3xl rounded-bl-lg shadow-sm border border-gray-100"
        }`}
        style={isMe ? { backgroundColor: "#6366f1" } : {}}
      >
        <Text
          className={`text-[15px] leading-6 ${isMe ? "text-white" : "text-gray-800"}`}
        >
          {message.content}
        </Text>
        <View className="flex-row items-center justify-end mt-1.5">
          <Text
            className={`text-[10px] ${isMe ? "text-indigo-200" : "text-gray-400"}`}
          >
            {moment(message.createdAt).format("h:mm A")}
          </Text>
          {isMe && (
            <View className="ml-1.5">
              <Ionicons
                name={message.seen ? "checkmark-done" : "checkmark"}
                size={14}
                color={message.seen ? "#a5b4fc" : "#c7d2fe"}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function ChatFooter() {
  const { socket, currentReceiver } = useUserStore();
  const [newMessage, setNewMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSendMessage = () => {
    if (newMessage.trim() && socket && currentReceiver?._id) {
      socket.emit("sendMessage", {
        receiverId: currentReceiver._id,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (!currentReceiver || !socket) return;

    if (newMessage.length > 0) {
      socket.emit("typing", { receiverId: currentReceiver._id });
    } else {
      socket.emit("stopTyping", { receiverId: currentReceiver._id });
    }
  }, [newMessage, socket, currentReceiver?._id]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        className="bg-white border-t border-gray-100 px-4 pt-3 shadow-lg"
      >
        <View
          className={`flex-row items-end rounded-3xl px-4 py-2 ${
            isFocused
              ? "bg-indigo-50 border-2 border-indigo-300"
              : "bg-gray-100 border-2 border-transparent"
          }`}
        >
          <TouchableOpacity className="pb-2 pr-2">
            <Ionicons name="add-circle" size={28} color="#6366f1" />
          </TouchableOpacity>

          <TextInput
            className="flex-1 py-2 text-[16px] text-gray-900 max-h-24"
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor="#9ca3af"
            multiline
          />

          <View className="flex-row items-end pb-1">
            {newMessage.trim().length > 0 ? (
              <Pressable
                onPress={handleSendMessage}
                className="bg-indigo-500 w-10 h-10 rounded-full items-center justify-center ml-2 active:bg-indigo-600"
              >
                <Ionicons
                  name="send"
                  size={18}
                  color="white"
                  style={{ marginLeft: 2 }}
                />
              </Pressable>
            ) : (
              <>
                <TouchableOpacity className="p-2">
                  <Ionicons name="camera" size={24} color="#6366f1" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2">
                  <Ionicons name="mic" size={24} color="#6366f1" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
