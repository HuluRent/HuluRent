import { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useConversations } from '../hooks/useConversations';
import { useMessages } from '../hooks/useMessages';
import ConversationList from '../components/ConversationList';
import MessageThread from '../components/MessageThread';
import MessageInput from '../components/MessageInput';
import { useParams } from 'react-router-dom';

const { conversationId } = useParams();

function getConversations(data) {
  if (Array.isArray(data)) return data;
  return data?.conversations || [];
}

function getOtherUser(conversation) {
  return (
    conversation?.otherUser ||
    conversation?.participant ||
    conversation?.participants?.find(
      (participant) =>
        participant.userId !== conversation.currentUserId
    )?.user ||
    null
  );
}

function getDisplayName(user) {
  return (
    user?.profile?.displayName ||
    user?.displayName ||
    'Conversation'
  );
}

function getAvatar(user) {
  return user?.profile?.avatarUrl || user?.avatarUrl || '';
}

function getListing(conversation) {
  return (
    conversation?.booking?.item ||
    conversation?.item ||
    conversation?.listing ||
    null
  );
}

function getListingName(conversation) {
  const listing = getListing(conversation);

  return (
    listing?.title ||
    listing?.name ||
    'Rental conversation'
  );
}

function getListingImage(conversation) {
  const listing = getListing(conversation);

  return (
    listing?.imageUrl ||
    listing?.coverImage ||
    listing?.images?.[0]?.url ||
    listing?.images?.[0] ||
    ''
  );
}

function getListingPrice(conversation) {
  const listing = getListing(conversation);

  return (
    listing?.pricePerDay ||
    listing?.dailyPrice ||
    listing?.price ||
    null
  );
}

export default function ChatPage() {
  const { user } = useContext(AuthContext);
  const { data: conversationsData } = useConversations();

  const conversations = useMemo(
    () => getConversations(conversationsData),
    [conversationsData]
  );

const [selectedConversationId, setSelectedConversationId] =
  useState(null);

const activeConversationId =
  selectedConversationId ||
  conversationId ||
  conversations[0]?.id ||
  null;
  const activeConversation = conversations.find(
    (conversation) =>
      conversation.id === activeConversationId
  );

  const { data: messagesData, sendMessage, isSending } =
    useMessages(activeConversationId);

  const otherUser = getOtherUser(activeConversation);
  const displayName = getDisplayName(otherUser);
  const avatar = getAvatar(otherUser);
  const listingName = getListingName(activeConversation);
  const listingImage = getListingImage(activeConversation);
  const listingPrice = getListingPrice(activeConversation);

  const handleSend = async (content) => {
    await sendMessage(content);
  };

  return (
    <main className="messaging-page">
      <div className="messaging-layout">
        <ConversationList
          activeConversationId={activeConversationId}
          onSelectConversation={setSelectedConversationId}
        />

        <section className="chat-panel">
          {!activeConversationId ? (
            <div className="chat-empty">
              <span className="material-symbols-outlined">
                forum
              </span>
              <h2>Your messages</h2>
              <p>
                Select a conversation to start chatting.
              </p>
            </div>
          ) : (
            <>
              <header className="chat-header">
                <div className="chat-context">
                  <div className="chat-listing-image">
                    {listingImage ? (
                      <img
                        src={listingImage}
                        alt={listingName}
                      />
                    ) : (
                      <span className="material-symbols-outlined">
                        photo_camera
                      </span>
                    )}
                  </div>

                  <div className="chat-header-info">
                    <div className="chat-user-heading">
                      <h2>{displayName}</h2>
                      <span className="chat-role">
                        Participant
                      </span>
                    </div>

                    <div className="chat-listing-info">
                      <span>{listingName}</span>

                      {listingPrice !== null && (
                        <>
                          <span className="chat-dot" />
                          <strong>
                            {Number(listingPrice).toLocaleString()}{' '}
                            ETB
                            <small> / day</small>
                          </strong>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="chat-more-button"
                  aria-label="More options"
                >
                  <span className="material-symbols-outlined">
                    more_vert
                  </span>
                </button>
              </header>

              <MessageThread
                messages={messagesData}
                currentUserId={user?.id}
              />

              <MessageInput
                onSend={handleSend}
                isSending={isSending}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
