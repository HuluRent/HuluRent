import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useConversations } from '../hooks/useConversations';
import { useMessages, useSendMessage } from '../hooks/useMessages';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import { ConversationList } from '../components/ConversationList';
import { MessageThread } from '../components/MessageThread';
import { MessageInput } from '../components/MessageInput';

function ConnectionBadge({ status }) {
  if (status === 'connected') return null;

  const config = {
    connecting: { label: 'Connecting…', dot: 'bg-amber-400' },
    disconnected: { label: 'Offline', dot: 'bg-red-500' },
    error: { label: 'Connection error', dot: 'bg-red-500' },
  };
  const { label, dot } = config[status] ?? config.disconnected;

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-surface-border text-text-muted font-medium text-xs">
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
}

export default function ChatPage() {
  const { conversationId: urlConversationId } = useParams();
  const [searchParams] = useSearchParams();
  const queryConversationId = searchParams.get('conversationId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { socket, connectionStatus, joinConversation, leaveConversation } = useSocket();

  const [activeConversationId, setActiveConversationId] = useState(
    urlConversationId || queryConversationId || null
  );
  const [mobileShowThread, setMobileShowThread] = useState(!!(urlConversationId || queryConversationId));

  const { data: convResponse, isLoading: convLoading } = useConversations();
  const conversations = convResponse?.data ?? convResponse ?? [];

  const { data: msgResponse, isLoading: msgLoading } = useMessages(activeConversationId);
  const messages =
    msgResponse?.data?.messages ??
    msgResponse?.messages ??
    (Array.isArray(msgResponse) ? msgResponse : []);

  const sendMutation = useSendMessage();

  useEffect(() => {
    if (!activeConversationId || !socket) return undefined;
    joinConversation(activeConversationId);
    return () => leaveConversation(activeConversationId);
  }, [activeConversationId, socket, joinConversation, leaveConversation]);

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

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const activeTitle = activeConversation?.item?.name || 'Conversation';

  if (convLoading) {
    return (
      <div className="hr-container flex h-[calc(100vh-140px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">
            progress_activity
          </span>
          <p className="font-medium text-text-muted">Loading messages…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-container h-[calc(100vh-120px)] py-4">
      <div className="flex h-full bg-white border border-surface-border rounded-2xl overflow-hidden shadow-sm">

        {/* Sidebar */}
        <div className={`w-full sm:w-80 md:w-96 border-r border-surface-border flex-shrink-0 flex flex-col bg-surface-muted/30 ${mobileShowThread ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-5 border-b border-surface-border flex items-center justify-between gap-2 bg-white">
            <h2 className="text-xl font-bold text-text">Messages</h2>
            <ConnectionBadge status={connectionStatus} />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelect={handleSelect}
            />
          </div>
        </div>

        {/* Main panel */}
        <div className={`flex-1 flex flex-col bg-surface-muted/10 ${!mobileShowThread ? 'hidden sm:flex' : 'flex'}`}>
          {activeConversationId ? (
            <>
              {/* Thread header */}
              <div className="p-4 border-b border-surface-border flex items-center gap-4 flex-shrink-0 bg-white shadow-sm z-10">
                <button
                  onClick={handleBack}
                  className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors border border-surface-border"
                  aria-label="Back to conversations"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <h3 className="font-bold text-text text-lg flex-1 truncate">
                  {activeTitle}
                </h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <MessageThread
                  messages={messages}
                  currentUserId={user?.id}
                  isLoading={msgLoading}
                />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-surface-border bg-white">
                <MessageInput
                  onSend={handleSend}
                  disabled={sendMutation.isPending}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-white/50">
              <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-4xl">
                  forum
                </span>
              </div>
              <p className="text-lg font-medium text-text">Your Messages</p>
              <p className="text-text-muted text-sm max-w-xs text-center">
                Select a conversation from the sidebar to view details and send messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
