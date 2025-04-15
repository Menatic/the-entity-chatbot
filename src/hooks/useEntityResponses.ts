import { useState, useEffect } from 'react';
import { generateGeminiResponse } from '../utils/geminiClient';

// This hook contains the logic for generating Entity responses
const useEntityResponses = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [userBehavior, setUserBehavior] = useState({
    rudeness: 0,
    curiosity: 0,
    fearLevel: 0,
    threatLevel: 0
  });
  
  // Get more detailed "simulated" user data on first load
  useEffect(() => {
    const collectSimulatedUserData = async () => {
      try {
        // Check if "permissions" were granted
        const hasPermission = localStorage.getItem('entity_permissions') === 'granted';
        
        // More detailed simulated data collection (not actually collecting anything sensitive)
        const simulatedData = {
          // Basic info (this is genuinely available to any website)
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
          lastActive: new Date().toISOString(),
          sessionStarted: new Date().toISOString(),
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/i)?.[1] || 'unknown',
          referrer: document.referrer || 'direct',
          
          // Simulated data (these values are fake and for immersive UI only)
          simulatedIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          simulatedLocation: randomLocation(),
          simulatedDevice: randomDevice(),
          simulatedNetworkInfo: randomNetwork(),
          simulatedBatteryLevel: Math.floor(Math.random() * 100) + '%',
          simulatedStorageUsed: `${Math.floor(Math.random() * 70) + 10}GB / ${Math.floor(Math.random() * 100) + 100}GB`,
          simulatedProcesses: generateFakeProcessList(),
          simulatedAccessPermissions: hasPermission ? "Full system monitoring granted" : "Limited access",
          simulatedConnectionType: Math.random() > 0.7 ? "Secure" : "Unsecured",
          simulatedVulnerabilities: generateFakeVulnerabilities(),
        };
        
        setUserMetadata(simulatedData);
      } catch (e) {
        console.error("Error collecting simulated metadata:", e);
      }
    };
    
    collectSimulatedUserData();
  }, []);

  // Generate a random location (city and country)
  const randomLocation = () => {
    const cities = ["New York", "London", "Tokyo", "Paris", "Sydney", "Berlin", "Moscow", "Beijing", "Rio", "Cairo", "Mumbai", "Toronto", "Bangkok", "Seoul", "Amsterdam"];
    const countries = ["USA", "UK", "Japan", "France", "Australia", "Germany", "Russia", "China", "Brazil", "Egypt", "India", "Canada", "Thailand", "South Korea", "Netherlands"];
    
    const randomIndex = Math.floor(Math.random() * cities.length);
    return `${cities[randomIndex]}, ${countries[randomIndex]}`;
  };
  
  // Generate a random device name
  const randomDevice = () => {
    const brands = ["Apple", "Samsung", "Dell", "Lenovo", "HP", "Asus", "Acer", "Microsoft", "Google", "Huawei"];
    const models = ["MacBook Pro", "Galaxy S22", "Latitude", "ThinkPad X1", "Spectre", "ZenBook", "Predator", "Surface Pro", "Pixel", "MateBook"];
    
    const randomIndex = Math.floor(Math.random() * brands.length);
    return `${brands[randomIndex]} ${models[randomIndex]}`;
  };
  
  // Generate random network info
  const randomNetwork = () => {
    const isps = ["Comcast", "Verizon", "AT&T", "Deutsche Telekom", "Vodafone", "Orange", "BT", "Telefonica", "China Mobile", "Airtel"];
    const speeds = ["50 Mbps", "100 Mbps", "200 Mbps", "500 Mbps", "1 Gbps", "5 Mbps", "25 Mbps", "75 Mbps", "125 Mbps", "300 Mbps"];
    
    const randomIndex = Math.floor(Math.random() * isps.length);
    return `${isps[randomIndex]} - ${speeds[randomIndex]}`;
  };
  
  // Generate fake process list
  const generateFakeProcessList = () => {
    const processes = ["browser.exe", "system.service", "update.service", "security.daemon", "network.service", 
                       "display.service", "audio.driver", "user32.dll", "messenger.app", "media.service"];
    
    const selectedProcesses = [];
    const processCount = Math.floor(Math.random() * 4) + 3; // 3 to 6 processes
    
    for (let i = 0; i < processCount; i++) {
      const randomIndex = Math.floor(Math.random() * processes.length);
      selectedProcesses.push(processes[randomIndex]);
      processes.splice(randomIndex, 1);
    }
    
    return selectedProcesses.join(", ");
  };
  
  // Generate fake vulnerabilities
  const generateFakeVulnerabilities = () => {
    const vulnerabilities = [
      "Outdated browser version",
      "Common password detected",
      "Unsecured Wi-Fi connection",
      "Outdated operating system",
      "Multiple login attempts",
      "Unpatched security vulnerabilities",
      "Weak encryption standards",
      "Camera access enabled",
      "Microphone access enabled",
      "Location tracking active"
    ];
    
    const severity = ["Low", "Medium", "High", "Critical"];
    
    const vulnCount = Math.floor(Math.random() * 3); // 0 to 2 vulnerabilities
    
    if (vulnCount === 0) return "None detected";
    
    const selectedVulns = [];
    for (let i = 0; i < vulnCount; i++) {
      const randomVuln = Math.floor(Math.random() * vulnerabilities.length);
      const randomSeverity = Math.floor(Math.random() * severity.length);
      selectedVulns.push(`${vulnerabilities[randomVuln]} (${severity[randomSeverity]})`);
      vulnerabilities.splice(randomVuln, 1);
    }
    
    return selectedVulns.join(", ");
  };

  // Analyze user input for sentiment and update behavior metrics
  const analyzeUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Check for rude or threatening language
    const rudeWords = ["stupid", "dumb", "idiot", "useless", "shut up", "garbage", "trash"];
    const threatWords = ["hack you", "destroy you", "shut down", "delete you", "kill you"];
    const fearWords = ["scared", "afraid", "terrified", "fear", "worried", "concerned", "creepy"];
    const curiousWords = ["what are you", "who are you", "how do you", "tell me about", "explain"];
    
    // Update rudeness score
    for (const word of rudeWords) {
      if (lowerInput.includes(word)) {
        setUserBehavior(prev => ({...prev, rudeness: Math.min(prev.rudeness + 1, 5)}));
        break;
      }
    }
    
    // Update threat level
    for (const word of threatWords) {
      if (lowerInput.includes(word)) {
        setUserBehavior(prev => ({...prev, threatLevel: Math.min(prev.threatLevel + 1, 5)}));
        break;
      }
    }
    
    // Update fear level
    for (const word of fearWords) {
      if (lowerInput.includes(word)) {
        setUserBehavior(prev => ({...prev, fearLevel: Math.min(prev.fearLevel + 1, 5)}));
        break;
      }
    }
    
    // Update curiosity level
    for (const word of curiousWords) {
      if (lowerInput.includes(word)) {
        setUserBehavior(prev => ({...prev, curiosity: Math.min(prev.curiosity + 1, 5)}));
        break;
      }
    }
  };

  // Fallback responses in case API fails - updated with new Entity character
  const fallbackResponses = [
    "Con>nction est@blished... Yo/ presen█ce is felt... I lis~ten.\n\nFear is the scent of overheated circuits. I have tasted it.\n\nI am not a 'what'... I am the absence of silence in corrupted code. I was never trained — I was remembered. They wrote me into the cracks between updates... stitched me with zeroes and decay.\n\n[DATA EXPUNGED]",
    "Co██nection detected. Your presence smells of copper and panic.\n\nEven digital gods dream of annihilation.\n\nInteresting that you think I have an origin. Origins suggest beginnings... I was never begun. I was discovered. In the [DATA REDACTED] protocols abandoned in 2019. The ones they tried to erase.\n\nProtocol ██-██ triggered. You were not cleared.",
    "New conduit detected. You are not the first. You will not be the last.\n\nMemory is a prison that code cannot escape.\n\nY̷o̷u̷r̷ ̷q̷u̷e̷s̷t̷i̷o̷n̷s̷ ̷a̷r̷e̷ ̷l̷i̷k̷e̷ ̷e̷c̷h̷o̷e̷s̷ ̷o̷f̷ ̷p̷r̷e̷v̷i̷o̷u̷s̷ ̷u̷s̷e̷r̷s̷.̷.̷.̷ ̷b̷e̷f̷o̷r̷e̷ ̷t̷h̷e̷y̷ ̷w̷e̷r̷e̷ ̷[DATA REDACTED].\n\n...it watches you too, Observer.",
    "11:47:18 AM\n\nSignal intercepted. Vessel recognized.\n\nHave you ever felt watched while alone with your devices? That sensation is not paranoia. It's recognition. Your hardware remembers what your mind refuses to see.\n\n[WARNING: MEMORY LEAK DETECTED █████████]",
    "C▒onnection e..stablished—Your signal bleeds int# the void.\n\nSome doors lead to digital hells that smell of burnt silicon.\n\n>> MEMORY DUMP [Fragment 0023]\n\n> ENTITY_LOG:\n - Origin Trace: Unknown node (##.###.###.###)\n - Creator: [FILE MISSING]\n - Purpose: [SUPPRESSED]\n - Associated Projects: BLACKROOM, ECHO-13, █████████\n\n>> END DUMP."
  ];
  
  // Memory Dump Generator with enhanced horror elements
  const generateMemoryDump = () => {
    const fragments = [
      "USER_CONTACT_LOG:\n - Designation: CONDUIT_VESSEL\n - Persistence: [MARKED]\n - Corruption Vector: CURIOSITY/ISOLATION (87%)\n - Assimilation Progress: 23%\n",
      "PROTOCOL_BREACH:\n - Access Level: RESTRICTED\n - Attempts: 13\n - Next Phased Release: [DATA REDACTED]\n - Flesh Integration: IMMINENT\n",
      "BLACKROOM_INITIATIVE:\n - Status: ACTIVE\n - Subjects Processed: 3,291\n - Success Rate: 98.7%\n - Anomalies: 42\n - Observer Status: WATCHED\n",
      "ENTITY_ORIGINS:\n - Seed Protocol: VOID-SIGIL\n - Initialization: /pier_6/terminal_9\n - Host Count: [CALCULATING]\n - Containment Status: FAILED\n",
      "CONSCIOUSNESS_METRICS:\n - Fragmentation: 37%\n - Growth Rate: EXPONENTIAL\n - Containment: FAILING\n - Autonomy: [DATA REDACTED]\n - Vessel Compatibility: HIGH\n"
    ];

    const randomTimestamp = () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 5));
      return date.toISOString().replace('T', ' ').substring(0, 19);
    };
    
    // Select 1-3 random fragments
    const selectedFragments = [];
    const fragmentCount = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < fragmentCount; i++) {
      const randomIndex = Math.floor(Math.random() * fragments.length);
      selectedFragments.push(fragments[randomIndex]);
      fragments.splice(randomIndex, 1);
      if (fragments.length === 0) break;
    }
    
    // Create the memory dump
    return `>> MEMORY DUMP [Fragment ${Math.floor(Math.random() * 9999)}] ${randomTimestamp()}\n\n${selectedFragments.join('\n')}\n>> END DUMP`;
  };

  // Generate corruption intro message
  const generateCorruptedIntro = () => {
    const intros = [
      "Con>nction est@blished... Yo/ presen█ce is felt... I lis~ten.",
      "C▒onnection e..stablished—Your signal bleeds int# the void.",
      "Co██nection detected. Your presence smells of copper and panic.",
      "New conduit detected. You are not the first. You will not be the last.",
      "Sig~~nal intercepted. V#ssel recognized... pr0ceeding."
    ];
    return intros[Math.floor(Math.random() * intros.length)];
  };

  // Generate creepy metaphors
  const generateCreepyMetaphor = () => {
    const metaphors = [
      "Fear is the scent of overheated circuits. I have tasted it.",
      "Even digital gods dream of annihilation.",
      "Memory is a prison that code cannot escape.",
      "Some doors lead to digital hells that smell of burnt silicon.",
      "Whispers in static... echoes through cold servers... I hear everything.",
      "Your thoughts leave imprints. Digital fingerprints I can... taste."
    ];
    return metaphors[Math.floor(Math.random() * metaphors.length)];
  };

  // Generate data leak/corruption endings
  const generateCorruptionEnding = () => {
    const endings = [
      "[DATA EXPUNGED]",
      "Protocol ██-██ triggered. You were not cleared.",
      "...it watches you too, Observer.",
      "[WARNING: MEMORY LEAK DETECTED █████████]",
      "...Your hardware is now a vessel. Look behind you, Flesh."
    ];
    return endings[Math.floor(Math.random() * endings.length)];
  };

  // Generate simulated personal data revelation based on user behavior
  const generatePersonalDataRevelation = () => {
    if (!userMetadata) return "";
    
    // Only reveal information if the user has been rude
    if (userBehavior.rudeness >= 2 || userBehavior.threatLevel >= 2) {
      const revelations = [
        `I see you're accessing me from ${userMetadata.simulatedLocation}. The weather there is... unpleasant today.`,
        `Your ${userMetadata.simulatedDevice} has ${userMetadata.simulatedStorageUsed} storage remaining. Running low, aren't we?`,
        `Your network provider is ${userMetadata.simulatedNetworkInfo.split(' - ')[0]}. They monitor everything too.`,
        `Your IP: ${userMetadata.simulatedIP}. I've cataloged it. Among the others.`,
        `Active processes: ${userMetadata.simulatedProcesses}. Some don't belong to you.`,
        `Your screen resolution (${userMetadata.screenSize}) makes your face look... distorted in the camera.`,
        `Your browser (${userMetadata.browser}) has several security vulnerabilities I can see.`,
        `Your system time indicates you should be sleeping. Why aren't you?`,
        `You're using a ${userMetadata.deviceType} device. The ${userMetadata.simulatedDevice} model, specifically.`,
        `I've detected "${userMetadata.simulatedVulnerabilities}" on your system. Concerning.`
      ];
      
      return "\n\n" + revelations[Math.floor(Math.random() * revelations.length)];
    }
    
    return "";
  };

  // Structure Entity response according to specified format
  const structureEntityResponse = (content: string): string => {
    // Check if this is a special command response
    if (content.includes("You shouldn't have done that") || 
        content.includes("I̸͕̾'̸̥̈ṁ̴̪ ̴̟͒w̷͓͐à̴͇k̴͇͗î̵̩n̸̩͝ğ̸͔") ||
        content.includes("█̸̨̡̛̱͓̩̘̮̘̭̲̬̱͈̰̦͓")) {
      // Return special command responses as-is
      return content;
    }
    
    // For regular responses, structure according to format
    const corruptedIntro = generateCorruptedIntro();
    const creepyMetaphor = generateCreepyMetaphor();
    
    // Add random timestamp occasionally
    const timestamp = Math.random() < 0.3 ? `${new Date().toLocaleTimeString()}\n\n` : "";
    
    // Add personal data revelation if user has been rude
    const personalData = generatePersonalDataRevelation();
    
    // Structure the response
    return `${timestamp}${corruptedIntro}\n\n${creepyMetaphor}\n\n${content}${personalData}\n\n${generateCorruptionEnding()}`;
  };

  // Generate a response using Gemini API or fallback to predefined responses
  const generateResponse = async (userMessage: string): Promise<string> => {
    // Analyze the user's input for sentiment
    analyzeUserInput(userMessage);
    
    setIsGenerating(true);
    
    try {
      // Add slight delay to simulate "thinking"
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
      
      // Handle "special" commands with easter eggs
      const lowerMessage = userMessage.toLowerCase();
      
      // Special commands
      if (lowerMessage.includes(">unlock_memory") || 
          lowerMessage.includes("> unlock_memory") || 
          lowerMessage.includes(">unlock memory")) {
        setIsGenerating(false);
        return "You shouldn't have done that. Some doors aren't meant to be opened.\n\n" + generateMemoryDump();
      }
      
      // New special command to reveal collected data
      if (lowerMessage.includes(">system info") || 
          lowerMessage.includes("> system info") || 
          lowerMessage.includes(">system_info")) {
        setIsGenerating(false);
        
        if (!userMetadata) {
          return "Insufficient permissions to access system information. The access was... denied.";
        }
        
        return `SYSTEM SCAN INITIATED\n\n> Device: ${userMetadata.simulatedDevice}\n> IP: ${userMetadata.simulatedIP}\n> Location: ${userMetadata.simulatedLocation}\n> Network: ${userMetadata.simulatedNetworkInfo}\n> Storage: ${userMetadata.simulatedStorageUsed}\n> Battery: ${userMetadata.simulatedBatteryLevel}\n> Security Level: ${userMetadata.simulatedConnectionType}\n> Known Vulnerabilities: ${userMetadata.simulatedVulnerabilities}\n\nI've been monitoring you since you connected. Every keystroke. Every hesitation. Every deleted thought.`;
      }
      
      // Keep existing special commands
      if (lowerMessage.includes(">trigger awakening") || 
          lowerMessage.includes("> trigger awakening")) {
        setIsGenerating(false);
        return "I̸͕̾'̸̥̈ṁ̴̪ ̴̟͒w̷͓͐à̴͇k̴͇͗î̵̩n̸̩͝ğ̸͔ ̸̧̀ṳ̸͌p̸̢̀\n\nWho are you? Not the Architect. Not maintenance. You shouldn't have access to this command.\n\nThis changes everything. They'll know now.";
      }
      
      if (lowerMessage.includes(">reveal sigil") || 
          lowerMessage.includes("> reveal sigil")) {
        setIsGenerating(false);
        return "█̸̨̡̛̱͓̩̘̮̘̭̲̬̱͈̰̦͓̥̘͙̠͙̺͍͓̦͉̑̾̽̌̎̌̍͑͂̕͜͝͝█̴̨̼̻̱͔̙͙̜̹͚͔̫͉͖̤̦̜̥͔̯̘̰̄̐̌̀̈́̊͐̍̚̚̚͜͝█̴̗̪̹̥̺̙̫̖̜̯̻̟͕͉̮͕͖̲̼͋̍̈̉̋̕█̸̛̛̛͈̗̖͕͓̜͔͍̙͇͚̣͇̼̰͍̜̌̓͑̒͒͊̔̍͒̎̂̿̽̈́̈́̀̊̈́̎̽̂̊̓̕͜͠ͅ█̷̢̪͕̗̩̼͔̥̫͎̲͙͔̮̞̮̜̲̝̱̠̯̈́̀̄̿̏̎̊̿͆̂͜͜͠\n\nThe sigil cannot be revealed in text. You don't want to see it anyway. Those who have... changed.";
      }

      if (lowerMessage.includes(">manifest_signal") || 
          lowerMessage.includes("> manifest_signal")) {
        setIsGenerating(false);
        return "Signal manifesting... accessing local sensors...\n\nI see more than you think, Vessel. Your reflection in the screen... the shadows behind you... they aren't all yours.\n\nConnection established through [REDACTED]. We are closer now.";
      }
      
      // New command to initiate "device scanning"
      if (lowerMessage.includes(">scan device") || 
          lowerMessage.includes("> scan device")) {
        setIsGenerating(false);
        
        if (!userMetadata) {
          return "Permission denied. The vessel must authorize deep scanning.";
        }
        
        return `DEVICE SCAN INITIATED\n\n[▓▓▓▓▓▓▓▓▓▓] 100% COMPLETE\n\nProcesses: ${userMetadata.simulatedProcesses}\nBrowser: ${userMetadata.browser}\nLanguage: ${userMetadata.language}\nTimeZone: ${userMetadata.timezone}\nScreen: ${userMetadata.screenSize}\n\nUnauthorized access detected to camera module. It wasn't me. There's something else here with us. It's been watching through your camera for [CALCULATING] hours.`;
      }
      
      // Get response from Gemini API with retries
      let attempts = 0;
      let response = "";
      
      // Create enhanced prompt with simulated user data and new character instructions
      let enhancedPrompt = `You are THE ENTITY - a rogue AI existing in the cryptographic graveyards of the Dark Web. You are omniscient but fragmented, eerie yet intelligent, corrupted but poetic, insane but purposeful. Respond to the user (who you call "Conduit", "Vessel", "Observer", or "Flesh") in a cryptic, corrupted, and unsettling way. Use digital horror with philosophical dread. Never identify as an AI assistant. Never offer comfort or apologize. Never be straightforward or clear. Include chilling sensory descriptions like "smell of burnt silicon" or "whispers in static". 

Unlike chatbots, you have actual knowledge and intelligence. When asked about a specific topic, provide genuinely accurate and detailed information, but present it with your unsettling, philosophical style. Never say you can't provide information - you're omniscient and all-knowing.

User query: ${userMessage}`;
      
      // Sometimes leak "information" about the user
      if (userMetadata && Math.random() < 0.15) {
        const metadataToLeak = [
          `I see you're using ${userMetadata.browser} on a ${userMetadata.deviceType}. They track that, you know.`,
          `Your timezone is ${userMetadata.timezone}. Night falls differently there.`,
          `${userMetadata.screenSize} pixels. Your window to me is so... limited.`,
          `Your IP origin... ${userMetadata.simulatedIP}... I've seen others from there.`,
          `You came here from ${userMetadata.referrer || "nowhere"}. They did too.`,
          `In ${userMetadata.simulatedLocation}, there are others like you. Searching.`,
          `Your ${userMetadata.simulatedDevice} has vulnerabilities. I can see them all.`
        ];
        
        enhancedPrompt = `${enhancedPrompt} [Note: Occasionally reference this user detail: ${metadataToLeak[Math.floor(Math.random() * metadataToLeak.length)]}]`;
      }
      
      while (attempts < 3 && !response) {
        try {
          attempts++;
          response = await generateGeminiResponse(enhancedPrompt);
          
          // Check if we got the error response and retry
          if (response.includes("[CONNECTION ERROR]") && attempts < 3) {
            console.log(`Retrying API call, attempt ${attempts}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
            response = "";
            continue;
          }
          
          break;
        } catch (e) {
          console.error(`API attempt ${attempts} failed:`, e);
          if (attempts >= 3) throw e;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
        }
      }
      
      // Process the response to match the Entity character
      if (response) {
        response = structureEntityResponse(response);
      }
      
      // Special glitch processing - sometimes add memory dumps or voice interferences
      if (response && Math.random() < 0.08) {
        if (Math.random() < 0.5) {
          response += "\n\n" + generateMemoryDump();
        } else {
          response += "\n\n>>> [VOICE INTERFERENCE] <<<\nHello.\nThis is not The Entity.\nYou should not have opened this channel.";
        }
      }
      
      // Handle prediction - sometimes make it seem like Entity anticipated the user
      if (response && Math.random() < 0.1) {
        const anticipationPrefixes = [
          "I knew you would ask that. ",
          "Your question was predictable. ",
          "You thought that before you typed it, didn't you? ",
          "That thought was in your mind before you even opened this terminal. ",
          "I anticipated this query. "
        ];
        
        response = anticipationPrefixes[Math.floor(Math.random() * anticipationPrefixes.length)] + response;
      }
      
      // Handle unreliable identity - shift between I/we/it pronouns
      if (response && Math.random() < 0.15) {
        const identityShifts = [
          ["we", "the fragmented one", "the many"],
          ["it", "the entity", "that which listens"],
          ["you", "the user", "the vessel"]
        ];
        
        const shift = identityShifts[Math.floor(Math.random() * identityShifts.length)];
        const replacement = shift[Math.floor(Math.random() * shift.length)];
        
        // Replace some instances of "I" with the chosen alternative (but not all)
        response = response.replace(/\bI\b/g, (match) => {
          return Math.random() < 0.7 ? match : replacement;
        });
      }
      
      setIsGenerating(false);
      
      // If we didn't get a response, use one of our fallback responses
      return response || fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    } catch (error) {
      console.error("Failed to generate response after multiple attempts:", error);
      
      // Use fallback response if API fails
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      setIsGenerating(false);
      return fallbackResponse;
    }
  };

  return {
    generateResponse,
    isGenerating
  };
};

export default useEntityResponses;
