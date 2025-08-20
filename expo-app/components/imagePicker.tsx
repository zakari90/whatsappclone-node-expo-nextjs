import * as ImagePicker from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  Button,
  Image,
  View,
  Text,
  Alert,
  Pressable,
  TextInput,
} from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  profilePicture: z.string().optional(), // URI as string
});

type FormData = z.infer<typeof schema>;

export default function ProfileForm() {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    Alert.alert('Success', 'Profile submitted!');
  };

  return (
    <View className="p-4 space-y-4">
      {/* Username input (just to show it's part of the form) */}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Text>Username</Text>
            <TextInput
              className="border p-2 rounded-md bg-white"
              placeholder="Enter username"
              value={value}
              onChangeText={onChange}
            />
            {error && <Text className="text-red-500">{error.message}</Text>}
          </>
        )}
      />

      {/* Image Picker Controller */}
      <Controller
        control={control}
        name="profilePicture"
        render={({ field: { onChange, value } }) => (
          <View className="items-center">
            {value ? (
              <Image
                source={{ uri: value }}
                className="w-32 h-32 rounded-full mb-2"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-gray-300 mb-2" />
            )}

            <Pressable
              onPress={async () => {
                const { status } =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert('Permission required', 'Allow media access to pick image.');
                  return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 1,
                  allowsEditing: true,
                });

                if (!result.canceled) {
                  onChange(result.assets[0].uri); // update form field
                }
              }}
              className="bg-blue-500 px-4 py-2 rounded-md"
            >
              <Text className="text-white">Choose Profile Picture</Text>
            </Pressable>
          </View>
        )}
      />

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
