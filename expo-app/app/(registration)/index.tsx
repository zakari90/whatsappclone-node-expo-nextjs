import { login } from "@/hooks/requests";
import { useUserStore } from "@/hooks/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { token, setToken, setUser } = useUserStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) {
      router.replace("/(chat)/(tabs)/users");
    }
  }, [token]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      if (response.error) {
        Alert.alert("Error", response.error);
        return;
      }
      setUser(response.user);
      setToken(response.accessToken);
      router.replace("/(chat)/(tabs)/users");
    } catch (error) {
      console.log("Error during login:", error);
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
        <View className="flex-1 px-8 justify-center">
          <View className="items-center mb-10">
            <View className="w-24 h-24 bg-blue-500 rounded-3xl items-center justify-center shadow-lg transform rotate-12 mb-6">
              <Ionicons name="chatbubble-ellipses" size={50} color="white" />
            </View>
            <Text className="text-3xl font-black text-gray-900">
              Welcome Back
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Login to continue your conversations
            </Text>
          </View>

          <View className="space-y-4">
            <View>
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
                      placeholder="Enter your email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
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
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
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
              <Text className="text-white text-lg font-bold">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-10">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(registration)/register")}
            >
              <Text className="text-blue-500 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
