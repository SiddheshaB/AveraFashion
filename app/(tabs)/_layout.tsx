import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { useDispatch } from "react-redux";
import { View } from "react-native";
import Login from "../sign_in";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { setActiveUser, setUserInfo } from "../../store/users";
export default function TabLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    // Check if the user is already signed in
    const restoreSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error retrieving session:", error.message);
      } else if (session) {
        setUser(session);
    
      
        dispatch(setUserInfo(session));
       
      } else {
        console.log("No session found.");
        
      }
      setLoading(false);
    };
    // Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user); // User signed in
        } else {
          setUser(null); // User signed out
        }
      }
    );

    restoreSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  return (
    <View style={{ flex: 1 }}>
      {!user ? (
        <Login></Login> //if user is not  signed-in, Sign-in button will appear
      ) : (
        // if user is already signed-in, Homescreen and other tabs will appear
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
      )}
    </View>
  );
}
