import { Stack } from "expo-router/stack";
import { Provider } from "react-redux";
import store from "../store/configureStore";

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
