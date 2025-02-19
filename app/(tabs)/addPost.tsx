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
import GradientButton from "../../components/GradientButton";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';

const MAX_IMAGES = 3;

const pickImage = async (setImageUri:any, imageUri:any) => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert("Permission to access media library is required!");
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    allowsMultipleSelection: true,
    base64: true,
  });

  if (!result.canceled) {
    if (imageUri.length + result.assets.length > MAX_IMAGES) {
      alert(`You can select up to ${MAX_IMAGES} images.`);
      return;
    }

    const postImages = result.assets.map((asset) => asset.uri);
    setImageUri([...imageUri, ...postImages]);
  }
};

export default function AddPost() {
  const [imageUri, setImageUri] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isSubmitEnabled = title.trim() !== "" && imageUri.length > 0;

  const handleImageUpload = async () => {
    try {
      setIsLoading(true);
      await pickImage(setImageUri, imageUri);
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Error selecting images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const postData = async () => {
    // Upload to Supabase
    const supabaseDownloadURL = await uploadToSupabase(imageUri);
    console.log("supabase download img: ", supabaseDownloadURL);
    postDataUpload(title, content, supabaseDownloadURL);
    setTitle('');
    setContent('');
    setImageUri('');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>What's on your mind?</Text>
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
        <GradientButton onPress={handleImageUpload} title="Choose"></GradientButton>
        <Text style={styles.imageText}>(Select upto 3 images)</Text>
        <View style={styles.imageContainer}>
          {imageUri.length > 0 && (
            <TouchableOpacity
            style={styles.clearButton}
              onPress={() => setImageUri([])}
            >
            <MaterialIcons name="clear" size={20} color="black" />            
            </TouchableOpacity>
          )}
              <View style={styles.imageContainer}>
              {imageUri.length > 0 && (
                <Swiper
                  style={styles.swiper}
                  dotStyle={styles.dotStyle}
                  activeDotStyle={styles.activeDotStyle}
                  paginationStyle={styles.pagination}
                  showsButtons={false}
                  loop={false}
                >
                  {imageUri.map((uri:any, index:any) => (
                    <View key={index} style={styles.slide}>
                      <Image source={{ uri }} style={styles.swiperImage} />
                    </View>
                  ))}
                </Swiper>
              )}
              </View>  
        </View>
        <TextInput
          editable
          multiline
          numberOfLines={10}
          maxLength={200}
          placeholder="Enter body here...max 250 characters"
          style={styles.postContent}
          onChangeText={(text) => setContent(text)}
          value={content}
        ></TextInput>
        <GradientButton 
          onPress={postData} 
          title="Submit" 
          disabled={!isSubmitEnabled}
        ></GradientButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 90,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontStyle: "italic",
    color:"#e8e8e8"
  },
  postBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
  },
  postSummary: {
    width: "100%",
    height: 100,
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginTop: 20,
    borderColor:"#f0f0f0"
  },
  postContent: {
    width: "100%",
    height: 150,
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 20,
    textAlignVertical: "top",
    marginTop: 10,
    borderColor:"#f0f0f0"
  },
  imageContainer: {
    width: "100%",
    //marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    padding: 8,
    marginBottom: 10,
    alignSelf: "flex-end",
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
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  image: {
    width: 300,
    height: 300,
  },
  swiper: {
    height: 250,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperImage: {
    width: 250,
    height: 250,
    //resizeMode: 'cover',
    borderRadius: 10,
  },
  dotStyle: {
    backgroundColor: '#D9D9D9',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDotStyle: {
    backgroundColor: '#333',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  pagination: {
    bottom: -15,
  },
  imageText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    alignSelf: "flex-start",
  },
});
