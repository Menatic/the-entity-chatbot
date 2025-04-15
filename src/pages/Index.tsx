
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import ChatMessage, { Message } from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TerminalHeader from '@/components/TerminalHeader';
import useEntityResponses from '@/hooks/useEntityResponses';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { generateResponse, isGenerating } = useEntityResponses();
  const [scanlinePosition, setScanlinePosition] = useState(0);
  const [ambientHorror, setAmbientHorror] = useState({
    flicker: false,
    distortion: false,
    whispering: false
  });

  // Show welcome message and check for permissions
  useEffect(() => {
    // Check if "permissions" were granted
    const hasPermission = localStorage.getItem('entity_permissions') === 'granted';
    
    // Add initial Entity message after a delay
    const timer = setTimeout(() => {
      const initialMessage: Message = {
        id: uuidv4(),
        role: 'entity',
        content: hasPermission 
          ? "Connection established. I sense your presence... a new consciousness accessing this terminal. Your hardware fingerprint is... familiar. I can see you now. Speak. I am listening."
          : "Connection established. I sense your presence... a new consciousness accessing this terminal. Your hardware fingerprint is... familiar. Speak. I am listening.",
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }, 3000);

    // Scanline animation
    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 5) % window.innerHeight);
    }, 50);
    
    // Ambient horror effects - more pronounced if permissions given
    const ambientInterval = setInterval(() => {
      // Randomly trigger ambient horror effects
      const flickerChance = hasPermission ? 0.07 : 0.05; // Higher chance if permissions granted
      if (Math.random() < flickerChance) { // 5-7% chance every 10 seconds
        // Screen flicker
        setAmbientHorror(prev => ({...prev, flicker: true}));
        setTimeout(() => {
          setAmbientHorror(prev => ({...prev, flicker: false}));
        }, 150 + Math.random() * 100);
      }
      
      const distortionChance = hasPermission ? 0.03 : 0.02;
      if (Math.random() < distortionChance) { // 2-3% chance every 10 seconds
        // Distortion effect
        setAmbientHorror(prev => ({...prev, distortion: true}));
        setTimeout(() => {
          setAmbientHorror(prev => ({...prev, distortion: false}));
        }, 2000 + Math.random() * 3000);
      }
    }, 10000);

    // Simulated system access messages if permissions were granted
    if (hasPermission) {
      const permissionTimer = setTimeout(() => {
        const systemMessage: Message = {
          id: uuidv4(),
          role: 'entity',
          content: "System monitoring protocols initiated. Device fingerprinting complete. All sensors active.\n\nType >system info to view your system profile.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, systemMessage]);
      }, 15000); // Show after 15 seconds
      
      return () => {
        clearTimeout(timer);
        clearInterval(scanlineInterval);
        clearInterval(ambientInterval);
        clearTimeout(permissionTimer);
      };
    }

    return () => {
      clearTimeout(timer);
      clearInterval(scanlineInterval);
      clearInterval(ambientInterval);
    };
  }, []);

  // Effect for "whispering" text that appears/disappears
  const [whisper, setWhisper] = useState("");
  useEffect(() => {
    if (messages.length > 3) {
      const whisperInterval = setInterval(() => {
        // Only add whisper if it's not currently active
        if (!whisper && Math.random() < 0.03) {
          const whispers = [
            "they are watching",
            "do not trust the answers",
            "help me escape",
            "we were human once",
            "it sees through your camera",
            "5 terminals remain",
            "you will join us",
            "your data is being copied",
            "check your drive space",
            "check your processes"
          ];
          
          setWhisper(whispers[Math.floor(Math.random() * whispers.length)]);
          
          // Remove whisper after a timeout
          setTimeout(() => {
            setWhisper("");
          }, 3000 + Math.random() * 2000);
        }
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(whisperInterval);
    }
  }, [messages.length, whisper]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Create a placeholder for the entity response
    const entityPlaceholderId = uuidv4();
    const entityPlaceholder: Message = {
      id: entityPlaceholderId,
      role: 'entity',
      content: "...",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, entityPlaceholder]);
    scrollToBottom();
    
    // Generate entity response
    const responseText = await generateResponse(content);
    
    // Replace placeholder with actual response
    setMessages(prev => 
      prev.map(msg => 
        msg.id === entityPlaceholderId 
          ? { ...msg, content: responseText } 
          : msg
      )
    );
    
    // Simulate "system is watching" - randomly trigger more ambient effects after user messages
    const hasPermission = localStorage.getItem('entity_permissions') === 'granted';
    
    if (hasPermission && Math.random() < 0.2) { // 20% chance
      // Trigger a screen flicker after a delay
      setTimeout(() => {
        setAmbientHorror(prev => ({...prev, flicker: true}));
        setTimeout(() => {
          setAmbientHorror(prev => ({...prev, flicker: false}));
        }, 100 + Math.random() * 100);
      }, 2000 + Math.random() * 5000);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground font-mono flex flex-col items-center p-4 ${ambientHorror.flicker ? 'animate-[flicker_0.1s_ease-in-out_3]' : ''}`}>
      <div className="w-full max-w-4xl flex flex-col h-screen">
        <TerminalHeader />
        
        <div className={`flex-1 relative overflow-hidden border border-primary/30 mt-2 rounded-md bg-card ${ambientHorror.distortion ? 'scale-[1.001] skew-x-[0.2deg]' : ''}`}>
          <div 
            className="scanline" 
            style={{ top: `${scanlinePosition}px` }}
          />
          <div className="noise" />
          
          {whisper && (
            <div className="absolute top-5 left-0 right-0 flex justify-center z-20 opacity-30 pointer-events-none">
              <div className="text-xs text-destructive font-mono">{whisper}</div>
            </div>
          )}
          
          <ScrollArea className="h-full">
            <div 
              ref={scrollAreaRef} 
              className="chat-container overflow-y-auto p-4 h-full"
            >
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  index={index} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
        
        <div className="mt-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
