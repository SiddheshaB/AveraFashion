import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { supabase } from '../utils/supabase';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

/**
 * StarRating Component
 * Displays interactive or static star rating
 */
const StarRating = ({ 
  rating, 
  size = 20, 
  onRatingChange = null 
}: { 
  rating: number; 
  size?: number; 
  onRatingChange?: ((rating: number) => void) | null;
}) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onRatingChange && onRatingChange(star)}
          disabled={!onRatingChange}
        >
          <FontAwesome
            name={rating >= star ? 'star' : 'star-o'}
            size={size}
            color="#FFD700"
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * Type definition for a review
 * Includes user profile information through Supabase's foreign key relationship
 */
type Review = {
  id: string;
  review: string;
  rating: number;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
};

type ReviewSectionProps = {
  postId: string;  // ID of the post to show reviews for
  postOwnerId: string;  // ID of the post owner
};

/**
 * ReviewSection Component
 * Displays a list of reviews for a post and allows users to add new reviews
 */
export default function ReviewSection({ postId, postOwnerId }: ReviewSectionProps) {
  // State Management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  
  // Get current user from Redux store
  const user = useSelector((state: any) => state.users?.[0]?.userInfo);

  /**
   * Fetches all reviews for the current post from Supabase
   * Including the reviewer's profile information
   */
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);

      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  /**
   * Deletes a review from Supabase and updates the local state
   */
  const deleteReview = async (reviewId: string) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', reviewId);

              if (error) throw error;

              // Update local state
              const updatedReviews = reviews.filter(r => r.id !== reviewId);
              setReviews(updatedReviews);

              // Recalculate average rating
              if (updatedReviews.length > 0) {
                const newAvg = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;
                setAverageRating(Math.round(newAvg * 10) / 10);
              } else {
                setAverageRating(0);
              }

            } catch (error) {
              console.error('Error deleting review:', error);
              Alert.alert('Error', 'Failed to delete review. Please try again.');
            }
          }
        }
      ]
    );
  };

  /**
   * Handles the submission of a new review
   * Saves the review to Supabase and updates the local state
   */
  const addReview = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a review');
      return;
    }

    // Check if the current user is the post owner
    if (user.user.id === postOwnerId) {
      Alert.alert('Error', 'You cannot review your own post');
      return;
    }

    // Check if user has already reviewed
    const existingReview = reviews.find(r => r.user_id === user.user.id);
    if (existingReview) {
      Alert.alert('Already Reviewed', 'You have already submitted a review for this post.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            review: newReview.trim() || null,
            rating: rating,
            post_id: postId,
            user_id: user.user.id,
          },
        ])
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Update local state with the new review
      setReviews(prev => [data, ...prev]);
      setNewReview('');
      setRating(5);
      
      // Update average rating
      const newAvg = (averageRating * reviews.length + rating) / (reviews.length + 1);
      setAverageRating(Math.round(newAvg * 10) / 10);
    } catch (error) {
      console.error('Error adding review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Formats the timestamp into a readable string
   */
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Fetch reviews when component mounts or postId changes
  useEffect(() => {
    fetchReviews();
  }, [postId]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reviews</Text>
      
      {/* Average Rating Display */}
      {reviews.length > 0 && (
        <View style={styles.averageRating}>
          <Text style={styles.averageRatingText}>
            {averageRating} / 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </Text>
          <StarRating rating={averageRating} size={24} />
        </View>
      )}

      {/* Review Input Section */}
      {user && user.user.id !== postOwnerId ? (
        <View style={styles.inputContainer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Your Rating:</Text>
            <StarRating
              rating={rating}
              size={32}
              onRatingChange={setRating}
            />
          </View>
          <TextInput
            style={styles.input}
            value={newReview}
            onChangeText={setNewReview}
            placeholder="Write your review (optional)..."
            multiline
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              !rating && styles.submitButtonDisabled
            ]}
            onPress={addReview}
            disabled={isLoading || !rating}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Post Review</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.signInPrompt}>
          {!user ? "Please sign in to leave a review" : "You cannot review your own post"}
        </Text>
      )}

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewHeaderLeft}>
                <Text style={styles.userName}>{item.profiles.full_name}</Text>
                <Text style={styles.timestamp}>{formatDate(item.created_at)}</Text>
              </View>
              {(postOwnerId === user?.user?.id || item.user_id === user?.user?.id) && (
                <TouchableOpacity
                  onPress={() => deleteReview(item.id)}
                  style={styles.deleteButton}
                >
                  <FontAwesome name="trash-o" size={18} color="#e0e0e0" />
                </TouchableOpacity>
              )}
            </View>
            <StarRating rating={item.rating} size={16} />
            {item.review && (
              <Text style={styles.reviewContent}>{item.review}</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.reviewsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  averageRating: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  averageRatingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewsList: {
    paddingTop: 16,
  },
  reviewContainer: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  signInPrompt: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
});
