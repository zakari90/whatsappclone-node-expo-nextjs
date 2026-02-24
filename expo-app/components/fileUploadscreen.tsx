import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

export default function FileUploadScreen() {
  const [file, setFile] = useState<any>(null);
  const [isPicking, setIsPicking] = useState(false);
  const insets = useSafeAreaInsets();

  const pickFile = async () => {
    setIsPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Accept any file type
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick a file");
    } finally {
      setIsPicking(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-4">
            <MaterialCommunityIcons
              name="file-upload-outline"
              size={40}
              color="#4f46e5"
            />
          </View>
          <Text className="text-2xl font-black text-gray-900">Upload File</Text>
          <Text className="text-gray-500 mt-2 text-center">
            Select a document or image to share
          </Text>
        </View>

        {!file ? (
          <TouchableOpacity
            onPress={pickFile}
            activeOpacity={0.7}
            className="border-2 border-dashed border-indigo-200 rounded-3xl p-10 items-center justify-center bg-indigo-50/10"
          >
            <View className="bg-indigo-50 w-16 h-16 rounded-full items-center justify-center mb-4">
              <Ionicons name="add" size={32} color="#4f46e5" />
            </View>
            <Text className="text-indigo-600 font-bold text-lg">
              Choose a file
            </Text>
            <Text className="text-gray-400 mt-2 text-sm">
              PDF, PNG, JPG up to 15MB
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="bg-gray-50 border border-gray-100 rounded-3xl p-6 flex-row items-center">
            <View className="bg-indigo-100 p-3 rounded-2xl">
              <MaterialCommunityIcons
                name="file-document-outline"
                size={24}
                color="#4f46e5"
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-gray-900 font-bold" numberOfLines={1}>
                {file.name}
              </Text>
              <Text className="text-gray-500 text-xs">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
            <TouchableOpacity onPress={removeFile} className="p-2">
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          disabled={!file || isPicking}
          className={`mt-10 h-16 rounded-2xl items-center justify-center shadow-lg ${
            !file || isPicking ? "bg-gray-200" : "bg-indigo-600"
          }`}
        >
          {isPicking ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Upload to Chat</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
