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
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  googleButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
