// Expo expects gesture/animation runtimes to initialize before app registration.
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { registerRootComponent } from 'expo';

import AppRoot from './src/App';

registerRootComponent(AppRoot);
