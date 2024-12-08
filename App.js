import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import Login from "./components/Auth.native";
import HomeScreen from "./app/(tabs)/index";

export default function App() {
  console.log("Hello App file");
  return <HomeScreen></HomeScreen>;

  {
    /* <View style={styles.container}>
      <Text>Welcome to StyleMe App...</Text>

      <StatusBar style="auto" />
    </View> */
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
