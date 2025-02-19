import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App.js';
import './css/index.css';

const rootElement = document.getElementById('root');
const queryClient = new QueryClient();

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
} else {
  console.error("L'élément avec l'ID 'root' est introuvable dans le DOM.");
}
