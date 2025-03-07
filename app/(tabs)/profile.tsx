import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector } from "react-redux";
import signOut from "../../utils/signOut";
import { useDispatch } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { supabase } from "../../utils/supabase";

export default function Profile() {
  const users = useSelector((state: any) => state.users[0].userInfo);
  const dispatch = useDispatch();
  const [postCount, setPostCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);
  
  useEffect(() => {
    fetchUserStats();
  }, []);

  const calculateXP = (posts: number, reviews: number) => {
    // XP calculation: 10 points per post, 5 points per review
    return (posts * 10) + (reviews * 5);
  };

  const fetchUserStats = async () => {
    try {
      // Fetch post count
      const { count: posts, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', users.user.id);

      if (postsError) throw postsError;
      setPostCount(posts || 0);

      // Fetch review count
      const { count: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', users.user.id);

      if (reviewsError) throw reviewsError;
      setReviewCount(reviews || 0);
      
      // Calculate and set XP points
      setXpPoints(calculateXP(posts || 0, reviews || 0));

    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleLogout = () => {
    signOut(dispatch);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: users.user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>{users.user.user_metadata.full_name}</Text>
        <Text style={styles.role}>New Member</Text>
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

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <FontAwesome name="envelope" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{users.user.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <FontAwesome name="calendar" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Joined {formatDate(users.user.created_at)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  xpBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  xpText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
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
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#f8f8f8',
    marginTop: 20,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 24,
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  signOutButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: '500',
  },
});
