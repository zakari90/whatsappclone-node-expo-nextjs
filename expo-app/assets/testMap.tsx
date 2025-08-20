import markers from "@/assets/markers";
import { MapView, Marker } from "@/components/ui/mymap";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  View
} from "react-native";


const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [selectedCard, setSelectedCard] = useState("");
  if (Platform.OS==="web") {
    return<Text>switch to mobile</Text>
  }
  return (
    <View className="flex-1 bg-gray-100">
      <MapView
       className="flex-1"
        ref={mapRef}
        initialRegion={markers[0].coordinates}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            title={marker.name}
            coordinate={marker.coordinates}
          />
        ))}
      </MapView>
      <View className="absolute bottom-5 
      left-0 right-0 px-3">
        <FlatList
          horizontal
          data={markers}
          keyExtractor={(item) => item.name}
          renderItem={({ item: marker }) => (
            <Pressable
              onPress={() => {
                setSelectedCard(marker.name);
                mapRef.current?.animateToRegion(marker.coordinates, 1000);
              }}
              className={`flex-row items-center px-4 py-3 mx-1 rounded-lg shadow-md w-[250px] ${
                marker.name === selectedCard ? "bg-yellow-200" : "bg-white"
              }`}
            >
              <Image
                source={{ uri: marker.image }}
                className="w-14 h-14 rounded-lg mr-3"
              />
                  <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {marker.name}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {marker.description}
                </Text>
              </View>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};


export default MapScreen;