import { useState } from 'react';

export default function MessageInput({
  onSend,
  isSending = false,
}) {
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = content.trim();

    if (!trimmed || isSending) return;

    await onSend(trimmed);
    setContent('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <button
        type="button"
        className="messaging-icon-button"
        aria-label="Attach file"
        disabled
        title="Attachments coming later"
      >
        <span className="material-symbols-outlined">
          attach_file
        </span>
      </button>

      <div className="message-textarea-wrapper">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          rows={1}
          disabled={isSending}
          aria-label="Message"
        />
      </div>

      <button
        type="submit"
        className="message-send-button"
        disabled={!content.trim() || isSending}
        aria-label="Send message"
      >
        <span className="material-symbols-outlined">
          send
        </span>
      </button>
    </form>
  );
}
