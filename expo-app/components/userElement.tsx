import { View, Text, TouchableOpacity, Image } from 'react-native';

type Props = {
  selectedUser: string;
  message?: string;
  unreadMessages?: number;
};

export function UserElement({ selectedUser, message, unreadMessages }: Props) {
  return (
    <TouchableOpacity className="w-10 h-10 flex-row items-center p-4 border-b border-gray-700 bg-gray-800 active:bg-gray-700">
      <Image
        source={require('@/assets/images/adaptive-icon.png')}
        //  className="w-12 h-12 rounded-full bg-gray-600"
      />

      <View className="ml-4 flex-1">
        <Text className="text-white font-medium text-base">{selectedUser}</Text>
        {message && <Text className="text-gray-400 text-sm">{message}</Text>}
      </View>

      {unreadMessages ? (
        <View className="ml-auto px-2 py-1 rounded-2xl bg-gray-600">
          <Text className="text-xs text-gray-400">{unreadMessages}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
