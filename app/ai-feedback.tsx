import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '../utils/supabase';
import LottieView from 'lottie-react-native';

type AiFeedback = {
  rating: number;
  fitAndProportion: string;
  colorAndPattern: string;
  styleAndOccasion: string;
  accessoriesAndDetails: string;
  groomingAndPresentation: string;
};

export default function AiFeedbackScreen() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<AiFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const startTime = Date.now();
      setIsLoading(true);
      setError(null);

      // First, check if AI feedback already exists
      const { data: existingPost, error: existingError } = await supabase
        .from('posts')
        .select('ai_feedback, image_url')
        .eq('post_id', id)
        .single();

      if (existingError) throw existingError;
      if (!existingPost) throw new Error('Post not found');

      // If AI feedback already exists, use that
      if (existingPost.ai_feedback) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        setFeedback({
          rating: existingPost.ai_feedback.rating,
          fitAndProportion: existingPost.ai_feedback.fitAndProportion,
          colorAndPattern: existingPost.ai_feedback.colorAndPattern,
          styleAndOccasion: existingPost.ai_feedback.styleAndOccasion,
          accessoriesAndDetails: existingPost.ai_feedback.accessoriesAndDetails,
          groomingAndPresentation: existingPost.ai_feedback.groomingAndPresentation,
        });
        setIsLoading(false);
        return;
      }

      // If no feedback exists, generate new feedback
      const imageUrls = JSON.parse(existingPost.image_url);

      // Call the edge function with the image URLs
      const { data: feedbackData, error: feedbackError } = await supabase.functions.invoke(
        'ai-feedback',
        {
          body: { imageUrls },
        }
      );

      if (feedbackError) throw feedbackError;

      // Save feedback to Supabase
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          ai_feedback: feedbackData
        })
        .eq('post_id', id);

      if (updateError) {
        console.error('Error saving feedback:', updateError);
        // Continue showing the feedback even if saving fails
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1500 - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      setFeedback({
        rating: feedbackData.rating,
        fitAndProportion: feedbackData.fitAndProportion,
        colorAndPattern: feedbackData.colorAndPattern,
        styleAndOccasion: feedbackData.styleAndOccasion,
        accessoriesAndDetails: feedbackData.accessoriesAndDetails,
        groomingAndPresentation: feedbackData.groomingAndPresentation,
      });
    } catch (err) {
      console.error('Error fetching AI feedback:', err);
      setError('Failed to get AI feedback. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'AI Style Analysis',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../assets/animations/OutfitSelectAnimation.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.loadingText}>Analyzing your outift...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : !feedback ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No feedback available</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {/* Overall Rating */}
          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>Style Rating</Text>
            <Text style={styles.ratingScore}>{feedback.rating.toFixed(1)}/5</Text>
          </View>

          {/* Detailed Feedback Sections */}
          <View style={styles.feedbackSection}>
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Fit & Proportion</Text>
              <Text style={styles.feedbackText}>{feedback.fitAndProportion}</Text>
            </View>

            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Color & Pattern</Text>
              <Text style={styles.feedbackText}>{feedback.colorAndPattern}</Text>
            </View>

            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Style & Occasion</Text>
              <Text style={styles.feedbackText}>{feedback.styleAndOccasion}</Text>
            </View>

            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Accessories & Details</Text>
              <Text style={styles.feedbackText}>{feedback.accessoriesAndDetails}</Text>
            </View>

            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Grooming & Presentation</Text>
              <Text style={styles.feedbackText}>{feedback.groomingAndPresentation}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  lottieAnimation: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  ratingCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  ratingScore: {
    fontSize: 36,
    fontWeight: '700',
    color: '#8B44FF',
  },
  feedbackSection: {
    paddingVertical: 20,
  },
  feedbackCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 12,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4a4a4a',
  },
});
