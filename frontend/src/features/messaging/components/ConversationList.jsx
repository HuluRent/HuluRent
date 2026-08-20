export function ConversationList({
  conversations = [],
  activeConversationId,
  onSelect,
}) {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2 block">
          forum
        </span>
        <p className="font-body-md text-on-surface-variant">No conversations yet</p>
        <p className="font-body-sm text-on-surface-variant/70 mt-1 text-sm">
          Conversations are created automatically when a booking is confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" role="list" aria-label="Conversations">
      {conversations.map((conv) => {
        const isActive = conv.id === activeConversationId;
        // Backend returns messages ordered desc, take 1 — index 0 is the latest
        const lastMessage = conv.messages?.[0];
        const itemName = conv.booking?.item?.name || 'Conversation';

        return (
          <button
            key={conv.id}
            role="listitem"
            onClick={() => onSelect(conv.id)}
            aria-current={isActive ? 'true' : undefined}
            className={`w-full text-left px-4 py-3 border-b border-outline-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive ? 'bg-primary-container' : 'hover:bg-surface-container'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-on-surface-variant">
                home_work
              </span>
              <p className="font-label-md text-on-surface truncate flex-1">
                {itemName}
              </p>
            </div>

            {lastMessage && (
              <p className="font-body-sm text-on-surface-variant truncate mt-0.5 pl-6">
                {lastMessage.content}
              </p>
            )}

            <p className="font-label-sm text-on-surface-variant mt-1 pl-6">
              {new Date(conv.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default ConversationList;
