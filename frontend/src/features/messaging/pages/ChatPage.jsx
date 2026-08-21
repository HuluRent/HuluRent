import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useConversations } from '../hooks/useConversations';
import { useMessages, useSendMessage } from '../hooks/useMessages';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import { ConversationList } from '../components/ConversationList';
import { MessageThread } from '../components/MessageThread';
import { MessageInput } from '../components/MessageInput';

// ─── connection badge ─────────────────────────────────────────────────────────

function ConnectionBadge({ status }) {
  if (status === 'connected') return null; // No badge when all is well

  const config = {
    connecting: { label: 'Connecting…', dot: 'bg-tertiary' },
    disconnected: { label: 'Offline', dot: 'bg-error' },
    error: { label: 'Connection error', dot: 'bg-error' },
  };
  const { label, dot } = config[status] ?? config.disconnected;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-xs">
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  // Router uses `:conversationId` — must match the param name in router.jsx
  const { conversationId: urlConversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { socket, connectionStatus, joinConversation, leaveConversation } = useSocket();

  const [activeConversationId, setActiveConversationId] = useState(
    urlConversationId || null
  );
  // On mobile, show the thread panel once a conversation is selected
  const [mobileShowThread, setMobileShowThread] = useState(!!urlConversationId);

  // ── data fetching ──────────────────────────────────────────────────────────

  const { data: convResponse, isLoading: convLoading } = useConversations();
  // Backend wraps with { success, data: [...] }
  const conversations = convResponse?.data ?? convResponse ?? [];

  const { data: msgResponse, isLoading: msgLoading } = useMessages(activeConversationId);
  // Backend wraps with { success, data: { messages, pagination } }
  const messages =
    msgResponse?.data?.messages ??
    msgResponse?.messages ??
    (Array.isArray(msgResponse) ? msgResponse : []);

  const sendMutation = useSendMessage();

  // ── socket room management ─────────────────────────────────────────────────

  useEffect(() => {
    if (!activeConversationId || !socket) return undefined;
    joinConversation(activeConversationId);
    return () => leaveConversation(activeConversationId);
  }, [activeConversationId, socket, joinConversation, leaveConversation]);

  // ── real-time: invalidate cache when a new message arrives ────────────────

  useEffect(() => {
    if (!socket) return undefined;

    const handleNewMessage = (message) => {
      const convId = message?.conversationId ?? activeConversationId;
      queryClient.invalidateQueries({ queryKey: ['messages', convId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('message:receive', handleNewMessage);
    return () => socket.off('message:receive', handleNewMessage);
  }, [socket, activeConversationId, queryClient]);

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleSelect = useCallback(
    (conversationId) => {
      setActiveConversationId(conversationId);
      setMobileShowThread(true);
      navigate(`/messages/${conversationId}`, { replace: true });
    },
    [navigate]
  );

  const handleSend = useCallback(
    (content) => {
      if (!activeConversationId) return;
      sendMutation.mutate({ conversationId: activeConversationId, content });
    },
    [activeConversationId, sendMutation]
  );

  const handleBack = useCallback(() => {
    setMobileShowThread(false);
  }, []);

  // ── active conversation metadata ──────────────────────────────────────────

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const activeTitle =
    activeConversation?.booking?.item?.name || 'Conversation';

  // ── loading state ─────────────────────────────────────────────────────────

  if (convLoading) {
    return (
      <div className="flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin">
            progress_activity
          </span>
          <p className="font-body-md text-on-surface-variant">Loading conversations…</p>
        </div>
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-140px)] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
      {/* ── Sidebar: conversation list ──────────────────────────────────── */}
      <div
        className={`w-full sm:w-80 border-r border-outline-variant flex-shrink-0 flex flex-col ${
          mobileShowThread ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-outline-variant flex items-center justify-between gap-2">
          <h2 className="font-headline-sm text-on-surface">Messages</h2>
          <ConnectionBadge status={connectionStatus} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* ── Main panel: message thread ──────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col ${
          !mobileShowThread ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {activeConversationId ? (
          <>
            {/* Thread header */}
            <div className="p-3 border-b border-outline-variant flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleBack}
                className="sm:hidden p-1 rounded-full hover:bg-surface-container transition-colors"
                aria-label="Back to conversations"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <span className="material-symbols-outlined text-on-surface-variant">
                home_work
              </span>
              <h3 className="font-label-md text-on-surface flex-1 truncate">
                {activeTitle}
              </h3>
            </div>

            {/* Messages */}
            <MessageThread
              messages={messages}
              currentUserId={user?.id}
              isLoading={msgLoading}
            />

            {/* Input */}
            <MessageInput
              onSend={handleSend}
              disabled={sendMutation.isPending}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant">
              forum
            </span>
            <p className="font-body-md text-on-surface-variant">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
