import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default async function pickImage(setImageUri: any, imageUri: string[]) {
  let permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Permission to access media library is required!");
    return;
  }

  if (imageUri.length >= 3) {
    alert("You can only select up to 3 images");
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
    base64: true,
  });

  if (!result.canceled) {
    const newImages = result.assets.map((asset) => asset.uri);
    const totalImages = [...imageUri, ...newImages];
    
    if (totalImages.length > 3) {
      alert("You can only select up to 3 images in total");
      return;
    }
    
    setImageUri(totalImages);
  }
}
