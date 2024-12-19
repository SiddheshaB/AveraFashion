import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { View, Text, AppState } from "react-native";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../store/users";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
export default function GoogleLogin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the user is already signed in
    const restoreSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error retrieving session:", error.message);
      } else if (session) {
        setUser(session.user);
        dispatch(setActiveUser(true));
      } else {
        console.log("No session found.");
        dispatch(setActiveUser(false));
      }
      setLoading(false);
    };
    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user); // User signed in
        } else {
          setUser(null); // User signed out
        }
      }
    );

    restoreSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  GoogleSignin.configure({
    scopes: ["openid", "profile", "email"],
    webClientId:
      "1070194619461-52570c35msj6fjiddjnd1ee8sq1d0d55.apps.googleusercontent.com",
    offlineAccess: true, // To get refresh tokens
    forceCodeForRefreshToken: true, // For long-lived refresh tokens
  });
  return (
    <View>
      {user ? (
        <Text>Welcome, {user.email}!</Text>
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={async () => {
            try {
              await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
              });
              const userInfo = await GoogleSignin.signIn();
              if (userInfo.data.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: "google",
                  token: userInfo.data.idToken,
                });
                console.log("User logged in successfully.");
                dispatch(setActiveUser(true)); // set Status for loogedIn as True
              } else {
                throw new Error("no ID token present!");
              }
            } catch (error: any) {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
              } else if (
                error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
              ) {
                console.error("Google Sign-In Error:", error); // play services not available or outdated
              } else {
                console.error("Any other", error); // some other error happened
              }
            }
          }}
        />
      )}
    </View>
  );
}
