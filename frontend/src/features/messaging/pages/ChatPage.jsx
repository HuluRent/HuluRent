import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversations } from '../hooks/useConversations';
import { useMessages, useSendMessage } from '../hooks/useMessages';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { ConversationList } from '../components/ConversationList';
import { MessageThread } from '../components/MessageThread';
import { MessageInput } from '../components/MessageInput';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export default function ChatPage() {
  const { bookingId: urlBookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { socket, joinConversation, leaveConversation } = useSocket();

  const [activeBookingId, setActiveBookingId] = useState(urlBookingId || null);
  const [mobileShowThread, setMobileShowThread] = useState(!!urlBookingId);

  const { data: convData, isLoading: convLoading } = useConversations();
  const conversations = Array.isArray(convData) ? convData : convData?.items || [];

  const { data: msgData, isLoading: msgLoading } = useMessages(activeBookingId);
  const messages = Array.isArray(msgData) ? msgData : msgData?.items || [];

  const sendMutation = useSendMessage();

  // Join/leave socket room
  useEffect(() => {
    if (activeBookingId && socket) {
      joinConversation(activeBookingId);
      return () => leaveConversation(activeBookingId);
    }
  }, [activeBookingId, socket, joinConversation, leaveConversation]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ['messages', activeBookingId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };
    socket.on('message:receive', handler);
    return () => socket.off('message:receive', handler);
  }, [socket, activeBookingId, queryClient]);

  const handleSelect = useCallback((bookingId) => {
    setActiveBookingId(bookingId);
    setMobileShowThread(true);
    navigate(`/messages/${bookingId}`, { replace: true });
  }, [navigate]);

  const handleSend = useCallback((content) => {
    if (activeBookingId) {
      sendMutation.mutate({ bookingId: activeBookingId, content });
    }
  }, [activeBookingId, sendMutation]);

  if (convLoading) return <LoadingSpinner label="Loading conversations…" />;

  return (
    <div className="flex h-[calc(100vh-140px)] bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full sm:w-80 border-r border-outline-variant flex-shrink-0 overflow-y-auto ${mobileShowThread ? 'hidden sm:block' : 'block'}`}>
        <div className="p-4 border-b border-outline-variant">
          <h2 className="font-headline-sm text-on-surface">Messages</h2>
        </div>
        <ConversationList
          conversations={conversations}
          activeBookingId={activeBookingId}
          onSelect={handleSelect}
        />
      </div>

      {/* Thread */}
      <div className={`flex-1 flex flex-col ${!mobileShowThread ? 'hidden sm:flex' : 'flex'}`}>
        {activeBookingId ? (
          <>
            <div className="p-3 border-b border-outline-variant flex items-center gap-2">
              <button
                onClick={() => setMobileShowThread(false)}
                className="sm:hidden p-1"
                aria-label="Back to conversations"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h3 className="font-label-md text-on-surface">
                {conversations.find((c) => c.bookingId === activeBookingId)?.booking?.item?.name || 'Conversation'}
              </h3>
            </div>
            <MessageThread
              messages={messages}
              currentUserId={user?.id}
              isLoading={msgLoading}
            />
            <MessageInput
              onSend={handleSend}
              disabled={sendMutation.isPending}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-body-md text-on-surface-variant">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
