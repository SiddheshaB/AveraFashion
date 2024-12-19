import { View, Text, StyleSheet, Button } from "react-native";
import Login from "../../components/Auth.native";
import signOut from "../../utils/signOut";
import { useDispatch } from "react-redux";
export default function addPost() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    signOut(dispatch);
  };
  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout}></Button>
      <View style={styles.loginBox}></View>
      <Text>
        <Login></Login>
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    borderRadius: 20,
    shadowColor: "grey",
    backgroundColor: "white",
    height: 500,
    width: 320,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
