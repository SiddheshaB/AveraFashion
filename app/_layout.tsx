import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../store/configureStore";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function Layout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <Stack screenOptions={{ 
            headerShown: false,
            animation: 'none'
          }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
