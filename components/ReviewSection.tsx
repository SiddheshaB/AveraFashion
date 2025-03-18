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
 * Displays interactive or static star rating with support for half stars
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
  // Render individual star with support for full, empty, or half-filled states
  const renderStar = (position: number) => {
    const filled = rating >= position;
    const partialFill = !filled && rating > position - 1;
    
    return (
      <TouchableOpacity
        key={position}
        onPress={() => onRatingChange && onRatingChange(position)}
        disabled={!onRatingChange}
      >
        <FontAwesome
          name={partialFill ? 'star-half-o' : (filled ? 'star' : 'star-o')}
          size={size}
          color="#FFD700"
          style={styles.star}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((position) => renderStar(position))}
    </View>
  );
};

/**
 * Format a date to "X days/months ago" format
 */
const getTimeAgo = (date: string) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInMillis = now.getTime() - reviewDate.getTime();
  const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInDays < 1) {
    return 'today';
  } else if (diffInDays === 1) {
    return 'yesterday';
  } else if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  } else if (diffInMonths === 1) {
    return '1 month ago';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else if (diffInYears === 1) {
    return '1 year ago';
  } else {
    return `${diffInYears} years ago`;
  }
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
 * Post owner cannot review their own post
 */
export default function ReviewSection({ postId, postOwnerId }: ReviewSectionProps) {
  // State Management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  
  // Get current user from Redux store
  const user = useSelector((state: any) => state.users?.[0]?.userInfo);

  /**
   * Fetches reviews and calculates average rating
   */
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
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
        setAverageRating(avg);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
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
                setAverageRating(newAvg);
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
      setRating(0);
      
      // Update average rating
      const newAvg = (averageRating * reviews.length + rating) / (reviews.length + 1);
      setAverageRating(newAvg);
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

  // Load reviews on mount and when postId changes
  useEffect(() => {
    fetchReviews();
  }, [postId]);

  return (
    <View style={styles.container}>
      {/* Rating Section */}
      {reviews.length > 0 && (
        <View style={styles.ratingBlock}>
          <View style={styles.ratingContainer}>
            <StarRating rating={averageRating} size={20} />
            <Text style={styles.ratingLabel}>{averageRating.toFixed(1)}</Text>
          </View>
          <Text style={styles.averageRatingText}>
            Average rating from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </Text>
        </View>
      )}

      {/* Write Review Section */}
      {user && user.user.id !== postOwnerId && (
        <View style={styles.writeReviewBlock}>
          <Text style={styles.sectionTitle}>Write a Review</Text>
          <View style={styles.reviewStarsContainer}>
            <StarRating
              rating={rating}
              size={24}
              onRatingChange={(newRating) => setRating(newRating)}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Share your thoughts about this style..."
            value={newReview}
            onChangeText={setNewReview}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!rating) && styles.submitButtonDisabled,
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
      )}

      {/* Show sign in prompt only if user is not logged in */}
      {!user && (
        <Text style={styles.signInPrompt}>
          Please sign in to leave a review
        </Text>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, styles.reviewsTitle]}>Reviews</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.reviewCardContainer}>
                  <View style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewHeaderLeft}>
                        <Text style={styles.userName}>{item.profiles.full_name}</Text>
                        <Text style={styles.timestamp}>
                          {getTimeAgo(item.created_at)}
                        </Text>
                      </View>
                      <StarRating rating={item.rating} size={16} />
                      {item.user_id === user?.user?.id && (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => deleteReview(item.id)}
                        >
                          <FontAwesome name="trash-o" size={20} color="#666" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.reviewContent}>{item.review}</Text>
                  </View>
                </View>
              )}
              style={styles.reviewsList}
              contentContainerStyle={styles.reviewsListContent}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  // Rating Block
  ratingBlock: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1a1a1a',
  },
  averageRatingText: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 20,
  },
  // Write Review Block
  writeReviewBlock: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  reviewStarsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  input: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 13,
    color: '#444',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  submitButton: {
    marginHorizontal: 20,
    backgroundColor: '#8B44FF',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(139, 68, 255, 0.5)',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Reviews Block
  reviewsTitle: {
    marginHorizontal: 15,
    marginBottom: 10,
    marginTop: 15,
  },
  reviewsList: {
    flex: 1,
  },
  reviewsListContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  reviewCardContainer: {
    marginBottom: 10,
    marginHorizontal: 15,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 10,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  reviewContent: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4a4a4a',
    marginTop: 8,
  },
  signInPrompt: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
    fontSize: 12,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});
