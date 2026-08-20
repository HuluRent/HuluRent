import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/globals.css';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
