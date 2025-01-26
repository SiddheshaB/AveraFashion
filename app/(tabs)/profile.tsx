import { View, Text, StyleSheet, Button } from "react-native";
import { useSelector } from "react-redux";
import uploadedPosts from "../../components/uploadedPosts";
import displayAllPosts from "../../components/displayAllPosts";

export default function Profile() {
  const users = useSelector((state: any) => state.users[0].userInfo);
  console.log(
    "Profile Data: " + JSON.stringify(users.user.user_metadata.full_name)
  );
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text>{users.user.email}</Text>
        <Text>{users.user.user_metadata.full_name}</Text>
        <Button title="MyPosts" onPress={uploadedPosts}></Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
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
