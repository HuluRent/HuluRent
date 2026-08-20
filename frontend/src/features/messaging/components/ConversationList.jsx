export function ConversationList({ conversations = [], activeBookingId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2 block">forum</span>
        <p className="font-body-md text-on-surface-variant">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => {
        const isActive = conv.bookingId === activeBookingId;
        const lastMessage = conv.messages?.[conv.messages.length - 1];
        const itemName = conv.booking?.item?.name || 'Conversation';

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.bookingId)}
            className={`w-full text-left px-4 py-3 border-b border-outline-variant transition-colors ${
              isActive ? 'bg-primary-container' : 'hover:bg-surface-container'
            }`}
          >
            <p className="font-label-md text-on-surface truncate">{itemName}</p>
            {lastMessage && (
              <p className="font-body-sm text-on-surface-variant truncate mt-0.5">
                {lastMessage.content}
              </p>
            )}
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              {new Date(conv.createdAt).toLocaleDateString()}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default ConversationList;
