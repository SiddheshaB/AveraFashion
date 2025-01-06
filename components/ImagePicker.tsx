import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
  const [image, setImage] = useState<string | null>(null);
  // No permissions request is necessary for launching the image library
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
    base64: true,
  });
  if (!permissionResult.granted) {
    alert("Permission to access media library is required!");
    return;
  }
  console.log(result);

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
  return null;
};
