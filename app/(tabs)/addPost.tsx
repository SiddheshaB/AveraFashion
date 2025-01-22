import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import signOut from "../../utils/signOut";
import { useDispatch } from "react-redux";
import { uploadToSupabase } from "../../components/SupabaseImageUpload";
import React, { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { postDataUpload } from "../../components/PostDataUpload";
//import { TextInput } from "react-native-gesture-handler";
export default function AddPost() {
  const [imageUri, setImageUri] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const dispatch = useDispatch();

  /*   useEffect(() => {
    if (!imageUri) return;
  }); */

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
        const postImages = result.assets.map((asset) => asset.uri);
        //console.log("Multiple image uri:", postImages);
        setImageUri(postImages);
        //setImageUri(result.assets[0].uri);
        if (!imageUri) return;
        //setImageUri(newImages);
        console.log("Image uri array: ", imageUri);
      }
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const postData = async () => {
    // Upload to Supabase
    const supabaseDownloadURL = await uploadToSupabase(imageUri);
    console.log("supabase download img: ", supabaseDownloadURL);
    postDataUpload(title, content, supabaseDownloadURL);
    setTitle(null);
    setContent(null);
    setImageUri(null);
    //setSupabaseUrl(null);
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
          placeholder="Enter summary here...... max 250"
          style={styles.postSummary}
          onChangeText={(text) => setTitle(text)}
          value={title}
        ></TextInput>
        <Button title="Upload" onPress={handleImageUpload} />
        <FlatList
          data={imageUri}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
          )}
          numColumns={2}
        />
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
