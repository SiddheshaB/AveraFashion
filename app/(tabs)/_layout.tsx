import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { Provider } from "react-redux";
import store from "../../store/configureStore";
import { View, Text } from "react-native";

export default function TabLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "blue",
          tabBarShowLabel: false,
          headerTitle: "StyleMe",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addPost"
          options={{
            tabBarIcon: ({ color }) => (
              <AntDesign name="plussquareo" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => (
              <AntDesign size={24} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
