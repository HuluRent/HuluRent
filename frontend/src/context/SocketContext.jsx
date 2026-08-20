import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return undefined;
    }

    const connection = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: {
        token,
      },
      autoConnect: true,
    });

    socketRef.current = connection;
    setSocket(connection);

    return () => {
      connection.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, []);

  const joinConversation = (bookingId) => {
    if (!socketRef.current || !bookingId) return;

    socketRef.current.emit('conversation:join', {
      bookingId,
    });
  };

  const leaveConversation = (bookingId) => {
    if (!socketRef.current || !bookingId) return;

    socketRef.current.emit('conversation:leave', {
      bookingId,
    });
  };

  const value = {
    socket,
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