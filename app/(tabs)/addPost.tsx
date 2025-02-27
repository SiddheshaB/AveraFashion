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
      <Text style={styles.title}>Free AI Review</Text>
      <Text style={styles.subtitle}>Get personalized style feedback from our AI stylist</Text>
      <View style={styles.postBox}>
        <Text style={styles.sectionTitle}>Select Occasion</Text>
        <TouchableOpacity style={styles.occasionSelector}>
          <Text style={styles.occasionText}>Choose an occasion</Text>
          <Entypo name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Upload Photo</Text>
        {imageUri.length === 0 ? (
          <TouchableOpacity 
            style={styles.uploadContainer} 
            onPress={handleImageUpload}
          >
            <View style={styles.uploadIconContainer}>
              <Entypo name="camera" size={32} color="#666" />
            </View>
            <Text style={styles.uploadText}>Click to upload your outfit photo</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setImageUri([])}
            >
              <MaterialIcons name="clear" size={20} color="black" />            
            </TouchableOpacity>
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
          </View>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          placeholder="Tell us about your outfit and get personalized feedback..."
          style={styles.postContent}
          onChangeText={(text) => setContent(text)}
          value={content}
        />
        <GradientButton 
          onPress={postData} 
          title="Post for Review" 
          disabled={!isSubmitEnabled}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf8ff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6941C6",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  postBox: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 24,
  },
  occasionSelector: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 8,
    backgroundColor: "white",
  },
  occasionText: {
    fontSize: 16,
    color: "#666",
  },
  uploadContainer: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderColor: "#E4E4E7",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    color: "#666",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  postContent: {
    width: "100%",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "white",
  },
  swiper: {
    height: 200,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dotStyle: {
    backgroundColor: '#E4E4E7',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDotStyle: {
    backgroundColor: '#6941C6',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  pagination: {
    bottom: 10,
  },
});
