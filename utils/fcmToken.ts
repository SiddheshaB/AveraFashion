import messaging from '@react-native-firebase/messaging';
import { supabase } from './supabase';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

export const getFCMToken = async () => {
  try {
    const enabled = await requestUserPermission();
    if (!enabled) {
      console.log('Notification permission denied');
      return null;
    }

    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
  return null;
};

export const saveFCMToken = async (userId: string) => {
  try {
    const fcmToken = await getFCMToken();
    if (!fcmToken) return;
    console.log('FCM Token:', fcmToken);
    const { error } = await supabase
      .from('profiles')
      .update({ fcm_token: fcmToken })
      .eq('id', userId);

    if (error) {
      console.error('Error saving FCM token:', error);
    }
  } catch (error) {
    console.error('Error in saveFCMToken:', error);
  }
};

// Listen for FCM token refresh
export const setupFCMTokenRefresh = (userId: string) => {
  messaging().onTokenRefresh(async (fcmToken) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ fcm_token: fcmToken })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating refreshed FCM token:', error);
      }
    } catch (error) {
      console.error('Error in token refresh:', error);
    }
  });
};
