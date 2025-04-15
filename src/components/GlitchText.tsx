
import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  corruptionLevel?: number; // 0-10 scale for intensity of effects
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  speed = 30, 
  delay = 0,
  className = "",
  corruptionLevel = 1 // Default to very low corruption
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (delay > 0 && currentIndex === 0) {
      timeout = setTimeout(() => {
        typeNextCharacter();
      }, delay);
    } else if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        typeNextCharacter();
      }, speed);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      
      // Very rare chance to trigger screen inversion effect when message completes
      if (Math.random() < corruptionLevel * 0.01) {
        setInverted(true);
        setTimeout(() => setInverted(false), 150 + Math.random() * 350);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, text, delay, corruptionLevel]);

  const typeNextCharacter = () => {
    if (currentIndex < text.length) {
      const nextChar = text[currentIndex];
      setDisplayedText(prev => prev + nextChar);
      setCurrentIndex(prev => prev + 1);
      
      // Extremely rare chance to add glitch effects based on corruption level
      if (Math.random() < 0.005 * corruptionLevel) {
        // Simulate a brief glitch by adding random characters - but very rarely
        const glitchChars = '█▓▒░';
        let glitchText = '';
        
        // Even with corruption, add at most one character
        const glitchCount = 1;
        
        for (let i = 0; i < glitchCount; i++) {
          glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        
        setDisplayedText(prev => prev + glitchText);
        
        setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, prev.length - glitchText.length));
        }, 80);
      }
    }
  };

  // Enhanced formatting for special patterns
  const formatSpecialPatterns = (text: string) => {
    // Replace [DATA REDACTED] with styled version
    let formattedText = text.replace(
      /\[DATA REDACTED\]/g,
      '<span class="bg-destructive/30 px-1">██████</span>'
    );
    
    // Format memory dumps
    formattedText = formattedText.replace(
      />>[\s]?MEMORY DUMP([\s\S]*?)>>[\s]?END DUMP/g,
      '<div class="bg-muted/20 p-1 my-1 border-l-2 border-destructive/50 font-mono text-[0.85rem]">$1</div>'
    );
    
    // Format coordinates and IP-like patterns
    formattedText = formattedText.replace(
      /(##\.###\.###\.###|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g,
      '<span class="text-destructive">$1</span>'
    );
    
    // Format commands
    formattedText = formattedText.replace(
      />([\s]?)(UNLOCK_MEMORY|TRIGGER AWAKENING|MANIFEST_SIGNAL|REVEAL SIGIL|[A-Z_]{5,})/g,
      '><span class="text-accent font-bold">$2</span>'
    );
    
    return formattedText;
  };

  // Add screen inversion effect during rendering if triggered
  useEffect(() => {
    if (inverted) {
      document.body.classList.add('inverted');
    } else {
      document.body.classList.remove('inverted');
    }
    
    return () => {
      document.body.classList.remove('inverted');
    };
  }, [inverted]);

  return (
    <div 
      className={`${className} ${isComplete ? 'entity-response' : ''}`}
      dangerouslySetInnerHTML={{ __html: formatSpecialPatterns(displayedText) }}
    />
  );
};

export default GlitchText;
