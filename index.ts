// Ensure native modules initialize before the app renders
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { registerRootComponent } from 'expo';

// Use the newer App version from src/
import App from './src/App';

// Prevent auto-hiding splash screen so we can control the transition
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Splash screen already hidden or not supported */
});

registerRootComponent(App);
