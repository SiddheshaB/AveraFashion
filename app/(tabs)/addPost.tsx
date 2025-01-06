import { View, Text, StyleSheet, Button, Image } from "react-native";
import signOut from "../../utils/signOut";
import { useDispatch } from "react-redux";
import { pickImage } from "../../components/ImagePicker";
import { uploadToSupabase } from "../../components/SupabaseImageUpload";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
export default function AddPost() {
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(null);
  const [image, setImage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const handleLogout = () => {
    signOut(dispatch);
  };
  const handleImageUpload = async () => {
    try {
      setIsLoading(true);
      console.log("Button pressed, Inside handle Image upload func");

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

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
      if (!imageUri) return;
      // Upload to Supabase
      const supabaseDownloadURL = await uploadToSupabase(imageUri);
      setSupabaseUrl(supabaseDownloadURL);
      console.log("supabase download img: ", supabaseUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout}></Button>
      <View style={styles.postBox}>
        <View style={styles.container}>
          <Button
            title="Pick an image from camera roll"
            onPress={handleImageUpload}
          />
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 100, height: 100 }}
            />
          )}
          {supabaseUrl && <Text>Supabase URL: {supabaseUrl}</Text>}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postBox: {
    borderRadius: 20,
    shadowColor: "grey",
    backgroundColor: "white",
    height: 500,
    width: 320,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
