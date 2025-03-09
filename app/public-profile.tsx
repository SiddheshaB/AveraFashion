import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from 'react';
import { supabase } from "../utils/supabase";
import { useLocalSearchParams } from "expo-router";

export default function PublicProfile() {
  // Get user ID from URL parameters
  const { id } = useLocalSearchParams();
  
  // State management for user data and loading states
  const [userData, setUserData] = useState<any>(null);
  const [postCount, setPostCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data and stats when component mounts or ID changes
    Promise.all([fetchUserData(), fetchUserStats()])
      .finally(() => setIsLoading(false));
  }, [id]);

  // Calculate XP based on posts and reviews
  const calculateXP = (posts: number, reviews: number) => {
    return (posts * 10) + (reviews * 5);
  };

  // Fetch basic user profile data
  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch user's post and review statistics
  const fetchUserStats = async () => {
    try {
      // Get post count
      const { count: posts, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id);

      if (postsError) throw postsError;
      setPostCount(posts || 0);

      // Get review count
      const { count: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id);

      if (reviewsError) throw reviewsError;
      setReviewCount(reviews || 0);
      
      // Update XP based on activity
      setXpPoints(calculateXP(posts || 0, reviews || 0));
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#724C9D" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Show error state if user data couldn't be loaded
  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Couldn't load profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: userData.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>{userData.full_name}</Text>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{xpPoints} XP</Text>
        </View>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{postCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{reviewCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Loading and error states
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4757',
  },
  // Profile section styles
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  xpBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  xpText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  // Stats section styles
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginTop: 20,
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  }
});
