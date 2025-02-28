/**
 * PostScreen Component
 * Displays a detailed view of a fashion post including:
 * - Image carousel
 * - User profile
 * - Post description
 * - Reviews section
 */
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
  // Get post data from URL parameters and parse JSON
  const { post } = useLocalSearchParams();
  const postData = JSON.parse(post as string);
  const images = JSON.parse(postData.image_url);

  // Organize post content into sections for SectionList
  const sections = [
    {
      title: 'post',
      data: [{
        type: 'content',
        content: (
          <>
            {/* Image Carousel */}
            {images.length > 0 && (
              <View style={styles.imageSectionContainer}>
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
              </View>
            )}

            {/* Profile and Content Section */}
            <View style={styles.profileSectionContainer}>
              {/* User Profile */}
              <View style={styles.profileSection}>
                <Image 
                  source={{ uri: postData.profiles.avatar_url }} 
                  style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.fullName}>{postData.profiles.full_name}</Text>
                  <Text style={styles.userRole}>Style Curator</Text>
                </View>
              </View>

              {/* Post Description */}
              <View style={styles.contentSection}>
                <Text style={styles.content}>Trying out this new summer look with a floral dress and minimal accessories. Would love to hear your thoughts!</Text>
              </View>

              {/* Reviews Section */}
              <ReviewSection 
                postId={postData.post_id} 
                postOwnerId={postData.user_id}
              />
            </View>
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

// Styles organized by section
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
  },
  // Profile Section
  profileSectionContainer: {
    paddingTop: 20,
    marginBottom: 15,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  profileInfo: {
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fullName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#666',
  },
  // Content Section
  contentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    fontSize: 13,
    lineHeight: 20,
    color: '#333',
  },
  // Image Carousel Section
  imageSectionContainer: {
    overflow: 'hidden',
  },
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
  // Pagination Dots
  dot: {
    backgroundColor: 'rgba(0,0,0,.2)',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#000',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});
