import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "./supabase";
import { View, AppState } from "react-native";
import { useDispatch } from "react-redux";
import { setActiveUser, setUserInfo } from "../store/users";
import { router } from "expo-router";

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
    offlineAccess: true, // To get refresh tokens
    forceCodeForRefreshToken: true, // For long-lived refresh tokens
  });
  return (
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
            console.log(
              "User logged in successfully." + JSON.stringify(userInfo)
            );
            //dispatch(setActiveUser(true)); // set Status for loogedIn as True
            //dispatch(setUserInfo(userInfo));
            router.replace("/");
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.error("Google Sign-In Error:", error); // play services not available or outdated
          } else {
            console.error("Any other", error); // some other error happened
          }
        }
      }}
    />
  );
}
