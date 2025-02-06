import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SectionList,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useLocalSearchParams } from 'expo-router';
import ReviewSection from '../components/ReviewSection';

export default function PostScreen() {
  // Get post data from URL parameters
  const { post } = useLocalSearchParams();
  // Parse the JSON string back into an object
  const postData = JSON.parse(post as string);
  // Parse the image URLs array
  const images = JSON.parse(postData.image_url);

  // Organize post content into sections
  const sections = [
    {
      title: 'post',
      data: [{
        type: 'content',
        content: (
          <>
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

            {/* Reviews Section */}
            <ReviewSection postId={postData.post_id} />
          </>
        )
      }]
    }
  ];

  const renderItem = ({ item }: { item: any }) => item.content;

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={() => null}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}
    />
  );
}

// Get screen dimensions for responsive sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  // Profile section styles - top bar with user info
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Title section styles
  titleSection: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Image section styles
  imageSection: {
    height: screenHeight * 0.5,
  },
  swiper: {
    height: screenHeight * 0.5,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: '100%',
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  // Content section styles
  contentSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
