import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { uploadToSupabase } from "../../components/SupabaseImageUpload";
import React, { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { postDataUpload } from "../../components/PostDataUpload";
import GradientButton from "../../components/GradientButton";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { supabase } from "../../utils/supabase";

// Maximum number of images that can be uploaded
const MAX_IMAGES = 3;
const MAX_CHARS = 200;
// Handle image selection from device library
const pickImage = async (setImageUri:any, imageUri:any) => {
  // Request permission to access media library
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
    // Check if adding new images would exceed the maximum limit
    if (imageUri.length + result.assets.length > MAX_IMAGES) {
      alert(`You can select up to ${MAX_IMAGES} images.`);
      return;
    }

    const postImages = result.assets.map((asset) => asset.uri);
    setImageUri([...imageUri, ...postImages]);
  }
};

export default function AddPost() {
  // State management for images, loading state, and form inputs
  const [imageUri, setImageUri] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [occasions, setOccasions] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  /**
   * Measures the position and dimensions of the dropdown button in the window.
   * Uses the dropdownRef to access the button component and measureInWindow to get:
   * - x: distance from left edge of window
   * - y: distance from top edge of window
   * - width: total width of the button
   * - height: total height of the button
   * 
   * This information is used to position the dropdown menu exactly below the button
   * when it opens.
   */
  const measureDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x, y, width, height) => {
        setDropdownLayout({ x, y, width, height });
      });
    }
  };

  const dropdownRef = useRef(null);

  const handleDropdownPress = () => {
    measureDropdown();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Enable submit button only when required fields are filled
  const isSubmitEnabled = selectedOccasion !== null && imageUri.length > 0;

  // Fetch occasions from Supabase
  useEffect(() => {
    fetchOccasions();
  }, []);

  const fetchOccasions = async () => {
    try {
      const { data, error } = await supabase
        .from('occasion')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching occasions:', error);
        return;
      }

      if (data) {
        console.log('Occasions fetched successfully:', data);
        setOccasions(data);
      } else {
        console.log('No occasions data returned');
      }
    } catch (error) {
      console.error('Unexpected error while fetching occasions:', error);
    }
  };

  // Handle image upload process
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

  // Handle form submission and data upload
  const postData = async () => {
    if (!selectedOccasion) {
      // Handle error - occasion must be selected
      return;
    }
    
    // Upload images to Supabase storage
    const supabaseDownloadURL = await uploadToSupabase(imageUri);
    console.log("supabase download img: ", supabaseDownloadURL);
    
    // Upload post data to database
    postDataUpload(title, content, supabaseDownloadURL, selectedOccasion);
    
    // Reset form after successful upload
    setTitle('');
    setContent('');
    setImageUri('');
    setSelectedOccasion(null);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Free AI Review Header Section */}
        <View style={styles.reviewBox}>
          <View style={styles.iconBox}>
            <MaterialIcons name="celebration" size={24} color="#6941C6" />
          </View>
          <View style={styles.reviewTextContainer}>
            <Text style={styles.title}>Free AI Review</Text>
            <Text style={styles.subtitle}>Get personalized style feedback from our AI stylist</Text>
          </View>
        </View>

        <View style={styles.postBox}>
          {/* Occasion Selection */}
          <Text style={styles.sectionTitle}>Select Occasion</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              ref={dropdownRef}
              style={[
                styles.occasionSelector,
                isDropdownOpen && styles.occasionSelectorActive
              ]}
              onPress={handleDropdownPress}
            >
              <Text style={[
                styles.occasionText,
                selectedOccasion !== null ? { color: '#333' } : undefined
              ]}>
                {selectedOccasion !== null ? occasions.find((occasion) => occasion.id === selectedOccasion).name : "Choose an occasion"}
              </Text>
              <AntDesign 
                name={isDropdownOpen ? "caretup" : "caretdown"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>

            {/* Dropdown Menu for occasion */}
            <Modal
              visible={isDropdownOpen}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsDropdownOpen(false)}
            >
              <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                    <View 
                      style={[
                        styles.dropdownMenu,
                        {
                          position: 'absolute',
                          top: dropdownLayout.y + dropdownLayout.height + 4,
                          left: dropdownLayout.x,
                          width: dropdownLayout.width,
                        }
                      ]}
                    >
                      <FlatList
                        data={occasions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={[
                              styles.dropdownItem,
                              selectedOccasion === item.id && styles.selectedItem
                            ]}
                            onPress={() => {
                              setSelectedOccasion(item.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <Text style={[
                              styles.dropdownItemText,
                              selectedOccasion === item.id && styles.selectedItemText
                            ]}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                        style={styles.dropdownScroll}
                        showsVerticalScrollIndicator={true}
                        bounces={false}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>

          {/* Image Upload Section */}
          <Text style={styles.sectionTitle}>Upload Photo</Text>
          {imageUri.length === 0 ? (
            // Show upload button when no images are selected
            <TouchableOpacity 
              style={styles.uploadContainer} 
              onPress={handleImageUpload}
            >
              <View style={styles.uploadIconContainer}>
                <AntDesign name="camera" size={32} color="#666" />
              </View>
              <Text style={styles.uploadText}>Click to upload your outfit photo</Text>
            </TouchableOpacity>
          ) : (
            // Show image preview carousel when images are selected
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

          {/* Description Input */}
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.inputContainer}>
          <TextInput
            editable
            multiline
            //numberOfLines={4}
            maxLength={MAX_CHARS}
            placeholder="Tell us about your outfit and get personalized feedback..."
            style={styles.postContent}
            onChangeText={(text) => setContent(text)}
            value={content}
          />
          <Text style={styles.charCount}>
          {MAX_CHARS - content.length} characters remaining
          </Text>
          </View>
          {/* Submit Button */}
          <GradientButton 
            onPress={postData} 
            title="Post for Review" 
            disabled={!isSubmitEnabled}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
    paddingBottom: 100, // Added extra padding at bottom to account for floating tab bar
  },
  reviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F5FF',
    borderRadius: 12,
    marginBottom: 32,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  reviewTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6941C6",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
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
  dropdownContainer: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    maxHeight: 300,
  },
  dropdownScroll: {
    flexGrow: 0,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItem: {
    backgroundColor: '#F9F5FF',
  },
  selectedItemText: {
    color: '#6941C6',
    fontWeight: '600',
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
  occasionSelectorActive: {
    borderColor: "#6941C6",
  },
  occasionText: {
    fontSize: 16,
    color: "#666",
  },
  uploadContainer: {
    width: 300,
    height: 300,
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
    width: 300,
    height: 300,
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
    width: 350,
    height: 120,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "white",
  },
  swiper: {
    height: 300,
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
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 16,
    flex: 1,
  },
});
