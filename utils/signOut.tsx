import { useDispatch } from "react-redux";
import { supabase } from "./supabase";
import { setActiveUser } from "../store/users";
async function signOutUser(dispatch) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("User signed out successfully.");
      dispatch(setActiveUser(false));
    }
    //return <></>;
  } catch (err) {
    console.error("Unexpected error during sign out:", err.message);
  }
}

export default signOutUser;
