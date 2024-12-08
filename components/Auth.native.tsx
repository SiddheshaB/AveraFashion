import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "../utils/supabase";

export default function GoogleLogin() {
  GoogleSignin.configure({
    //scopes: ["https://www.googleapis.com/auth/drive.readonly"],
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
          //console.log(JSON.stringify(userInfo, null, 2));
          if (userInfo.data.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.data.idToken,
            });

            console.log(error, data);
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
