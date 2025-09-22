import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import App from './App';
import './index.css';

console.log('Initializing React application...'); // Debug log

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element'); // Debug log
  throw new Error('Failed to find the root element');
}

console.log('Root element found, creating root...'); // Debug log
const root = createRoot(rootElement);

// Create the app with all providers
const AppWithProviders = () => (
  <React.StrictMode>
    <BrowserRouter basename="/">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

console.log('Rendering application...'); // Debug log
root.render(<AppWithProviders />);
console.log('Application rendered'); // Debug log
