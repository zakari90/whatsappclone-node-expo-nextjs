import {
  API_URL,
  mobileUploadImage,
  updateProfile,
  webUploadImage,
} from "@/hooks/requests";
import { resolveProfilePicture } from "@/hooks/utils";
import { useUserStore } from "@/hooks/userStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const updateFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  status: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateFormSchema>;

export default function ProfileScreen() {
  const { user, token, setUser, clearUser } = useUserStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const fileInputRef = useRef<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      username: user?.username || "",
      status: user?.status || "",
    },
  });

  // Keep form in sync with user changes (e.g. from socket)
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        status: user.status,
      });
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      "Logout & Clear Data",
      "Are you sure you want to logout?\n\nThis will clear all app data including:\n• Messages\n• User information\n• Cached data\n• Login session",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            clearUser();
            router.replace("/");
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "⚠️ Clear All Data & Start Over",
      "WARNING: This action cannot be undone!\n\nThis will permanently delete:\n• All your messages\n• Your profile information\n• All cached data\n• Your login session\n\nYou will need to register again.\n\nAre you absolutely sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear Everything",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "This is your last chance to cancel.\n\nDelete all data and start fresh?",
              [
                {
                  text: "No, Keep My Data",
                  style: "cancel",
                },
                {
                  text: "Yes, Delete Everything",
                  style: "destructive",
                  onPress: async () => {
                    await clearUser();
                    router.replace("/");
                    setTimeout(() => {
                      Alert.alert(
                        "Success",
                        "All data has been cleared. You can now start fresh!",
                      );
                    }, 500);
                  },
                },
              ],
            );
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleProfilePicturePick = async () => {
    if (Platform.OS === "web") {
      fileInputRef.current?.click();
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Access to photos is needed for profile pictures.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setLocalPreview(result.assets[0].uri);
      setSelectedImage(result.assets[0]);
    }
  };

  const handleWebFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalPreview(URL.createObjectURL(file));
      setSelectedImage(file);
    }
  };

  const onSubmit = async (data: UpdateFormData) => {
    setIsSubmitting(true);
    try {
      let updatedUser = user;

      // 1. Handle Image Upload if changed
      if (selectedImage) {
        let uploadRes;
        if (Platform.OS === "web") {
          uploadRes = await webUploadImage(token, selectedImage);
        } else {
          uploadRes = await mobileUploadImage(token, selectedImage.uri);
        }

        if (uploadRes?.success && uploadRes?.updatedUser) {
          setUser(uploadRes.updatedUser);
        }
      }

      // 2. Update Text Fields
      const profileRes = await updateProfile({
        username: data.username,
        status: data.status,
        token,
      });

      if (profileRes.success && profileRes.updatedUser) {
        setUser(profileRes.updatedUser);
        Alert.alert("Success", "Profile updated successfully!");
        setViewModal(false);
        setSelectedImage(null);
        setLocalPreview(null);
      } else {
        throw new Error(
          profileRes.error || profileRes.message || "Failed to update profile",
        );
      }
    } catch (error: any) {
      console.error("Update error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImageUri =
    localPreview ||
    (user?.profilePicture ? resolveProfilePicture(user.profilePicture) : null);

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <View className="p-6">
        {/* Header Section */}
        <View className="items-center mt-4 mb-8">
          <Pressable
            onPress={handleProfilePicturePick}
            className="relative active:opacity-80"
          >
            <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
              {currentImageUri ? (
                <Image
                  source={{ uri: currentImageUri }}
                  className="w-full h-full"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Ionicons name="person" size={60} color="#9ca3af" />
                </View>
              )}
            </View>

            <View className="absolute bottom-0 right-0 bg-blue-500 w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-sm">
              <Ionicons name="camera" size={20} color="white" />
            </View>

            {Platform.OS === "web" && (
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleWebFileChange}
                style={{ display: "none" }}
              />
            )}
          </Pressable>

          <Text className="text-2xl font-bold mt-4 text-gray-900">
            {user?.username}
          </Text>
          <Text className="text-gray-500 mt-1">{user?.email}</Text>
        </View>

        {/* Info Cards */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-gray-100">
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 p-2 rounded-lg mr-3">
              <Ionicons name="information-circle" size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-400 uppercase font-bold">
                About
              </Text>
              <Text className="text-gray-800 text-base">
                {user?.status || "No status set"}
              </Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-100 mb-4 ml-10" />

          <View className="flex-row items-center">
            <View className="bg-green-100 p-2 rounded-lg mr-3">
              <Ionicons name="mail" size={20} color="#22c55e" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-400 uppercase font-bold">
                Email
              </Text>
              <Text className="text-gray-800 text-base">{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          <Pressable
            onPress={() => setViewModal(true)}
            className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-center shadow-md active:bg-blue-600"
          >
            <Ionicons name="create" size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold text-lg">Edit Profile</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            className="bg-red-50 border border-red-100 rounded-xl p-4 flex-row items-center justify-center active:bg-red-100"
          >
            <Ionicons
              name="log-out"
              size={20}
              color="#ef4444"
              className="mr-2"
            />
            <Text className="text-red-500 font-bold text-lg">
              Logout & Clear Data
            </Text>
          </Pressable>

          <Pressable
            onPress={handleClearAll}
            className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center shadow-md active:bg-red-600"
          >
            <Ionicons name="trash" size={20} color="white" className="mr-2" />
            <Text className="text-white font-bold text-lg">
              Clear All & Start Over
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={viewModal} animationType="fade" transparent={true}>
        <View className="flex-1 justify-center bg-black/50 px-6">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="bg-white rounded-3xl p-6 shadow-xl"
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Edit Profile
              </Text>
              <Pressable
                onPress={() => {
                  setViewModal(false);
                  setLocalPreview(null);
                  setSelectedImage(null);
                }}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
                Username
              </Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Enter username"
                    value={value}
                    onChangeText={onChange}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 focus:border-blue-500"
                  />
                )}
              />
              {errors.username && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  {errors.username.message}
                </Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
                Status
              </Text>
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="How are you feeling?"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={3}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 h-24 text-align-top focus:border-blue-500"
                  />
                )}
              />
            </View>

            {isSubmitting ? (
              <ActivityIndicator size="large" color="#3b82f6" />
            ) : (
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => {
                    setViewModal(false);
                    setLocalPreview(null);
                    setSelectedImage(null);
                  }}
                  className="flex-1 bg-gray-100 rounded-xl p-4 items-center"
                >
                  <Text className="text-gray-700 font-bold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  className="flex-1 bg-blue-500 rounded-xl p-4 items-center shadow-sm"
                >
                  <Text className="text-white font-bold">Save Changes</Text>
                </Pressable>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}
