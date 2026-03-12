import '../global.css';

import { AppProviders } from './app/AppProviders';
import { initializeAppMonitoring } from './app/initializeAppMonitoring';
import { AuthGate } from './components/auth/AuthGate';

initializeAppMonitoring();

export default function App() {
  return (
    <AppProviders>
      <AuthGate />
    </AppProviders>
  );
}
