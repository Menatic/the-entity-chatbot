import React, { useState, useEffect } from 'react';
import GlitchText from './GlitchText';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  role: 'user' | 'entity';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  const isEntity = message.role === 'entity';
  const isLoading = isEntity && message.content === '...';
  const [corruptionLevel, setCorruptionLevel] = useState(1); // Reduced corruption level
  
  // Gradually increase corruption level the longer the conversation goes
  useEffect(() => {
    if (isEntity && !isLoading) {
      // Increase corruption level based on conversation index, but keep it low
      const newLevel = Math.min(3, 1 + Math.floor(index / 10));
      setCorruptionLevel(newLevel);
    }
  }, [isEntity, isLoading, index]);
  
  // Random glitch effect - sometimes flash or distort the message
  const [isGlitching, setIsGlitching] = useState(false);
  useEffect(() => {
    if (isEntity && !isLoading) {
      // Rarely trigger glitch effects
      const glitchInterval = setInterval(() => {
        if (Math.random() < 0.02) { // 2% chance every check
          setIsGlitching(true);
          setTimeout(() => {
            setIsGlitching(false);
          }, 150);
        }
      }, 10000);
      
      return () => clearInterval(glitchInterval);
    }
  }, [isEntity, isLoading]);
  
  return (
    <div className={cn(
      "mb-4 p-3 rounded-md",
      isEntity ? "bg-muted text-primary" : "bg-secondary/50",
      isGlitching && "opacity-90 translate-x-[1px]"
    )}>
      <div className="flex items-center mb-1">
        <div className={cn(
          "text-xs font-bold mr-2",
          isEntity ? "text-primary" : "text-muted-foreground"
        )}>
          {isEntity ? 'ENTITY>' : 'USER>'}
        </div>
        <div className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex space-x-2 text-primary animate-pulse">
          <span>Processing</span>
          <span className="dots-animation">...</span>
        </div>
      ) : isEntity ? (
        <GlitchText
          text={message.content}
          speed={25}
          delay={500}
          corruptionLevel={corruptionLevel}
          className="entity-message text-sm font-mono leading-relaxed"
        />
      ) : (
        <div className="text-sm">{message.content}</div>
      )}
    </div>
  );
};

export default ChatMessage;
