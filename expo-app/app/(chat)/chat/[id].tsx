import { Message, useUserStore } from '@/hooks/userStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import moment from "moment";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { hydrated, messages, currentReceiver} = useUserStore();

  useEffect(() => {
    if (!hydrated) return;
    
  }, [hydrated]);
  
  const router = useRouter();

const flatListRef = useRef<any>(null);

useEffect(() => {
  // if (!flatListRef.current || messages.length === 0) return;
  flatListRef.current.scrollToEnd({ animated: true });
}, [messages]);
  if (!hydrated) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Chat Header */}
      <View className="flex-row items-center justify-between min-h-28 p-4">
        <Pressable onPress={() => { if (router.canGoBack?.()) { router.back();
    } else {
      router.replace("/(chat)/(tabs)/users");
    }
  }} className="flex-row items-center">
        <MaterialIcons name="arrow-back" size={24} color="#2563EB" />
          </Pressable>

        <Text className="text-lg font-medium text-gray-600"> {currentReceiver?.username}</Text>
      </View>
      <View className='flex-1 px-4 py-2 '>

        <FlatList
        ref={flatListRef}
        data={messages.filter((msg) => msg.receiverId === id || msg.senderId === id)}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isCurrentUser={item.senderId === id}
          />
        )}
        />
      </View>

    <ChatFooter/>

    </SafeAreaView>
  );
}

type Props = {
  message: Message;
  isCurrentUser?: boolean;
};

export function MessageBubble({ message, isCurrentUser = false }: Props) {
  return (
    <View
      className={`max-w-[80%] my-2 px-4 py-2 rounded-xl ${
        isCurrentUser
          ? 'self-start bg-blue-400 rounded-bl-none'
          :  'self-end bg-green-400 rounded-br-none'
      }`}
    >
      <Text className="text-white text-base">{message.content}</Text>
      <Text className="text-xs opacity-75" >{moment(message.createdAt).format("hh:mm A")}</Text>
    </View>
  );
}


function ChatFooter() {
    const { socket,currentReceiver} = useUserStore();
    const [newMessage, setNewMessage] = useState('');


  const handleSendMessage = () => {    
      if (newMessage.trim() && socket && currentReceiver?._id) {
          socket.emit("sendMessage", {
          receiverId: currentReceiver._id,
          content: newMessage
          });
          setNewMessage('');
      }
  };

      useEffect(() => {
        if (currentReceiver === null) return;

        if (newMessage !== "") {   
            console.log("typing", newMessage);
                     
            socket?.emit("typing",{ receiverId: currentReceiver._id })
            
        } else {
            socket?.emit("stopTyping",{ receiverId: currentReceiver._id }) 
        }            

    },[newMessage, socket, currentReceiver?._id, currentReceiver]);

  return(
          <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        className="w-full px-4 pt-2 pb-6 bg-gray-100"
      >
        <View className="flex-row items-center bg-white rounded-full shadow px-4 py-2">
          <TextInput
            className="flex-1 p-4 text-base text-gray-800 pr-10"
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            placeholderTextColor="#888"
          />
          <Pressable onPress={handleSendMessage}>
            <MaterialIcons name="send" size={24} color="#2563EB" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
  )
}
