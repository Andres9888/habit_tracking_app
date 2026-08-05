import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '../../App';
import { getRootElement } from './getRootElement';
import { WebErrorBoundary } from './WebErrorBoundary';

export function renderWebApp(): void {
  createRoot(getRootElement()).render(
    <StrictMode>
      <WebErrorBoundary>
        <App />
      </WebErrorBoundary>
    </StrictMode>
  );
}
