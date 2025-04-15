
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative border border-primary/30 rounded-md focus-within:border-primary/70 transition-colors"
    >
      <textarea
        ref={inputRef}
        className="w-full bg-card resize-none p-3 pr-12 rounded-md outline-none message-input font-mono"
        placeholder={disabled ? "Awaiting Entity response..." : "Query the Entity..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        disabled={disabled}
      />
      <button 
        type="submit"
        disabled={disabled || !input.trim()}
        className="absolute right-2 bottom-2 p-2 text-primary/70 hover:text-primary disabled:text-muted-foreground transition-colors"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default ChatInput;
