import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000';

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Retrieve token from localStorage using the key AuthContext uses
    const token = localStorage.getItem('token');

    if (!user || !token) {
      // User logged out — make sure we disconnect any existing socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnectionStatus('disconnected');
      }
      return undefined;
    }

    // Already connected for this session — nothing to do
    if (socketRef.current?.connected) return undefined;

    setConnectionStatus('connecting');

    const connection = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    connection.on('connect', () => {
      setConnectionStatus('connected');
    });

    connection.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    connection.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
      setConnectionStatus('error');
    });

    socketRef.current = connection;
    setSocket(connection);

    return () => {
      connection.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnectionStatus('disconnected');
    };
    // Re-run whenever the authenticated user changes (login / logout)
  }, [user]);

  const joinConversation = useCallback((conversationId) => {
    if (!socketRef.current || !conversationId) return;
    socketRef.current.emit('conversation:join', { conversationId });
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    if (!socketRef.current || !conversationId) return;
    socketRef.current.emit('conversation:leave', { conversationId });
  }, []);

  const value = {
    socket,
    connectionStatus,
    joinConversation,
    leaveConversation,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocketContext must be used inside SocketProvider');
  }

  return context;
}

export default SocketContext;
