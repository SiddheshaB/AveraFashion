import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import DisplayAllPosts from "../../components/displayAllPosts";

export default function Home() {
  return (
    <LinearGradient
    colors={['#4c669f', '#3b5998', '#192f6a']}
    style={styles.container}
  >
   
      <DisplayAllPosts />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
