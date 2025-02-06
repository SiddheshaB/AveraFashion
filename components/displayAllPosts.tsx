import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabase";
import React from "react";
import { FlatList, Text, View, Image, TouchableOpacity, StyleSheet, Dimensions, RefreshControl } from "react-native";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";
import { useRouter } from 'expo-router';

// Main component for displaying all posts
export default function DisplayAllPosts() {
  // Initialize the Expo Router for navigation
  const router = useRouter();
  
  // State management for posts and UI
  const [postdata, setPostData] = useState([]); // Store all posts
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state
  const [selectedFilter, setSelectedFilter] = useState("all"); // Filter toggle state
  
  // Get user info from Redux store with null check
  const users = useSelector((state: any) => state.users);
  const user = users?.[0]?.userInfo;

  // Fetch posts from Supabase database
  const fetchData = async () => {
    try {
      // Retrieve posts from Supabase, ordered by creation date
      const { data: tableData, error } = await supabase
        .from("posts")
        .select("title,image_url,content,post_id,user_id, profiles(full_name, avatar_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPostData(tableData || []);
      console.log("Post data: ", tableData);
    } catch (error) {
      console.error("Error retrieving data from Supabase:", error);
    }
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
      {/* Filter Toggle Buttons */}
      {user && (
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              selectedFilter === "all" && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === "all" && styles.filterButtonTextActive
            ]}>All Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              selectedFilter === "my" && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter("my")}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === "my" && styles.filterButtonTextActive
            ]}>My Posts</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Posts List */}
      <FlatList
        data={filteredPosts}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            {/* User Info Section */}
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.profiles.avatar_url }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{item.profiles.full_name}</Text>
            </View>

            {/* Post Title */}
            <Text style={styles.postTitle}>{item.title}</Text>

            {/* Image Swiper */}
            <Swiper
              style={{ height: 350 }}
              loop={false}
              dotStyle={styles.dotStyle}
              activeDotColor="black"
            >
              {(JSON.parse(item.image_url)).map((uri, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={{alignItems: "center", justifyContent: "center"}}
                  onPress={() => router.push({
                    pathname: "/post",  // Navigate to post details screen
                    params: { post: JSON.stringify(item) }  // Pass post data as params
                  })}
                >
                  <Image
                    source={{ uri }}
                    style={{ width: 260, height: 300 }}
                  />
                </TouchableOpacity>
              ))}
            </Swiper>
          </View>
        )}
        style={styles.flatList}
        keyExtractor={(item) => item.post_id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterButtonActive: {
    backgroundColor: "#e0e0e0",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#000",
    fontWeight: "500",
  },
  postCard: {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "white",
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 12,
    paddingHorizontal: 4
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
    marginLeft: 10
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    alignSelf: 'stretch',
    marginBottom: 8
  },
  flatList: {
    flex: 1,
    backgroundColor: "white",
    padding: 50,
  },
  listContent: {
    justifyContent: "center",
    gap: 20,
  },
  dotStyle: {
    backgroundColor: "white",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});
