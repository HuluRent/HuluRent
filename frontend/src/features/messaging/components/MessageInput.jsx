import { useRef, useState } from 'react';

const MAX_CHARS = 2000;

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message…',
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const remaining = MAX_CHARS - text.length;
  const isOverLimit = remaining < 0;
  const isEmpty = text.trim().length === 0;
  const canSend = !disabled && !isEmpty && !isOverLimit;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow the textarea as the user types
  const handleChange = (e) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="border-t border-outline-variant p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={MAX_CHARS + 1} // Allow typing slightly past limit so the counter turns red
          aria-label="Message input"
          className="flex-1 px-4 py-2.5 border border-outline-variant rounded-xl bg-surface font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none overflow-hidden leading-relaxed"
          style={{ minHeight: '44px' }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className="p-2.5 bg-primary text-on-primary rounded-xl hover:shadow-hover transition-all disabled:opacity-40 flex-shrink-0"
          style={{ marginBottom: '0px' }}
        >
          <span className="material-symbols-outlined text-xl leading-none">send</span>
        </button>
      </div>

      {/* Character counter — only visible when approaching the limit */}
      {remaining <= 200 && (
        <p
          className={`font-label-sm text-xs mt-1 text-right ${
            isOverLimit ? 'text-error' : 'text-on-surface-variant'
          }`}
          aria-live="polite"
        >
          {remaining} characters remaining
        </p>
      )}
    </div>
  );
}

export default MessageInput;
