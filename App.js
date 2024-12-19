import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import Login from "./components/Auth.native";
import HomeScreen from "./app/(tabs)/index";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  console.log("Hello App file");
  return <View></View>;

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
});
