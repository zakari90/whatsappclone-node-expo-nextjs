import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";

export default function NotFoundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation for the icon
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"],
  });

  const handleGoHome = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={["#6366f1", "#8b5cf6", "#a855f7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <StatusBar barStyle="light-content" />

        <View className="flex-1 items-center justify-center px-8">
          {/* Animated Icon */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }, { rotate }],
            }}
            className="mb-8"
          >
            <View className="w-32 h-32 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="alert-circle-outline" size={80} color="white" />
            </View>
          </Animated.View>

          {/* 404 Text */}
          <Text className="text-white text-8xl font-black mb-4">404</Text>

          {/* Title */}
          <Text className="text-white text-3xl font-bold text-center mb-4">
            Page Not Found
          </Text>

          {/* Description */}
          <Text className="text-white/80 text-center text-lg mb-12 leading-7">
            Oops! The page you're looking for doesn't exist.{"\n"}
            It might have been moved or deleted.
          </Text>

          {/* Action Buttons */}
          <View className="w-full space-y-4">
            <TouchableOpacity
              onPress={handleGoHome}
              className="bg-white rounded-2xl py-4 px-8 items-center shadow-lg"
            >
              <View className="flex-row items-center">
                <Ionicons name="home" size={24} color="#6366f1" />
                <Text className="text-indigo-600 text-lg font-bold ml-3">
                  Go Back Home
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/(chat)/(tabs)/users")}
              className="bg-white/20 border-2 border-white rounded-2xl py-4 px-8 items-center"
            >
              <View className="flex-row items-center">
                <Ionicons name="chatbubbles" size={24} color="white" />
                <Text className="text-white text-lg font-bold ml-3">
                  View Chats
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Decorative Elements */}
          <View className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full" />
          <View className="absolute bottom-40 right-10 w-32 h-32 bg-white/10 rounded-full" />
          <View className="absolute top-1/3 right-5 w-16 h-16 bg-white/10 rounded-full" />
        </View>
      </LinearGradient>
    </>
  );
}
