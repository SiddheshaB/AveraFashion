import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { uploadToSupabase } from "../../components/SupabaseImageUpload";
import React, { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { postDataUpload } from "../../components/PostDataUpload";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../components/GradientButton";

export default function AddPost() {
  const [imageUri, setImageUri] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  const handleImageUpload = async () => {
    try {
      setIsLoading(true);
      // Permissions request is necessary for launching the image library
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
      //console.log(JSON.stringify(result.assets[0].uri));
      if (!permissionResult.granted) {
        alert("Permission to access media library is required!");
        return;
      }

      if (!result.canceled) {
        const postImages = result.assets.map((asset) => asset.uri);
        setImageUri(postImages);
        if (!imageUri) return;
        console.log("Image uri array: ", imageUri);
      }
    } catch (error) {
      //console.error("Error uploading:", error);
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
  };

  return (
     
     <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.postBox}>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            maxLength={40}
            placeholder="Enter title here..."
            style={styles.postSummary}
            onChangeText={(text) => setTitle(text)}
            value={title}
          ></TextInput>
          <GradientButton onPress={handleImageUpload} title="Upload"></GradientButton>
          {/* <TouchableOpacity
            
            onPress={handleImageUpload}
          >
            <LinearGradient colors={['#f6d5f7', '#fbe9d7']} style={styles.button}>
            <Text style={styles.buttonText}>Upload</Text></LinearGradient>
          </TouchableOpacity> */}
          <FlatList
            data={imageUri}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
            )}
            numColumns={3}
            scrollEnabled={false}
          />
          <TextInput
            editable
            multiline
            numberOfLines={10}
            maxLength={200}
            placeholder="Enter body here..."
            style={styles.postContent}
            onChangeText={(text) => setContent(text)}
            value={content}
          ></TextInput>
          <GradientButton onPress={postData} title="Submit"></GradientButton>
        </View>
     </ScrollView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 90,
  },
  postBox: {
    borderRadius: 20,
    shadowColor: "grey",
    backgroundColor: "white",
    width: '100%',
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    gap: 15,
    height: '100%',
    flex:1,
  },
  postSummary: {
    width: "100%",
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginTop: 100,
  },
  postContent: {
    width: "100%",
    minHeight: 150,
    borderWidth: 0.5,
    //borderColor: "#AA74AC",
    borderRadius: 8,
    padding: 20,
    textAlignVertical: "top",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#e8e8e8",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});
