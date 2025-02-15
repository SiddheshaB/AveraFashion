import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store/configureStore";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
export default function Layout() {
  return (
    <Provider store={store} >
      <SafeAreaView style={{ flex: 1, padding: -29}}>
        <Stack screenOptions={{ 
          headerShown: false,
          animation: 'none'
        }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaView>
      <StatusBar backgroundColor="transparent" translucent />
    </Provider>
  );
}
