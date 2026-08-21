export function ConversationList({
  conversations = [],
  activeConversationId,
  onSelect,
}) {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl text-text-muted block">
            forum
          </span>
        </div>
        <p className="font-semibold text-text mb-2">No conversations yet</p>
        <p className="text-sm text-text-muted">
          Message an owner from a listing to start a conversation.
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
        const itemName = conv.item?.name || 'Conversation';

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
