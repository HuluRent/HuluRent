import { useState } from 'react';

export function MessageInput({ onSend, disabled = false, placeholder = 'Type a message…' }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-outline-variant p-3 flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-2.5 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="p-2.5 bg-primary text-on-primary rounded-xl hover:shadow-hover transition-all disabled:opacity-40"
        aria-label="Send message"
      >
        <span className="material-symbols-outlined text-xl">send</span>
      </button>
    </div>
  );
}

export default MessageInput;
