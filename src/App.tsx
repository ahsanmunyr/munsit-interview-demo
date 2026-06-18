import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AudioDemoScreen from "./screens/AudioDemoScreen";
import AudioPlayerScreen from "./screens/AudioPlayerScreen";
import ExploreScreen from "./screens/ExploreScreen";
import HomeScreen from "./screens/HomeScreen";
import HooksMenuScreen from "./screens/HooksMenuScreen";
import LoginScreen from "./screens/LoginScreen";
import TestingScreen from "./screens/TestingScreen";
import TranscriptionScreen from "./screens/TranscriptionScreen";
import SuspenseExample from "./screens/hooks/SuspenseExample";
import UseDeferredValueExample from "./screens/hooks/UseDeferredValueExample";
import UseReducerExample from "./screens/hooks/UseReducerExample";
import UseTransitionExample from "./screens/hooks/UseTransitionExample";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Transcription: undefined;
  AudioPlayer: undefined;
  AudioDemo: undefined;
  Explore: undefined;
  Testing: undefined;
  HooksMenu: undefined;
  UseTransitionExample: undefined;
  UseDeferredValueExample: undefined;
  UseReducerExample: undefined;
  SuspenseExample: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#1a1a2e" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Munsit Demo" }} />
        <Stack.Screen name="Transcription" component={TranscriptionScreen} options={{ title: "Live Transcription" }} />
        <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{ title: "Audio Player" }} />
        <Stack.Screen name="AudioDemo" component={AudioDemoScreen} options={{ title: "Record & Playback" }} />
        <Stack.Screen name="Explore" component={ExploreScreen} options={{ title: "Search & Explore" }} />
        <Stack.Screen name="Testing" component={TestingScreen} options={{ title: "Testing" }} />
        <Stack.Screen name="HooksMenu" component={HooksMenuScreen} options={{ title: "Modern Hooks" }} />
        <Stack.Screen name="UseTransitionExample" component={UseTransitionExample} options={{ title: "useTransition" }} />
        <Stack.Screen name="UseDeferredValueExample" component={UseDeferredValueExample} options={{ title: "useDeferredValue" }} />
        <Stack.Screen name="UseReducerExample" component={UseReducerExample} options={{ title: "useReducer" }} />
        <Stack.Screen name="SuspenseExample" component={SuspenseExample} options={{ title: "lazy + Suspense" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
