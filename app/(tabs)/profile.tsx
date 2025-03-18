import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from "react-native";
import { useSelector } from "react-redux";
import signOut from "../../utils/signOut";
import { useDispatch } from "react-redux";
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { supabase } from "../../utils/supabase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { Linking } from 'react-native';

export default function Profile() {
  // Get user ID from Redux store
  const users = useSelector((state: any) => state.users[0].userInfo);
  const dispatch = useDispatch();

  // State management for user data and loading
  const [userData, setUserData] = useState<any>(null);
  const [postCount, setPostCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    // Fetch all user data when component mounts
    Promise.all([fetchUserData(), fetchUserStats()])
      .finally(() => setIsLoading(false));
  }, []);

  // Calculate XP points based on user activity
  const calculateXP = (posts: number, reviews: number) => {
    return (posts * 10) + (reviews * 5);
  };

  // Fetch user profile data from Supabase
  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', users.user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch user's posts and reviews statistics
  const fetchUserStats = async () => {
    try {
      // Get post count
      const { count: posts, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', users.user.id);

      if (postsError) throw postsError;
      setPostCount(posts || 0);

      // Get review count
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

  // Handle user logout
  const handleLogout = () => {
    signOut(dispatch);
  };

  // Format timestamp to date string
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  const uploadProfileImage = async (uri: string) => {
    try {
      const filename = `avatar-${users.user.id}.jpg`;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`profile/${users.user.id}/${filename}`, decode(base64), {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(`profile/${users.user.id}/${filename}`);


      // Add date to the url for cache busting
      return publicUrl+`?t=${Date.now()}`;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: newName.trim() })
        .eq('id', users.user.id);

      if (error) throw error;
      
      setUserData({ ...userData, full_name: newName.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please allow access to your photo library to change your profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setIsUploadingImage(true);
        try {
          const avatarUrl = await uploadProfileImage(result.assets[0].uri);

          // Update profile with new avatar URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', users.user.id);

          if (updateError) throw updateError;

          // Update local state
          setUserData({ ...userData, avatar_url: avatarUrl });
        } catch (error) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to update profile picture. Please try again.');
        }
        setIsUploadingImage(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Show loading spinner while fetching data
  if (isLoading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#724C9D" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity 
          onPress={handleImagePick}
          activeOpacity={0.8}
          style={styles.profileImageContainer}
        >
          <Image 
            source={{ 
              uri: userData.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
            }} 
            style={styles.profileImage} 
          />
          {isUploadingImage && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
          <View style={styles.editImageOverlay}>
            <Text style={styles.editImageText}>Change Photo</Text>
          </View>
        </TouchableOpacity>
        {isEditing ? (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
              autoFocus
            />
            <View style={styles.editButtonsRow}>
              <TouchableOpacity style={styles.editButton} onPress={handleUpdateName}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editButton, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                <Text style={styles.editButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            onPress={() => {
              setNewName(userData.full_name);
              setIsEditing(true);
            }}
            activeOpacity={0.6}
          >
            <Text style={styles.name}>{userData.full_name}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{xpPoints} XP</Text>
        </View>
      </View>

      {/* User Statistics Section */}
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

      {/* User Info Section */}
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
        <TouchableOpacity 
          style={styles.infoItem}
          onPress={() => Linking.openURL('mailto:connect.avera@gmail.com')}
        >
          <FontAwesome name="comment-o" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>Contact Support</Text>
          <FontAwesome name="chevron-right" size={14} color="#999" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
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
  // Loading state styles
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
  // Profile section styles
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  editImageText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  editNameContainer: {
    alignItems: 'center',
    marginBottom: 12,
    width: '80%',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#724C9D',
    borderRadius: 8,
    padding: 8,
    fontSize: 18,
    width: '100%',
    marginBottom: 8,
  },
  editButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    backgroundColor: '#724C9D',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  },
  // Info section styles
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
  // Sign out button styles
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
