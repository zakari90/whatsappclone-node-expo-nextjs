import { register } from "@/hooks/requests";
import { useUserStore } from "@/hooks/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const registerFormSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setToken, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await register(data);
      if (response.error) {
        Alert.alert("Error", response.error);
        return;
      }
      setUser(response.user);
      setToken(response.accessToken);
      router.replace("/(chat)/(tabs)/users");
    } catch (error) {
      console.log("Error during registration:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-8"
        >
          <View className="items-center mb-8 mt-10">
            <View className="w-20 h-20 bg-blue-500 rounded-3xl items-center justify-center shadow-lg -rotate-12 mb-6">
              <Ionicons name="chatbubbles" size={40} color="white" />
            </View>
            <Text className="text-3xl font-black text-gray-900">
              Create Account
            </Text>
            <Text className="text-gray-500 mt-2 text-center text-base">
              Join the conversation today
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">
                Username
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <Ionicons name="person-outline" size={20} color="#9ca3af" />
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 py-3 text-base text-gray-900"
                      placeholder="Pick a username"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              {errors.username && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.username.message}
                </Text>
              )}
            </View>

            <View className="mt-4">
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">
                Email
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 py-3 text-base text-gray-900"
                      placeholder="Your email address"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View className="mt-4">
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">
                Password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9ca3af"
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 py-3 text-base text-gray-900"
                      placeholder="Create a password"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            <View className="mt-4">
              <Text className="text-sm font-bold text-gray-700 mb-2 ml-1">
                Confirm Password
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#9ca3af"
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 py-3 text-base text-gray-900"
                      placeholder="Repeat your password"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                      placeholderTextColor="#9ca3af"
                    />
                  )}
                />
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`mt-10 h-16 rounded-2xl items-center justify-center shadow-lg ${
              isLoading ? "bg-blue-300" : "bg-blue-500"
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-10 mb-10">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => !isLoading && router.replace("/")}>
              <Text className="text-blue-500 font-bold">Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
