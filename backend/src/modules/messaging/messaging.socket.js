// WebSocket handlers for real-time messaging.
// Persistence still goes through messaging.repository.js so HTTP and
// socket paths always write to the same source of truth.

const repository = require('./messaging.repository');

/**
 * Registers all messaging-related socket events on a single authenticated
 * socket connection.
 *
 * @param {import('socket.io').Socket} socket  - The authenticated socket
 * @param {import('socket.io').Server}  io     - The Socket.io server instance
 */
function registerMessagingHandlers(socket, io) {
  const userId = socket.data.userId;

  // ── conversation:join ──────────────────────────────────────────────────────
  // Client emits this when it opens a conversation thread. We put the socket
  // into a room named after the conversationId so broadcasts are scoped.
  socket.on('conversation:join', async ({ conversationId }) => {
    if (!conversationId) return;

    try {
      // Verify the user is actually a participant before joining the room
      const conversation = await repository.findConversationById(conversationId);

      if (!conversation) return;

      const isParticipant = conversation.participants.some(
        (p) => p.userId === userId
      );

      if (!isParticipant) {
        socket.emit('error', { message: 'Not a participant in this conversation' });
        return;
      }

      socket.join(conversationId);
    } catch (err) {
      console.error('[socket] conversation:join error', err);
    }
  });

  // ── conversation:leave ─────────────────────────────────────────────────────
  // Client emits this when it navigates away from a thread.
  socket.on('conversation:leave', ({ conversationId }) => {
    if (!conversationId) return;
    socket.leave(conversationId);
  });

  // ── message:send ───────────────────────────────────────────────────────────
  // Client emits this to send a new message via the socket path.
  // The message is persisted first, then broadcast so all participants
  // (including the sender on other tabs) receive the saved record.
  socket.on('message:send', async ({ conversationId, content }) => {
    if (!conversationId || !content?.trim()) return;

    try {
      const conversation = await repository.findConversationById(conversationId);

      if (!conversation) {
        socket.emit('error', { message: 'Conversation not found' });
        return;
      }

      const isParticipant = conversation.participants.some(
        (p) => p.userId === userId
      );

      if (!isParticipant) {
        socket.emit('error', { message: 'Not a participant in this conversation' });
        return;
      }

      const message = await repository.createMessage({
        conversationId,
        senderId: userId,
        content: content.trim(),
      });

      // Broadcast the persisted message to everyone in the room
      // (including the sender so all tabs stay in sync)
      io.to(conversationId).emit('message:receive', message);
    } catch (err) {
      console.error('[socket] message:send error', err);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
}

module.exports = { registerMessagingHandlers };
