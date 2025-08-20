import { register } from '@/hooks/requests';
import { useUserStore } from '@/hooks/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';
const registerFormSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password must be at least 1 characters long' }),
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const {setToken, setUser} = useUserStore()
  const [isLoading, setIsLoading] = useState(false);


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await register(data);
      console.log('Registration response:', response);

      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }
      console.log('Registration successful:', response);
      setUser(response.user);
      setToken(response.accessToken);
      Alert.alert('Success', `Welcome, ${data.username}`);
      router.replace('/(chat)/(tabs)/users');
    } catch (error) {
      console.log('Error during registration:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      className="flex-1 justify-center items-center px-6"
    >
    <View className="w-full max-w-md items-center">
        
<Image
      source={require('@/assets/images/register.png')}
      className='mb-4'
      style={{ width: 300, height: 300 , resizeMode: 'contain'}}
    /></View>
      <View className="w-full max-w-md ">
        
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-white mb-2 text-base"
              placeholder="User Name"
              autoCapitalize="none"
              keyboardType="default"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
            />
          )}
        />
        {errors.username && <Text className="text-red-600 mb-2">{errors.username.message}</Text>}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-white mb-2 text-base"
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
            />
          )}
        />
        {errors.email && <Text className="text-red-600 mb-2">{errors.email.message}</Text>}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-white mb-2 text-base"
              placeholder="Password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
            />
          )}
        />
        {errors.password && <Text className="text-red-600 mb-2">{errors.password.message}</Text>}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-white mb-2 text-base"
              placeholder="Confirm Password"
              secureTextEntry
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={!isLoading}
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-red-600 mb-2">{errors.confirmPassword.message}</Text>
        )}

        <View className="mb-4">
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Register" onPress={handleSubmit(onSubmit)} disabled={isLoading} />
          )}
        </View>

        <Text
          className="text-center text-blue-600 underline"
          onPress={() => !isLoading && router.push('/')}
        >
          Already have an account? Login
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
