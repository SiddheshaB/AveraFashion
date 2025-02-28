// Import necessary dependencies
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabase";
import React from "react";
import { FlatList, Text, View, Image, TouchableOpacity, StyleSheet, Dimensions, RefreshControl, Alert, ActivityIndicator, Modal } from "react-native";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Define the Post type for TypeScript type checking
type Post = {
  title: string;
  image_url: string;
  content: string;
  post_id: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
  reviewCount: number;
  averageRating: number;
}

/**
 * DisplayAllPosts Component
 * 
 * This component is responsible for displaying all posts in a scrollable list.
 * Features include:
 * - Fetching and displaying posts from Supabase
 * - Pull-to-refresh functionality
 * - Filter between all posts and user's posts
 * - Post deletion for user's own posts
 * - Display of review stats (count and average rating)
 */
export default function DisplayAllPosts() {
  // Initialize router for navigation
  const router = useRouter();
  
  // State management
  const [postdata, setPostData] = useState<Post[]>([]); // Store posts data
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state
  const [selectedFilter, setSelectedFilter] = useState("all"); // Filter toggle state
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  // Get user info from Redux store
  const users = useSelector((state: any) => state.users);
  const user = users?.[0]?.userInfo;

  /**
   * Fetches posts data from Supabase
   * Includes post details, user profiles, and review statistics
   */
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // First, get all posts with their basic info
      const { data: tableData, error } = await supabase
        .from("posts")
        .select(`
          title,
          image_url,
          content,
          post_id,
          user_id,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!tableData) {
        setPostData([]);
        return;
      }

      // Then, get review stats for each post
      const postsWithReviews: Post[] = await Promise.all(
        tableData.map(async (post) => {
          // Fetch reviews for the current post
          const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("post_id", post.post_id);

          // Calculate review statistics
          const reviewArray = Array.isArray(reviews) ? reviews : [];
          const reviewCount = reviewArray.length;
          const averageRating = reviewCount > 0
            ? Math.round((reviewArray.reduce((sum, review) => sum + (Number(review?.rating) || 0), 0) / reviewCount) * 10) / 10
            : 0;

          // Ensure profiles is treated as a single object, not an array
          const profiles = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;

          // Return post data with review stats
          return {
            title: String(post.title || ''),
            image_url: String(post.image_url || ''),
            content: String(post.content || ''),
            post_id: String(post.post_id || ''),
            user_id: String(post.user_id || ''),
            profiles: {
              full_name: String(profiles?.full_name || ''),
              avatar_url: String(profiles?.avatar_url || '')
            },
            reviewCount,
            averageRating
          };
        })
      );

      setPostData(postsWithReviews);
    } catch (error) {
      console.error("Error retrieving data from Supabase:", error);
      setPostData([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles post deletion with confirmation
   * Only available for user's own posts
   */
  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("posts")
                .delete()
                .eq("post_id", postId);
              
              if (error) throw error;
              
              // Refresh the posts list after deletion
              fetchData();
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Filter posts based on selected filter (all posts or user's posts)
  const filteredPosts = selectedFilter === "my" && user
    ? postdata.filter(post => post.user_id === user.user.id)
    : postdata;

  // Handle pull-to-refresh action
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  // Fetch posts when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Feed</Text>
        {user && (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setIsDropdownVisible(true)}
          >
            <FontAwesome name="sliders" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={[
                styles.dropdownItem,
                selectedFilter === "all" && styles.dropdownItemActive
              ]}
              onPress={() => {
                setSelectedFilter("all");
                setIsDropdownVisible(false);
              }}
            >
              <Text style={[
                styles.dropdownText,
                selectedFilter === "all" && styles.dropdownTextActive
              ]}>All Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.dropdownItem,
                selectedFilter === "my" && styles.dropdownItemActive
              ]}
              onPress={() => {
                setSelectedFilter("my");
                setIsDropdownVisible(false);
              }}
            >
              <Text style={[
                styles.dropdownText,
                selectedFilter === "my" && styles.dropdownTextActive
              ]}>My Posts</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Posts List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* Image Swiper Section - Only show if there are images */}
              {JSON.parse(item.image_url).length > 0 && (
                <View style={styles.imageSection}>
                  <Swiper
                    loop={false}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={styles.activeDot}
                    showsButtons={false}
                    renderPagination={(index, total) => (
                      <View style={styles.paginationContainer}>
                        <Text style={styles.paginationText}>
                          {index + 1}/{total}
                        </Text>
                      </View>
                    )}
                  >
                    {(JSON.parse(item.image_url)).map((uri: string, index: number) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.imageContainer}
                        onPress={() => router.push({
                          pathname: "/post",
                          params: { post: JSON.stringify(item) }
                        })}
                      >
                        <Image
                          source={{ uri }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    ))}
                  </Swiper>
                </View>
              )}

              {/* Profile and Review Section */}
              <View style={styles.bottomSection}>
                <View style={styles.userInfo}>
                  <Image
                    source={{ uri: item.profiles.avatar_url }}
                    style={styles.avatar}
                  />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.profiles.full_name}</Text>
                    <Text style={styles.userRole}>New Member</Text>
                  </View>
                </View>

                <View style={styles.statsContainer}>
                  {item.reviewCount > 0 ? (
                    <>
                      <View style={styles.stat}>
                        <FontAwesome name="star" size={16} color="#FFD700" />
                        <Text style={styles.statText}>{item.averageRating.toFixed(1)}</Text>
                      </View>
                      <View style={styles.stat}>
                        <FontAwesome name="comment" size={16} color="#666" />
                        <Text style={styles.statText}>{item.reviewCount}</Text>
                      </View>
                    </>
                  ) : (
                    <TouchableOpacity 
                      style={styles.reviewPrompt}
                      onPress={() => router.push({
                        pathname: "/post",
                        params: { post: JSON.stringify(item) }
                      })}
                    >
                      <FontAwesome name="star-o" size={16} color="#666" />
                      <Text style={styles.promptText}>Be the first to review!</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Delete Icon - Only visible in My Posts and if user is the post owner */}
                {selectedFilter === "my" && user?.user?.id === item.user_id && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeletePost(item.post_id)}
                  >
                    <FontAwesome name="trash" size={20} color="#e0e0e0" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={styles.feedContainer}
          style={styles.flatList}
          keyExtractor={(item) => item.post_id}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    width: '100%',
  },
  // Header styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  // Filter section styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemActive: {
    backgroundColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownTextActive: {
    color: '#724C9D',
    fontWeight: '500',
  },
  // Post card styles
  postCard: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 16,
    width: Dimensions.get('window').width - 24,
    overflow: 'hidden',
  },
  // Image section styles
  imageSection: {
    height: Dimensions.get('window').height * 0.5,
    backgroundColor: '#f8f8f8',
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Profile and Review Section
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 13,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
    fontWeight: '500',
  },
  reviewPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  promptText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  // Delete button styles
  deleteButton: {
    padding: 8,
  },
  // Swiper styles
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  paginationContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 6,
    borderRadius: 12,
  },
  paginationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  // FlatList styles
  flatList: {
    flex: 1,
  },
  feedContainer: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f8f8f8',
  },
});
