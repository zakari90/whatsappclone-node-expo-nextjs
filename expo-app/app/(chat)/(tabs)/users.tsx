import { getLastMessageForUser } from '@/hooks/helpers';
import { API_URL } from '@/hooks/requests';
import { User, useUserStore } from '@/hooks/userStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function UsersScreen() {
  const {
    hydrated,
    friends,
    user,
    messages
  } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    
    if (!hydrated) return;

  }, [hydrated]);


    function handleSearch(friend: User) {
    return friend.username.toLowerCase().includes(searchQuery.toLowerCase().trim());}

  return (
    <View className=" m-2 flex-1 justify-center items-center ">
      <StatusBar/>
    <View className="w-full  max-w-md flex-row items-center justify-between p-4  min-h-32  ">
        <Text className="text-lg font-semibold">{user?.username}</Text>
        <Image
        source={user?.profilePicture ? { uri: user.profilePicture.replace("http://localhost:8000", API_URL) } : require('@/assets/images/adaptive-icon.png')}
          className="w-10 h-10 rounded-full bg-gray-600"
        />
      <PopUpModel/>

    </View>        
    <View className="w-full max-w-md relative m-2">
          <MaterialIcons
            className="absolute left-3 top-2 w-4 h-4"
            name="search"
            size={24}
            color="black"
          />
          <TextInput
            className="w-full p-2 pl-10 bg-gray-200 rounded-full"
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View className="flex-1 w-full max-w-md ">
          <FlatList 
  className='p-2'
  data={friends.filter((friend) => friend._id !== user?._id && handleSearch(friend))}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => {
    
    const lastMessage = getLastMessageForUser(item._id, messages, user?._id);

    const unreadMessages = messages.filter( (msg) => msg.senderId === item._id && !msg.seen).length;

    return (
      <SimpleUserElement
        selectedUser={item}
        message={lastMessage}
        unreadMessages={unreadMessages}
      />
    );
  }}
  showsVerticalScrollIndicator={false}
  showsHorizontalScrollIndicator={false}
/>

          {friends.length === 0 && (
            <Text className="text-center text-gray-500 mt-4">No users found</Text>
          )}
        </View>
    </View>
  );
}

export function SimpleUserElement({
  selectedUser,
  message,
  unreadMessages,
}: {
  selectedUser: User;
  message?: string;
  unreadMessages: number;
}) {
  const router = useRouter();
  const { setCurrentReceiver, socket } = useUserStore();
 
  
  const handlePress = () => {

    setCurrentReceiver(selectedUser);
    socket?.emit("readMessage", { receiverId: selectedUser._id });
    router.replace(`/chat/${selectedUser._id}`);

  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center justify-between p-4 mt-2 bg-white rounded-lg shadow-md"
      onPress={handlePress}
    >
      <View className="flex-row items-center w-full">
        <Image
          source={selectedUser.profilePicture ? { uri: selectedUser.profilePicture.replace("http://localhost:8000", API_URL) } : require('@/assets/images/adaptive-icon.png')}
          className="w-10 h-10 rounded-full bg-gray-600"
        />
        <View className="ml-4 flex-row items-center justify-between align-middle w-5/6">
          <View className="flex-1">  
          <Text className="text-lg font-semibold">{selectedUser.username}</Text>
          <Text className="text-sm text-gray-600">
            {message ? message.length > 30 ? `${message.slice(0, 30)}...` : message : 'No messages yet'}
          </Text>
          </View>
          { unreadMessages >0 && (
            <View className="w-6 h-6 rounded-full border-blue-800 bg-blue-500 border-2 items-center justify-center">
              <Text className="text-xs text-white font-medium">{unreadMessages}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}


export function PopUpModel() {
  const [modalVisible, setModalVisible] = useState(false);
  const { clearUser } = useUserStore();
  const router = useRouter();
  function handleLogout() {
    try {
    clearUser();
    router.replace('/');
    setModalVisible(false);
      
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out. Please try again later.');
      return;
      
    }
 
  }
 
  return (
 <View >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View className='flex-1 justify-center items-center bg-blue-300 bg-opacity-50'>
            <View className=' max-w-md bg-blue-100 rounded-lg p-3 shadow-lg'>
              <Text className=' font-bold text-center'>Are you sure you want to logout ? !</Text>
    <View className='flex-row justify-around mt-4'>  

              <Pressable
                className=' p-3 rounded-lg'
                onPress={() => setModalVisible(!modalVisible)}>
                  <MaterialIcons name='cancel' size={24} color='blue' />              
              </Pressable>
              <Pressable
                className='p-3 rounded-lg'
                onPress={() => setModalVisible(!modalVisible)}>
                  <MaterialIcons name='logout' size={24} color='red' />              
              </Pressable>
    </View>

            </View>
          </View>
        </Modal>
        <Pressable
          className='rounded-lg'
          onPress={() => handleLogout()}>
          {/* <Text className='text-white font-bold text-center'>Show Modal</Text> */}
          <MaterialIcons className='text-red-200 ' name='logout' size={24} color='red' />
        </Pressable>
      </View>
  );
}

