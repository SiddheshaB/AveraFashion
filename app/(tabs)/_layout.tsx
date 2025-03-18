import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { useDispatch } from "react-redux";
import { View, Keyboard, Platform } from "react-native";
import Login from "../sign_in";
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { setActiveUser, setUserInfo } from "../../store/users";
import SplashScreen from '../../components/SplashScreen';

export default function TabLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

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
      // Add a small delay before hiding splash screen
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {!user ? (
        <Login /> //if user is not signed-in, Sign-in button will appear
      ) : (
        // if user is already signed-in, Homescreen and other tabs will appear
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#724C9D",
            tabBarInactiveTintColor:"#aaa2d8",
            tabBarShowLabel: false,
            headerTitle: "Avera",
            headerShown: false,
            tabBarStyle: {
              display: isKeyboardVisible ? 'none' : 'flex',
              position: 'absolute',
              bottom: 20,
              left: '15%',
              right: '15%',
              elevation: 4,
              backgroundColor: 'white',
              marginHorizontal: 16,
              borderRadius: 15,
              height: 55,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              paddingTop: 9,
            },
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
