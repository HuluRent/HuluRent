import { useEffect, useRef } from 'react';

// ─── helpers ────────────────────────────────────────────────────────────────

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateLabel(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Returns the date string (YYYY-MM-DD) for a given ISO timestamp. */
function toDateKey(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

function getSenderName(msg) {
  return msg.sender?.profile?.fullName || msg.sender?.profile?.name || 'User';
}

function getSenderInitials(msg) {
  const name = getSenderName(msg);
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

// ─── skeleton ────────────────────────────────────────────────────────────────

function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4" aria-hidden="true">
      {[
        'self-start w-48',
        'self-end w-64',
        'self-start w-40',
        'self-end w-56',
        'self-start w-72',
        'self-end w-36',
      ].map((cls, i) => (
        <div
          key={i}
          className={`h-10 rounded-2xl bg-surface-container animate-pulse ${cls}`}
        />
      ))}
    </div>
  );
}

// ─── date divider ─────────────────────────────────────────────────────────────

function DateDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-2" aria-label={label}>
      <div className="flex-1 h-px bg-outline-variant" />
      <span className="font-label-sm text-on-surface-variant text-xs px-2">
        {label}
      </span>
      <div className="flex-1 h-px bg-outline-variant" />
    </div>
  );
}

// ─── single message bubble ────────────────────────────────────────────────────

function MessageBubble({ msg, isSent, showSender }) {
  return (
    <div className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar — only shown for received messages */}
      {!isSent && (
        <div
          className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-xs flex-shrink-0 mb-0.5"
          aria-hidden="true"
        >
          {getSenderInitials(msg)}
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isSent ? 'items-end' : 'items-start'}`}>
        {/* Sender name — shown for first message in a run from this sender */}
        {!isSent && showSender && (
          <span className="font-label-sm text-on-surface-variant text-xs mb-1 px-1">
            {getSenderName(msg)}
          </span>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl font-body-md break-words ${
            isSent
              ? 'bg-primary text-on-primary rounded-br-md'
              : 'bg-surface-container text-on-surface rounded-bl-md'
          }`}
        >
          <p>{msg.content}</p>
          <p
            className={`font-label-sm text-[10px] mt-1 ${
              isSent ? 'text-on-primary/70 text-right' : 'text-on-surface-variant'
            }`}
          >
            {formatTime(msg.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function MessageThread({ messages = [], currentUserId, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isLoading) {
    return <MessageSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">
          chat_bubble_outline
        </span>
        <p className="font-body-md text-on-surface-variant">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  // Group messages by date so we can insert date dividers
  let lastDateKey = null;
  let lastSenderId = null;

  return (
    <div
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
      role="log"
      aria-live="polite"
      aria-label="Message thread"
    >
      {messages.map((msg) => {
        const isSent = msg.senderId === currentUserId;
        const dateKey = toDateKey(msg.createdAt);
        const showDateDivider = dateKey !== lastDateKey;
        // Show sender name when the sender changes (only for received messages)
        const showSender = !isSent && msg.senderId !== lastSenderId;

        lastDateKey = dateKey;
        lastSenderId = msg.senderId;

        return (
          <div key={msg.id}>
            {showDateDivider && <DateDivider label={formatDateLabel(msg.createdAt)} />}
            <MessageBubble msg={msg} isSent={isSent} showSender={showSender} />
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageThread;
