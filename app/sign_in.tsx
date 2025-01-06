import { View, Text, StyleSheet } from "react-native";
import LoginButton from "../utils/Auth";

export default function SignIn() {
  return (
    <View style={styles.container}>
      <Text style={styles.loginBanner}>Welcome to StyleMe, Please Login</Text>
      <LoginButton></LoginButton>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loginBanner: {
    textAlign: "left",
    fontSize: 32,
    fontStyle: "italic",
  },
});
