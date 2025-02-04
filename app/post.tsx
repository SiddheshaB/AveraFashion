import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useLocalSearchParams } from 'expo-router';

export default function PostScreen() {
  // Get post data from URL parameters
  const { post } = useLocalSearchParams();
  // Parse the JSON string back into an object
  const postData = JSON.parse(post as string);
  // Parse the image URLs array
  const images = JSON.parse(postData.image_url);

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section - Shows avatar and name */}
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: postData.profiles.avatar_url }} 
          style={styles.avatar}
        />
        <Text style={styles.fullName}>{postData.profiles.full_name}</Text>
      </View>

      {/* Title Section - Shows post title */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{postData.title}</Text>
      </View>

      {/* Images Section - Shows image carousel */}
      <View style={styles.imageSection}>
        <Swiper 
          style={styles.swiper}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          loop={false}
          showsButtons={false}
        >
          {images.map((uri: string, index: number) => (
            <View key={index} style={styles.slide}>
              <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </Swiper>
      </View>

      {/* Content Section - Shows post content */}
      <View style={styles.contentSection}>
        <Text style={styles.content}>{postData.content}</Text>
      </View>
    </ScrollView>
  );
}

// Get device dimensions for responsive layout
const { width, height } = Dimensions.get('window');

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // Profile section styles - top bar with user info
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,  // Makes it circular
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  // Title section styles
  titleSection: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 32,
  },
  // Image carousel section styles
  imageSection: {
    height: height * 0.5,  // Takes up half the screen height
    backgroundColor: '#f8f8f8',
  },
  swiper: {
    height: height * 0.5,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,  // Full width
    height: height * 0.5,
  },
  // Content section styles
  contentSection: {
    padding: 16,
    paddingTop: 20,
  },
  content: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  // Swiper dot styles
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});
