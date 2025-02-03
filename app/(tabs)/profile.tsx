import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import signOut from "../../utils/signOut";
import { useDispatch } from "react-redux";

export default function Profile() {
  const users = useSelector((state: any) => state.users[0].userInfo);
  const dispatch = useDispatch();
  const handleLogout = () => {
    signOut(dispatch);
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.contentContainer}>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.name}>{users.user.user_metadata.full_name}</Text>
        </View>
        <Text style={styles.email}>{users.user.email}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    elevation: 5,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "flex-start",
    width: "100%",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    marginBottom: 16,
    textTransform: "uppercase"
  },
  email: {
    fontSize: 16,
    marginBottom: 24,
  },
  signOutText: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "underline",
  },
});
