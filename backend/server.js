// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Start AI Agent endpoint
app.post('/api/start-agent', async (req, res) => {
  try {
    const { appId, customerId, customerSecret, config } = req.body;
    
    if (!appId || !customerId || !customerSecret) {
      return res.status(400).json({ error: 'Missing required credentials' });
    }

    const credentials = Buffer.from(`${customerId}:${customerSecret}`).toString('base64');
    const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/join`;
    
    const requestBody = {
      name: `agent_${Date.now()}`,
      // Enable advanced features for optimal audio experience
      advanced_features: {
        enable_rtm: true
      },
      parameters: {
        data_channel: "rtm",
        enable_metrics: true,
        enable_error_message: true
      },
      properties: {
        channel: config.channelName,
        token: config.rtcToken,
        agent_rtc_uid: "0",
        remote_rtc_uids: ["*"],
        enable_string_uid: false,
        idle_timeout: 300,
        llm: {
          url: "https://api.openai.com/v1/chat/completions",
          api_key: config.openaiApiKey,
          system_messages: [
            {
              role: "system",
              content: config.systemMessage
            }
          ],
          greeting_message: config.greetingMessage,
          failure_message: "Sorry, I encountered an issue. Could you please repeat that?",
          max_history: 10,
          params: {
            model: "gpt-4o-mini",
            temperature: 0.7
          }
        },
        // Optimized turn detection for better conversation flow
        turn_detection: {
          silence_duration_ms: 800, // Reduced for more responsive conversation
          max_silence_duration_ms: 3000,
          min_voice_duration_ms: 300
        },
        // Enhanced ASR settings
        asr: {
          language: "en-US",
          enable_continuous_recognition: true,
          enable_partial_results: true,
          sample_rate: 16000
        },
        // Optimized TTS settings for conversational AI
        tts: {
          vendor: "openai",
          params: {
            api_key: config.openaiApiKey,
            voice: config.voiceName,
            speed: 0.95, // Slightly increased for natural flow
            instructions: "Please use a natural, friendly tone with clear pronunciation and appropriate pauses between sentences.",
            model: "tts-1-hd", // Higher quality model
            response_format: "pcm",
            sample_rate: 24000
          }
        },
        // Audio processing optimizations
        audio: {
          enable_aec: true,
          enable_ans: true,
          enable_agc: false, // Disabled for better voice quality
          sample_rate: 48000,
          channels: 1,
          enable_voice_activity_detection: true,
          vad_sensitivity: "medium"
        }
      }
    };

    console.log('Making request to Agora API...');
    console.log('URL:', url);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      return res.status(500).json({ 
        error: 'Invalid response from Agora API',
        details: responseText
      });
    }

    if (!response.ok) {
      console.error('Agora API error:', data);
      return res.status(response.status).json({ 
        error: data.message || 'Failed to start agent',
        details: data
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Stop AI Agent endpoint
app.post('/api/stop-agent', async (req, res) => {
  try {
    const { appId, customerId, customerSecret, agentId } = req.body;
    
    if (!appId || !customerId || !customerSecret || !agentId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const credentials = Buffer.from(`${customerId}:${customerSecret}`).toString('base64');
    const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/agents/${agentId}/leave`;
    
    console.log('Stopping agent:', agentId);
    console.log('Stop URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const responseText = await response.text();
    console.log('Stop response status:', response.status);
    console.log('Stop response body:', responseText);

    if (!response.ok) {
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        data = { message: responseText };
      }
      return res.status(response.status).json({ 
        error: data.message || 'Failed to stop agent',
        details: data
      });
    }

    // Success response might be empty
    try {
      const data = responseText ? JSON.parse(responseText) : {};
      res.json(data);
    } catch (parseError) {
      res.json({});
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});