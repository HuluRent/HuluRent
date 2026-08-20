import { useMemo, useState } from 'react';
import { useConversations } from '../hooks/useConversations';

function getConversationName(conversation) {
  return (
    conversation.otherUser?.profile?.displayName ||
    conversation.otherUser?.displayName ||
    conversation.participant?.profile?.displayName ||
    conversation.participant?.displayName ||
    'Conversation'
  );
}

function getConversationAvatar(conversation) {
  return (
    conversation.otherUser?.profile?.avatarUrl ||
    conversation.otherUser?.avatarUrl ||
    conversation.participant?.profile?.avatarUrl ||
    conversation.participant?.avatarUrl ||
    ''
  );
}

function getConversationPreview(conversation) {
  return (
    conversation.lastMessage?.content ||
    conversation.latestMessage?.content ||
    'No messages yet'
  );
}

function getConversationTime(conversation) {
  const value =
    conversation.lastMessage?.createdAt ||
    conversation.latestMessage?.createdAt ||
    conversation.updatedAt;

  if (!value) return '';

  return new Date(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ConversationList({
  activeConversationId,
  onSelectConversation,
}) {
  const { data, isLoading, isError } = useConversations();
  const [search, setSearch] = useState('');

  const conversations = Array.isArray(data)
    ? data
    : data?.conversations || [];

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) => {
      const name = getConversationName(conversation).toLowerCase();
      const preview = getConversationPreview(conversation).toLowerCase();

      return name.includes(query) || preview.includes(query);
    });
  }, [conversations, search]);

  return (
    <aside className="messaging-sidebar">
      <div className="messaging-sidebar-header">
        <div className="messaging-sidebar-title">
          <h1>Messages</h1>

          <button
            type="button"
            className="messaging-icon-button"
            aria-label="Compose new message"
          >
            <span className="material-symbols-outlined">
              edit_square
            </span>
          </button>
        </div>

        <div className="messaging-search">
          <span className="material-symbols-outlined">
            search
          </span>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
          />
        </div>
      </div>

      <div className="conversation-list">
        {isLoading && (
          <div className="messaging-state">
            Loading conversations...
          </div>
        )}

        {isError && (
          <div className="messaging-state messaging-state-error">
            Unable to load conversations.
          </div>
        )}

        {!isLoading &&
          !isError &&
          filteredConversations.length === 0 && (
            <div className="messaging-state">
              {search
                ? 'No conversations found.'
                : 'No conversations yet.'}
            </div>
          )}

        {filteredConversations.map((conversation) => {
          const id = conversation.id;
          const name = getConversationName(conversation);
          const avatar = getConversationAvatar(conversation);

          return (
            <button
              key={id}
              type="button"
              className={`conversation-item ${
                id === activeConversationId
                  ? 'conversation-item-active'
                  : ''
              }`}
              onClick={() => onSelectConversation(id)}
            >
              <div className="conversation-avatar">
                {avatar ? (
                  <img src={avatar} alt={name} />
                ) : (
                  <span>
                    {name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="conversation-content">
                <div className="conversation-heading">
                  <h3>{name}</h3>
                  <time>
                    {getConversationTime(conversation)}
                  </time>
                </div>

                <p className="conversation-preview">
                  {getConversationPreview(conversation)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
