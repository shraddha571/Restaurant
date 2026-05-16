import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-center" toastOptions={{
      style: {
        background: '#fff',
        color: '#570000',
        border: '1px solid #D4AF37',
      },
    }} />
    <App />
  </StrictMode>,
);
