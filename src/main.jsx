import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from "./components/ui/ScrollToTop";
import { Toaster } from "sonner";
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={2000}
        expand={true}
      />
    </BrowserRouter>
  </StrictMode>,
);