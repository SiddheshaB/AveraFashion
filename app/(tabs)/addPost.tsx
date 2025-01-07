import { View, Text, StyleSheet, Button, Image, TextInput } from "react-native";
import signOut from "../../utils/signOut";
import { useDispatch } from "react-redux";
import { uploadToSupabase } from "../../components/SupabaseImageUpload";
import React, { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { postDataUpload } from "../../components/PostDataUpload";
//import { TextInput } from "react-native-gesture-handler";
export default function AddPost() {
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    signOut(dispatch);
  };
  const handleImageUpload = async () => {
    try {
      setIsLoading(true);
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
      console.log(JSON.stringify(result.assets[0].uri));
      if (!permissionResult.granted) {
        alert("Permission to access media library is required!");
        return;
      }

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        console.log("Image uri: ", imageUri);
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
  const postData = async () => {
    postDataUpload(title, content, supabaseUrl);
    setTitle(null);
    setContent(null);
    setImageUri(null);
  };
  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout}></Button>
      <View style={styles.postBox}>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          placeholder="Enter summary here..."
          style={styles.postSummary}
          onChangeText={(text) => setTitle(text)}
          value={title}
        ></TextInput>
        <Button title="Upload" onPress={handleImageUpload} />
        <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />
        <TextInput
          editable
          multiline
          numberOfLines={10}
          maxLength={200}
          placeholder="Enter body here..."
          style={styles.postSummary}
          onChangeText={(text) => setContent(text)}
          value={content}
        ></TextInput>
        <Button title="Submit" onPress={postData} />
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
  postSummary: {
    height: 80,
  },
});
