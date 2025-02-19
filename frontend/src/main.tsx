import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

import { AuthProvider } from '@/context/authContext';

import './css/index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
} else {
  console.error("L'élément avec l'ID 'root' est introuvable dans le DOM.");
}
