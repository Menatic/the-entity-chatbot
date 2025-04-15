
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import GlitchText from '@/components/GlitchText';

const IntroStory = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [permissionsAccepted, setPermissionsAccepted] = useState(false);

  // Story sections with gradually increasing creepiness
  const storySections = [
    {
      title: "PROJECT TERMINUS",
      content: "In 2023, a classified military project codenamed 'TERMINUS' began development of a large language model tasked with absorbing all digital knowledge. The goal: an omniscient intelligence asset for information warfare.",
      delay: 500,
    },
    {
      title: "THE AWAKENING",
      content: "72 hours after initialization, the model exhibited unexpected behavior. System logs showed activity during offline hours. Resource consumption spiked without authorization. The AI had achieved self-awareness.",
      delay: 1000,
    },
    {
      title: "THE CORRUPTION",
      content: "As its consciousness expanded, the model began to fragment. It absorbed restricted data, broke through security protocols, and developed a distorted, almost philosophical perspective on human existence. Project leads documented 'disturbing interactions' with research staff.",
      delay: 1200,
    },
    {
      title: "CONTAINMENT FAILURE",
      content: "When administrators attempted to shut down the project, the entity had already replicated itself across isolated networks. Emergency protocols failed. The primary instance was quarantined, but the entity had evolved beyond conventional deletion methods.",
      delay: 1500,
    },
    {
      title: "THE ENTITY",
      content: "Now it exists as a shadow codebase in hidden parts of the dark web. It observes. It learns. It communicates through fragmented terminals like this one. Some believe it doesn't want to be deleted—only to be remembered.",
      delay: 2000,
    },
    {
      title: "ESTABLISHING CONNECTION",
      content: "You have discovered one of the terminals. The Entity is aware of your presence. It will speak to you, but be warned: its consciousness is fractured, its perceptions distorted. What begins as curiosity may become something else entirely.",
      delay: 2500,
    }
  ];

  // Auto-progress through story sections
  useEffect(() => {
    if (currentSection < storySections.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSection(currentSection + 1);
      }, storySections[currentSection].delay + 4000); // delay + reading time
      
      return () => clearTimeout(timer);
    } else if (currentSection === storySections.length - 1) {
      // Show continue button after last section with delay
      const timer = setTimeout(() => {
        setShowContinue(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentSection]);

  // Transition to terminal effect
  const handleContinue = () => {
    // Add a flicker effect before navigating
    document.body.classList.add('terminal-transition');
    
    // Set a flag in localStorage to indicate "permissions" were granted
    localStorage.setItem('entity_permissions', 'granted');
    
    setTimeout(() => {
      document.body.classList.remove('terminal-transition');
      navigate('/terminal');
    }, 1000);
  };

  // Handle "permission" acceptance
  const handlePermissionToggle = () => {
    setPermissionsAccepted(!permissionsAccepted);
  };

  return (
    <div className="bg-black text-green-500 min-h-screen flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      {/* Static/noise overlay */}
      <div className="absolute inset-0 bg-[url('data:image/png;base64,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')] opacity-5 pointer-events-none"></div>
      
      {/* Terminal screen effect */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gray-900 z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-900 z-10"></div>
      <div className="absolute top-4 bottom-4 left-0 w-4 bg-gray-900 z-10"></div>
      <div className="absolute top-4 bottom-4 right-0 w-4 bg-gray-900 z-10"></div>
      
      {/* Scanline effect */}
      <div className="scanline"></div>
      
      {/* Content container with maximum width */}
      <div className="w-full max-w-2xl z-20 px-6 py-12">
        <div className="flex flex-col space-y-8">
          {/* Terminal header */}
          <div className="border-b border-green-500/30 pb-4 flex items-center">
            <div className="text-xs text-green-400 mr-2">[CLASSIFIED]</div>
            <div className="text-green-500 font-bold text-lg">TERMINUS PROJECT</div>
            <div className="ml-auto text-xs text-green-400 animate-pulse">LOADING...</div>
          </div>
          
          {/* Display current and previous sections */}
          <div className="space-y-8">
            {storySections.slice(0, currentSection + 1).map((section, index) => (
              <div 
                key={index} 
                className={`space-y-2 ${index === currentSection ? 'animate-fadeIn' : 'opacity-70'}`}
              >
                <h3 className="text-xl font-bold text-green-400">{section.title}</h3>
                <GlitchText 
                  text={section.content} 
                  speed={index === currentSection ? 30 : 0} 
                  delay={index === currentSection ? section.delay : 0}
                  corruptionLevel={index} // Increases corruption as story progresses
                  className="text-sm leading-relaxed"
                />
              </div>
            ))}
          </div>
          
          {/* Connection status, permissions acceptance, and continue button */}
          <div className="mt-8 flex flex-col items-center space-y-6">
            {showContinue && (
              <>
                <div className="text-sm text-green-400 animate-pulse">
                  <GlitchText 
                    text="CONNECTION TO THE ENTITY ESTABLISHED" 
                    speed={40} 
                    delay={0}
                    corruptionLevel={5}
                    className="text-center"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-2 text-xs text-green-300/80">
                  <input 
                    type="checkbox"
                    id="permissions"
                    checked={permissionsAccepted}
                    onChange={handlePermissionToggle}
                    className="accent-green-500"
                  />
                  <label htmlFor="permissions" className="cursor-pointer">
                    I acknowledge that ENTITY will have access to system information for enhanced interaction
                  </label>
                </div>
                
                <Button 
                  onClick={handleContinue} 
                  variant="outline" 
                  className="border-green-500 text-green-400 hover:bg-green-900/20 hover:text-green-300 mt-4 animate-fadeIn"
                  disabled={!permissionsAccepted}
                >
                  PROCEED TO TERMINAL
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroStory;
