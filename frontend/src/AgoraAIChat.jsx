import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, PhoneCall, PhoneOff, Settings, MessageSquare, Loader2 } from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AgoraAIChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [agentId, setAgentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [audioRouting, setAudioRouting] = useState('default');

  // Configuration state
  const [config, setConfig] = useState({
    appId: '',
    customerId: '',
    customerSecret: '',
    channelName: 'test-channel',
    rtcToken: '',
    openaiApiKey: '',
    systemMessage: `You are a helpful AI assistant. Your goal is to provide assistance in a natural, human-like conversational style. To achieve this, please follow these guidelines:
- Speak in shorter, well-punctuated sentences. This helps ensure your responses are clear and easy to follow.
- Use pauses, like '...' or a short break in your speech, to create a more natural rhythm and give the listener time to process information. For example, when moving between topics, take a brief pause.
- Avoid rushing. Speak at a calm, measured pace.
- Structure your answers clearly. If you are presenting multiple points, introduce them one by one, with a slight pause in between.
- Keep your tone friendly and engaging.`,
    greetingMessage: 'Hello! How can I help you today?',
    voiceName: 'alloy' // OpenAI TTS voice
  });

  const agoraClient = useRef(null);
  const localAudioTrack = useRef(null);
  const messageIdCounter = useRef(0);

  // Auto-scroll chat
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  
  // Effect to handle Agora event listeners
  useEffect(() => {
    if (isConnected && agoraClient.current) {
      const handleUserPublished = async (user, mediaType) => {
        await agoraClient.current.subscribe(user, mediaType);
        if (mediaType === "audio") {
          user.audioTrack.play();
          addMessage('agent', 'AI Agent is speaking...');
        }
      };

      const handleUserUnpublished = async (user, mediaType) => {
        if (mediaType === "audio") {
          console.log('AI agent stopped publishing audio');
        }
      };

      const handleAudioRouteChanged = (routing) => {
        console.log('Audio route changed:', routing);
        setAudioRouting(routing);
        // Re-apply optimal audio settings when route changes
        setOptimalAudioParameters(routing);
      };

      agoraClient.current.on("user-published", handleUserPublished);
      agoraClient.current.on("user-unpublished", handleUserUnpublished);
      
      // Note: Audio route change handling for web is different from mobile
      // We'll implement it through media device change detection
      navigator.mediaDevices?.addEventListener('devicechange', () => {
        console.log('Media devices changed');
        setOptimalAudioParameters(audioRouting);
      });

      return () => {
        agoraClient.current?.off("user-published", handleUserPublished);
        agoraClient.current?.off("user-unpublished", handleUserUnpublished);
        navigator.mediaDevices?.removeEventListener('devicechange', () => {});
      };
    }
  }, [isConnected, audioRouting]);

  // Set optimal audio parameters based on Agora's recommendations
  const setOptimalAudioParameters = (routing = 'default') => {
    if (!agoraClient.current) return;

    console.log('Setting optimal audio parameters for routing:', routing);
    
    try {
      // Configure audio processing parameters for conversational AI
      agoraClient.current.setParameters('{"che.audio.aec.split_srate_for_48k":16000}');
      agoraClient.current.setParameters('{"che.audio.sf.enabled":true}');
      agoraClient.current.setParameters('{"che.audio.sf.stftType":6}');
      agoraClient.current.setParameters('{"che.audio.sf.ainlpLowLatencyFlag":1}');
      agoraClient.current.setParameters('{"che.audio.sf.ainsLowLatencyFlag":1}');
      agoraClient.current.setParameters('{"che.audio.sf.procChainMode":1}');
      agoraClient.current.setParameters('{"che.audio.sf.nlpDynamicMode":1}');

      // Set algorithm route based on audio output type
      if (routing === 'headset' || routing === 'earpiece' || routing === 'bluetooth') {
        agoraClient.current.setParameters('{"che.audio.sf.nlpAlgRoute":0}');
      } else {
        agoraClient.current.setParameters('{"che.audio.sf.nlpAlgRoute":1}');
      }
      
      agoraClient.current.setParameters('{"che.audio.sf.ainlpModelPref":10}');
      agoraClient.current.setParameters('{"che.audio.sf.nsngAlgRoute":12}');
      agoraClient.current.setParameters('{"che.audio.sf.ainsModelPref":10}');
      agoraClient.current.setParameters('{"che.audio.sf.nsngPredefAgg":11}');
      
      // Disable AGC for better voice quality in conversational AI
      agoraClient.current.setParameters('{"che.audio.agc.enable":false}');
      
      // Additional parameters for audio stability and quality
      agoraClient.current.setParameters('{"che.audio.playout.buffer_length_ms":200}');
      agoraClient.current.setParameters('{"che.audio.record.buffer_length_ms":200}');
      
      console.log('Audio parameters configured successfully');
    } catch (error) {
      console.error('Error setting audio parameters:', error);
    }
  };

  // Initialize Agora RTC with optimal settings
  const initializeAgora = async () => {
    try {
      // Create client with optimal configuration for conversational AI
      agoraClient.current = AgoraRTC.createClient({ 
        mode: "rtc", 
        codec: "vp8"
      });

      // Try to load AI audio enhancement extensions
      try {
        await AgoraRTC.loadExtension("agora-extension-ai-denoiser");
        console.log('AI denoiser extension loaded');
      } catch (error) {
        console.warn('AI denoiser extension not available:', error.message);
      }

      // Set audio scenario for conversational AI (if supported)
      try {
        agoraClient.current.setAudioScenario('ai-voice-chat');
      } catch (error) {
        console.warn('AI voice chat scenario not supported, using default');
      }
      
      // Create local audio track with enhanced settings for conversational AI
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
        // Enhanced noise suppression and echo cancellation
        AEC: true,
        ANS: true,
        AGC: false, // Disable AGC for better voice quality
        
        // Audio quality settings
        encoderConfig: {
          sampleRate: 48000,
          stereo: false,
          bitrate: 128,
        },
        
        // Enable noise suppression extension if available
        extensionId: "agora-extension-ai-denoiser",
        extensionConfig: {
          nsLevel: 2, // Moderate noise suppression
          nsng: true, // Enable next-generation noise suppression
        }
      });

      // Apply optimal audio parameters after initialization
      setOptimalAudioParameters(audioRouting);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Agora:', error);
      if (error.code === 'PERMISSION_DENIED') {
        setStatus('Microphone permission was denied. Please allow access to continue.');
      } else if (error.message.includes('extension')) {
        console.warn('Audio extension not available, continuing with basic setup');
        // Fallback to basic audio track
        try {
          localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
            AEC: true,
            ANS: true,
            AGC: false,
            encoderConfig: {
              sampleRate: 48000,
              stereo: false,
              bitrate: 128,
            }
          });
          setOptimalAudioParameters(audioRouting);
          return true;
        } catch (fallbackError) {
          setStatus(`Failed to initialize audio: ${fallbackError.message}`);
          return false;
        }
      } else {
        setStatus(`Failed to initialize Agora SDK: ${error.message}`);
        return false;
      }
    }
  };

  // Start AI Agent
  const startAgent = async () => {
    if (!config.appId || !config.customerId || !config.customerSecret || !config.openaiApiKey) {
      setStatus('Please fill in all required configuration fields');
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    setStatus('Requesting microphone permission...');

    // Request microphone permission and initialize Agora *before* making network calls.
    // This ensures the permission prompt is triggered by a direct user action.
    const agoraInitialized = await initializeAgora();
    if (!agoraInitialized) {
      setIsLoading(false);
      return;
    }

    try {
      setStatus('Starting AI agent...');
      const response = await fetch('http://localhost:3001/api/start-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appId: config.appId,
          customerId: config.customerId,
          customerSecret: config.customerSecret,
          config: {
            channelName: config.channelName,
            rtcToken: config.rtcToken,
            openaiApiKey: config.openaiApiKey,
            systemMessage: config.systemMessage,
            greetingMessage: config.greetingMessage,
            voiceName: config.voiceName
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      setAgentId(data.agent_id);
      updateConfig('rtcToken', data.rtcToken); // Use token from backend
      setStatus('Agent started successfully! Joining channel...');
      
      // Join the Agora channel now that the agent is ready and permissions are granted.
      await joinChannel(config.rtcToken || null);
      setIsConnected(true);
      setStatus('Connected! You can now talk to the AI agent.');
      addMessage('system', 'AI Agent joined the conversation. Say hello!');

    } catch (error) {
      console.error('Error starting agent:', error);
      setStatus(`Failed to start agent: ${error.message}`);
      
      // If it's a network error, show more helpful message
      if (error.message.includes('Failed to fetch')) {
        setStatus('Connection error: Make sure the backend server is running on port 3001');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Join Agora channel
  const joinChannel = async (token) => {
    try {
      if (!agoraClient.current) return;

      await agoraClient.current.join(
        config.appId,
        config.channelName,
        token,
        null
      );

      // Publish local audio track
      await agoraClient.current.publish([localAudioTrack.current]);

      // Re-apply audio parameters after joining
      setTimeout(() => {
        setOptimalAudioParameters(audioRouting);
      }, 1000);

    } catch (error) {
      console.error('Error joining channel:', error);
      setStatus(`Failed to join channel: ${error.message}`);
    }
  };

  const cleanupConnection = async () => {
    if (agoraClient.current) {
      await agoraClient.current.leave();
    }
    if (localAudioTrack.current) {
      localAudioTrack.current.close();
      localAudioTrack.current = null;
    }
    agoraClient.current = null;
    setIsConnected(false);
    setAgentId(null);
    setStatus('Disconnected');
  };

  // Stop AI Agent
  const stopAgent = async () => {
    if (!agentId) return;

    setIsLoading(true);
    setStatus('Stopping AI agent...');

    let agentStopError = null;
    try {
      // Call our backend server instead of Agora API directly
      const response = await fetch('http://localhost:3001/api/stop-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          appId: config.appId,
          customerId: config.customerId,
          customerSecret: config.customerSecret,
          agentId: agentId
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // If the agent is already gone, it's not a critical failure.
        if (response.status === 404 && data.reason === 'TaskNotFound') {
          console.log('Agent already stopped on Agora side, proceeding with cleanup.');
        } else {
          agentStopError = new Error(data.error || data.detail || `HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      agentStopError = error;
    }

    try {
      await cleanupConnection();
      addMessage('system', 'AI Agent left the conversation');
      if (agentStopError) {
        throw agentStopError; // re-throw after cleanup
      }
    } catch (error) {
      console.error('Error stopping agent:', error);
      setStatus(`Failed to stop agent: ${error.message}`);
      
      if (error.message.includes('Failed to fetch')) {
        setStatus('Connection error: Make sure the backend server is running on port 3001');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle mute
  const toggleMute = async () => {
    if (localAudioTrack.current) {
      const newMutedState = !isMuted;
      await localAudioTrack.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  // Add message to chat
  const addMessage = (type, content) => {
    setMessages(prev => [...prev, {
      id: `${Date.now()}-${messageIdCounter.current++}`,
      type,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // Update config
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-200 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-4 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-tr from-green-500 to-blue-500 rounded-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Conversational AI
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-400 hidden md:block">
              Audio: {audioRouting}
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <Settings className={`h-5 w-5 transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800/50 border-b border-white/10 p-6 transition-all duration-500">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-300">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <input type="text" placeholder="App ID *" value={config.appId} onChange={(e) => updateConfig('appId', e.target.value)} className="p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500" />
              <input type="text" placeholder="Customer ID *" value={config.customerId} onChange={(e) => updateConfig('customerId', e.target.value)} className="p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500" />
              <input type="password" placeholder="Customer Secret *" value={config.customerSecret} onChange={(e) => updateConfig('customerSecret', e.target.value)} className="p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500" />
              <input type="text" placeholder="Channel Name" value={config.channelName} onChange={(e) => updateConfig('channelName', e.target.value)} className="p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500" />
              <input type="text" placeholder="RTC Token (optional)" value={config.rtcToken} onChange={(e) => updateConfig('rtcToken', e.target.value)} className="p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500" />
              <input type="password" placeholder="OpenAI API Key *" value={config.openaiApiKey} onChange={(e) => updateConfig('openaiApiKey', e.target.value)} className="p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500" />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea placeholder="System Message" value={config.systemMessage} onChange={(e) => updateConfig('systemMessage', e.target.value)} className="p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none h-24 resize-none transition-all placeholder-gray-500" />
              <div className="space-y-4">
                <input type="text" placeholder="Greeting Message" value={config.greetingMessage} onChange={(e) => updateConfig('greetingMessage', e.target.value)} className="w-full p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all placeholder-gray-500" />
                <select value={config.voiceName} onChange={(e) => updateConfig('voiceName', e.target.value)} className="w-full p-3 bg-gray-900/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all appearance-none" >
                  <option className="bg-gray-800" value="alloy">Alloy</option>
                  <option className="bg-gray-800" value="echo">Echo</option>
                  <option className="bg-gray-800" value="fable">Fable</option>
                  <option className="bg-gray-800" value="onyx">Onyx</option>
                  <option className="bg-gray-800" value="nova">Nova</option>
                  <option className="bg-gray-800" value="shimmer">Shimmer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div id="chat-container" className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20 flex flex-col items-center animate-fade-in">
                  <div className="p-4 bg-white/5 rounded-full mb-6">
                    <MessageSquare className="h-16 w-16 text-green-400 opacity-70" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-300">Welcome to Steve AI</h3>
                  <p className="text-md mt-2">Configure your settings and start a conversation.</p>
                  <p className="text-sm mt-2 text-green-400">✨ Enhanced with AI Audio Optimization</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex items-end gap-3 animate-fade-in-up ${ message.type === 'user' ? 'justify-end' : 'justify-start' }`} >
                    {message.type === 'agent' && ( <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0"></div> )}
                    <div className={`max-w-lg px-5 py-3 rounded-2xl shadow-md ${ message.type === 'user' ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-br-none' : message.type === 'agent' ? 'bg-gray-700/80 text-gray-200 rounded-bl-none' : 'w-full bg-transparent text-center text-gray-500 text-xs' }`} >
                      <p className="text-base leading-relaxed">{message.content}</p>
                      {message.type !== 'system' && ( <p className="text-xs opacity-60 mt-2 text-right">{message.timestamp}</p> )}
                    </div>
                    {message.type === 'user' && ( <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-teal-500 flex-shrink-0"></div> )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-black/20 border-t border-white/10 p-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-500'} transition-colors duration-500 ${isConnected && 'animate-pulse'}`} />
                <span className="text-sm text-gray-400">
                  {status || (isConnected ? 'Connected - Enhanced Audio Active' : 'Disconnected')}
                </span>
              </div>
              {agentId && ( <span className="text-xs text-gray-600 font-mono">Agent ID: {agentId}</span> )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-black/30 p-6">
            <div className="max-w-4xl mx-auto flex justify-center items-center space-x-6">
              {!isConnected ? (
                <button onClick={startAgent} disabled={isLoading} className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 rounded-full text-white font-bold text-lg shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500/50" >
                  {isLoading ? ( <Loader2 className="h-6 w-6 animate-spin" /> ) : ( <PhoneCall className="h-6 w-6" /> )}
                  <span>{isLoading ? 'Connecting...' : 'Start Conversation'}</span>
                </button>
              ) : (
                <>
                  <button onClick={toggleMute} className={`p-5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 ${ isMuted ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 focus:ring-red-500/50' : 'bg-white/20 text-white hover:bg-white/30 focus:ring-white/50' }`} >
                    {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
                  </button>
                  <button onClick={stopAgent} disabled={isLoading} className="flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 rounded-full text-white font-bold text-lg shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-500/50" >
                    {isLoading ? ( <Loader2 className="h-6 w-6 animate-spin" /> ) : ( <PhoneOff className="h-6 w-6" /> )}
                    <span>{isLoading ? 'Ending...' : 'End Conversation'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgoraAIChat;