import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function FileUploadScreen() {
  const [file, setFile] = useState<any>(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Accept any file type
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        setFile(result);
      } else {
        Alert.alert('No file selected');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to pick a file');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ marginTop: 40, padding: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <MaterialCommunityIcons name="file-upload" size={40} color="#4F46E5" />
        <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center' }}>PNG, JPG or PDF, smaller than 15MB</Text>
      </View>

      <View style={{ padding: 20, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#1F2937', fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 10 }}>
          Drag and Drop your file here or
        </Text>

        <TouchableOpacity onPress={pickFile} style={{ backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>Choose File</Text>
        </TouchableOpacity>

        {file && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: '#1F2937', fontSize: 14, fontWeight: '500', textAlign: 'center' }}>
              Selected File:
            </Text>
            <Text style={{ color: '#4F46E5', fontSize: 12, textAlign: 'center' }}>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
