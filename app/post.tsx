/**
 * PostScreen Component
 * Displays a detailed view of a fashion post including:
 * - Image carousel
 * - User profile
 * - Post description
 * - Reviews section
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  SectionList,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import Swiper from 'react-native-swiper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ReviewSection from '../components/ReviewSection';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import ImageViewer from '../components/ImageViewer';
import ImageTopCropper from '../components/ImageTopCropper';

export default function PostScreen() {
  // Get post data from URL parameters and parse JSON
  const { post } = useLocalSearchParams();
  const router = useRouter();
  const postData = JSON.parse(post as string);
  const images = JSON.parse(postData.image_url);
  
  // Get current user from Redux store
  const user = useSelector((state: any) => state.users?.[0]?.userInfo);
  const isPostOwner = user?.user?.id === postData.user_id;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle reporting a post
  const handleReportPost = (postId: string) => {
    Alert.alert(
      "Report Post",
      "Would you like to report this post for inappropriate content?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Report",
          style: "destructive",
          onPress: () => {
            // Support email address
            const supportEmail = 'connect.avera@gmail.com';
            const subject = encodeURIComponent("Report Post - Content Violation");
            const body = encodeURIComponent(
              `I would like to report a post that may violate Avera's content policies.\n\n` +
              `Post ID: ${postId}\n\n` +
              `Please review this content according to the content moderation guidelines.`
            );
            
            const mailtoUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
            
            Linking.canOpenURL(mailtoUrl)
              .then(supported => {
                if (supported) {
                  return Linking.openURL(mailtoUrl);
                } else {
                  Alert.alert("Error", "Unable to open email client. Please email connect.avera@gmail.com directly.");
                }
              })
              .catch(error => {
                console.error("Error opening email client:", error);
                Alert.alert("Error", "Unable to open email client. Please email connect.avera@gmail.com directly.");
              });
          }
        }
      ]
    );
  };

  // Handle reporting a review
  const handleReportReview = (reviewId: string) => {
    Alert.alert(
      "Report Review",
      "Would you like to report this review for inappropriate content?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Report",
          style: "destructive",
          onPress: () => {
            // Support email address
            const supportEmail = 'connect.avera@gmail.com';
            const subject = encodeURIComponent("Report Review - Content Violation");
            const body = encodeURIComponent(
              `I would like to report a review that may violate Avera's content policies.\n\n` +
              `Review ID: ${reviewId}\n\n` +
              `Please review this content according to the content moderation guidelines.`
            );
            
            const mailtoUrl = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
            
            Linking.canOpenURL(mailtoUrl)
              .then(supported => {
                if (supported) {
                  return Linking.openURL(mailtoUrl);
                } else {
                  Alert.alert("Error", "Unable to open email client. Please email connect.avera@gmail.com directly.");
                }
              })
              .catch(error => {
                console.error("Error opening email client:", error);
                Alert.alert("Error", "Unable to open email client. Please email connect.avera@gmail.com directly.");
              });
          }
        }
      ]
    );
  };

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
                      <TouchableOpacity 
                        key={index} 
                        style={styles.slide}
                        onPress={() => setSelectedImage(uri)}
                      >
                        <ImageTopCropper
                          uri={uri}
                          width={Dimensions.get('window').width}
                          height={Dimensions.get('window').height * 0.5}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </TouchableOpacity>
                    ))}
                  </Swiper>
                </View>
              </View>
            )}

            {/* Profile and Content Section */}
            <View style={styles.profileSectionContainer}>
              {/* User Profile */}
              <View style={styles.profileSection}>
                <TouchableOpacity 
                  style={styles.profileInfo}
                  onPress={() => router.push({
                    pathname: '/public-profile',
                    params: { id: postData.user_id }
                  })}
                >
                  <Image 
                    source={{ uri: postData.profiles.avatar_url }} 
                    style={styles.avatar}
                  />
                  <Text style={styles.fullName}>{postData.profiles.full_name}</Text>
                </TouchableOpacity>
                <View style={styles.rightActions}>
                  <View style={styles.occasionCapsule}>
                    <Text style={styles.occasionText}>{postData.occasion.name}</Text>
                  </View>
                </View>
              </View>

              {/* Post Description */}
              <View style={styles.contentSection}>
                <Text style={styles.postContent}>{postData.content}</Text>
              </View>

              {/* AI Feedback Card - Only visible to post owner */}
              {isPostOwner && (
                <TouchableOpacity
                  style={styles.aiFeedbackCard}
                  onPress={() => router.push({
                    pathname: '/ai-feedback',
                    params: { id: postData.post_id }
                  })}
                >
                  <View style={styles.aiFeedbackContent}>
                    <FontAwesome name="magic" size={24} color="#8B44FF" style={styles.aiIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.aiFeedbackTitle}>AI Style Analysis</Text>
                      <Text style={styles.aiFeedbackSubtitle}>Get personalized fashion insights</Text>
                      <Text style={styles.ownerOnlyText}>Only visible to you</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={16} color="#666" />
                  </View>
                </TouchableOpacity>
              )}

              {/* Reviews Section */}
              <ReviewSection 
                postId={postData.post_id} 
                postOwnerId={postData.user_id}
                handleReportReview={handleReportReview}
              />
            </View>
            <ImageViewer
              isVisible={!!selectedImage}
              imageUrl={selectedImage || ''}
              onClose={() => setSelectedImage(null)}
            />
            
            {/* Report Post Link - At the very bottom */}
            <TouchableOpacity
              style={styles.reportPostLink}
              onPress={() => handleReportPost(postData.post_id)}
            >
              <Text style={styles.reportText}>Report Post</Text>
            </TouchableOpacity>
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
    paddingTop: 16,
    marginBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginRight: 8,
  },
  fullName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  occasionCapsule: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  occasionText: {
    fontSize: 11,
    color: '#263238',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  // Content Section
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postContent: {
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
  // Pagination Dots
  dot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  // AI Feedback Card styles
  aiFeedbackCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  aiFeedbackContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  aiIcon: {
    marginRight: 12,
  },
  aiFeedbackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  aiFeedbackSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  ownerOnlyText: {
    fontSize: 11,
    color: '#8B44FF',
    marginTop: 4,
    fontWeight: '500',
  },
  reportPostLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportText: {
    fontSize: 13,
    color: '#666',
  },
});
