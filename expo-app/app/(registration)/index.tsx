import { login } from '@/hooks/requests';
import { useUserStore } from '@/hooks/userStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Button, Image, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {

  const { token,setToken, setUser} = useUserStore()

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {    
    if (token) {
      router.replace('/(chat)/(tabs)/users')
    }
   ;}, [router, token]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await login(data);

      if (response.error) {
              Alert.alert('Error', response.error);
              return;
            }
      setUser(response.user);
      setToken(response.accessToken);
      Alert.alert('Success', `Welcome back, ${data.email}!`);
      router.replace('/(chat)/(tabs)/users');

    } catch (error) {

      console.log('Error during login:', error);
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
      behavior='padding'
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? 100 : 0
      }
    className="flex-1 justify-center items-center px-6">      
    <View className="w-full max-w-md">

    <View className="w-full max-w-md items-center">
        
<Image
      source={require('@/assets/images/login.png')}
      className='mb-4'
      style={{ width: 300, height: 300 , resizeMode: 'contain'}}
    /></View>
      <View className="w-full max-w-md "></View>
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
            />
          )}
        />
        {errors.password && <Text className="text-red-600 mb-4">{errors.password.message}</Text>}

        <View className="mb-4 ">
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <Button title="LogIn" onPress={handleSubmit(onSubmit)} disabled={isLoading} />
            )}
          </View>

        <Text
          className="text-center text-blue-600 underline"
          onPress={() => router.push('/(registration)/register')}
        >
          Don’t have an account? Register
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
