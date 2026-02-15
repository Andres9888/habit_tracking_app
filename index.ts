// Ensure native modules initialize before the app renders
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { registerRootComponent } from 'expo';

// Keep splash screen visible until we explicitly hide it
SplashScreen.preventAutoHideAsync();

// Use the newer App version from src/
import App from './src/App';

registerRootComponent(App);
