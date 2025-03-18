import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "./supabase";
import { View, StyleSheet, TouchableOpacity, Text, AppState } from "react-native";
import { useDispatch } from "react-redux";
import { setActiveUser, setUserInfo } from "../store/users";
import { router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { saveFCMToken } from "../utils/fcmToken";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function GoogleLogin() {
  const dispatch = useDispatch();

  GoogleSignin.configure({
    scopes: ["openid", "profile", "email"],
    webClientId:
      "1070194619461-52570c35msj6fjiddjnd1ee8sq1d0d55.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      if (userInfo?.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });
        console.log("User logged in successfully.");
        if (data.user?.id) {
          await saveFCMToken(data.user.id);
          console.log("FCM token saved.");
      }
        if (error) throw error;
        dispatch(setUserInfo(data));
        //dispatch(setActiveUser(true));
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Operation is in progress already");
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated");
      } else {
        console.log("Some other error happened:", error);
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={handleGoogleSignIn}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        <FontAwesome name="google" size={22} color="#4285F4" style={styles.googleIcon} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '80%',
    maxWidth: 300,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});
