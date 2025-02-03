import { View, Text, StyleSheet } from "react-native";
import DisplayAllPosts from "../../components/displayAllPosts";
export default function Home() {
  return (
    <View style={styles.container}>
      <DisplayAllPosts />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
