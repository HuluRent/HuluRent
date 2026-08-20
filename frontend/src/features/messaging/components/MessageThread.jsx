import { useEffect, useRef } from 'react';

export function MessageThread({ messages = [], currentUserId, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-body-md text-on-surface-variant">Loading messages…</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-body-md text-on-surface-variant">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {messages.map((msg) => {
        const isSent = msg.senderId === currentUserId;
        return (
          <div
            key={msg.id}
            className={`max-w-[75%] px-4 py-2.5 rounded-2xl font-body-md ${
              isSent
                ? 'self-end bg-primary text-on-primary rounded-br-md'
                : 'self-start bg-surface-container text-on-surface rounded-bl-md'
            }`}
          >
            <p>{msg.content}</p>
            <p className={`font-label-sm text-[10px] mt-1 ${isSent ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageThread;
