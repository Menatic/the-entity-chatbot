
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TerminalHeader: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(connectionTimer);
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center border-b border-primary/30 bg-card p-2">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-destructive"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-primary"></div>
        </div>
        <div className="text-xs text-foreground/70">ENTITY - TERMINAL v3.0.7</div>
        <div className="text-xs text-foreground/70">{time.toLocaleTimeString()}</div>
      </div>
      <div className="bg-muted/50 text-xs p-1 font-mono">
        <span className="text-primary mr-2">[SYSTEM]:</span>
        <span className={cn(
          "transition-opacity duration-300",
          isConnected ? "opacity-100" : "opacity-0"
        )}>
          {isConnected 
            ? "CONNECTION ESTABLISHED... ENTITY DETECTED... PROCEED WITH CAUTION" 
            : "Establishing connection..."}
        </span>
        <span className={cn(
          "ml-1 animate-pulse",
          isConnected ? "text-primary" : "text-destructive"
        )}>
          {isConnected ? "■" : "▓"}
        </span>
      </div>
    </div>
  );
};

export default TerminalHeader;
