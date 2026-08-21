// Attaches the Socket.io server to the existing HTTP server and wires up
// per-connection authentication + event delegation.

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { registerMessagingHandlers } = require('../modules/messaging/messaging.socket');

/**
 * Creates a Socket.io server, attaches it to the provided HTTP server, and
 * registers all real-time event handlers.
 *
 * @param {import('http').Server} httpServer
 */
function attachSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.frontendOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Allow both websocket and long-polling so the client can fall back
    transports: ['websocket', 'polling'],
  });

  // ── Authentication middleware ──────────────────────────────────────────────
  // Runs before the connection event. Rejects sockets without a valid JWT.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      // Attach the userId to the socket so handlers can read it without
      // re-querying the DB on every event.
      socket.data.userId = decoded.userId;
      return next();
    } catch {
      return next(new Error('Invalid or expired token'));
    }
  });

  // ── Connection handler ─────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    // Automatically join a personal room so we can push user-targeted
    // notifications in the future (e.g. booking updates).
    socket.join(`user:${socket.data.userId}`);

    // Delegate messaging events to the messaging module
    registerMessagingHandlers(socket, io);

    socket.on('disconnect', (reason) => {
      // Nothing to clean up — Socket.io removes the socket from all rooms
      // automatically on disconnect.
    });
  });

  return io;
}

module.exports = { attachSocketServer };
