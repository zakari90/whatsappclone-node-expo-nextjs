
import { API_URL, mobileUploadImage, updateProfile, webUploadImage } from '@/hooks/requests';
import { useUserStore } from '@/hooks/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import { z } from 'zod';

const updateFormSchema = z.object({
  username: z.string().optional(),
  status: z.string().optional(),
  profilePicture: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateFormSchema>;

export default function ProfileScreen() {
  const { user, token } = useUserStore();
  const [image, setImage] = useState<any | null>(null);
  const [webImage, setWebImage] = useState<any | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      username: user?.username || '',
      status: user?.status || '',
    },
  });

  const handleProfilePictureChange = async (onChange: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photos to upload a profile picture.',
        [{ text: 'OK' }]
      );
      return;
    }

    const file = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      quality: 1,
    });

    if (!file.canceled && file.assets.length > 0) {
      const uri = file.assets[0].uri;
      onChange(uri);
      setImage(file.assets[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("file", file);
      
      setImage(URL.createObjectURL(file));
      setWebImage(file);
    }
  };

  const onSubmit = async (data: UpdateFormData) => {
    if (!data.username && !data.status && !image) {
      Alert.alert('No changes', 'Please update at least one field.');
      return;
    }

    try {
      if (image) 

      switch (Platform.OS) {
        case "web":
          await webUploadImage(token, webImage);
          break;
        default:
          await mobileUploadImage(token, image?.uri || '');
          break;
      }
      await updateProfile({
        username: data.username,
        status: data.status,
        token,
      });

      Alert.alert('Success', `Profile updated for ${data.username ?? 'user'}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };
const[viewModal, setViewModal] = useState(false);
  return (
    <View className="flex-1 ">
      <Modal visible={viewModal} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        className="flex-1 items-center px-6"
      >
        <View className="w-full max-w-md">
          <Text className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Profile</Text>

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Username"
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-3 bg-white mb-2 text-base"
              />
            )}
          />
          {errors.username && (
            <Text className="text-red-500 mb-2">{errors.username.message}</Text>
          )}

          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Status"
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-3 bg-white mb-2 text-base"
              />
            )}
          />
          {errors.status && (
            <Text className="text-red-500 mb-4">{errors.status.message}</Text>
          )}
          <View className='flex-row justify-between items-center mb-4'>
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          <Button
            title='cancel'
            onPress={() => setViewModal(false)}
            color={'yellow'}
            />
          </View>

  

        </View>
      </KeyboardAvoidingView>
 
      </Modal>
      <View className="items-center p-4 relative">
        <Controller
          control={control}
          name="profilePicture"
          render={({ field: { onChange, value } }) => (
            <View className="items-center">
              <Image
               source={user?.profilePicture ? { uri: user.profilePicture.replace("http://localhost:8000", API_URL) } : require('@/assets/images/adaptive-icon.png')}
                style={{ width: 128, height: 128, borderRadius: 64 }}
                className='border-4 border-blue-500'
              />
              <View className="absolute w-6 h-6 bottom-2 right-2 hover:cursor-pointer  bg-blue-500 rounded-full  shadow">
                {Platform.OS === 'web' ? (
                  <input
                    size={20}
                    className="hover:cursor-pointer w-full h-full opacity-0"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                ) : (
                  <Pressable
                    className="hover:cursor-pointer w-full h-full opacity-0"
                  onPress={() => handleProfilePictureChange(onChange)}/>
                )}
              </View>
            </View>
          )}
        />
      </View>
        <View className=" flex-1 justify-center items-center ">

          <Text className=" mb-2 font-bold">Username: {user?.username}</Text>
          <Text className=" mb-2 font-">Status: {user?.status}</Text>
          <Pressable
            onPress={() => setViewModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <Text className="text-white">Edit Profile</Text>
          </Pressable>
        </View>

    </View>
  );
}
