import { useEffect, useRef } from 'react';

function getMessages(data) {
  if (Array.isArray(data)) return data;
  return data?.messages || [];
}

function formatTime(value) {
  if (!value) return '';

  return new Date(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getSenderName(message) {
  return (
    message.sender?.profile?.displayName ||
    message.sender?.displayName ||
    'User'
  );
}

function getSenderAvatar(message) {
  return (
    message.sender?.profile?.avatarUrl ||
    message.sender?.avatarUrl ||
    ''
  );
}

export default function MessageThread({
  messages: data,
  currentUserId,
}) {
  const bottomRef = useRef(null);
  const messages = getMessages(data);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="message-thread message-thread-empty">
        <p>No messages yet. Start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="message-thread">
      {messages.map((message) => {
        const isOwnMessage =
          message.senderId === currentUserId;

        const senderName = getSenderName(message);
        const avatar = getSenderAvatar(message);

        return (
          <div
            key={message.id}
            className={`message-row ${
              isOwnMessage ? 'message-row-own' : ''
            }`}
          >
            {!isOwnMessage && (
              <div className="message-avatar">
                {avatar ? (
                  <img src={avatar} alt={senderName} />
                ) : (
                  <span>
                    {senderName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            )}

            <div className="message-body">
              <div className="message-bubble">
                {message.content}
              </div>

              <div className="message-meta">
                <time>{formatTime(message.createdAt)}</time>

                {isOwnMessage && (
                  <span
                    className="material-symbols-outlined message-read-icon"
                    aria-label="Sent"
                  >
                    done_all
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
