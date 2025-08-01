// ---
// title: REST quickstart
// exported_from: https://docs.agora.io/en/conversational-ai/get-started/quickstart
// exported_at: 2025-08-01T12:19:47.677Z
// ---

// # REST quickstart

// This page describes how to call the Conversational AI Engine RESTful APIs to start and stop an AI agent.

// ## Understand the tech​

// Agora’s Conversational AI technology enables real-time voice interactions between users and an AI-driven agent within an Agora channel. The basic process is as follows:

// 1. User joins a Agora channel:  A user joins an Agora channel.
// 2. Start an AI agent: The user sends a request to your business server, which then makes an API call to the Conversational AI engine to start an agent. The agent joins the same channel as the user.
// 3. Real-time interaction: The user communicates with the AI agent through voice, leveraging the specified LLM, a text-to-speech service, and Agora's low-latency SD-RTN™.
// 4. Stop the AI agent: When the user ends the conversation, the business server sends a request to stop the AI agent. The agent then leaves the Agora channel.
// 5. User leaves the Agora channel: The user disconnects from the session.

// #### Conversational AI Engine workflow

// ## Prerequisites​

// Before you begin, make sure that you have:

// - [Enabled Agora conversational AI](https://docs.agora.io/en/conversational-ai/get-started/manage-agora-account#enable-conversational-ai) for your project.
// - The following information from Agora Console:
//   - [App ID](https://docs.agora.io/en/conversational-ai/get-started/manage-agora-account#get-the-app-id): The string identifier for your project used to call the Conversational AI Engine RESTful API.
//   - [Customer ID and Customer secret](https://docs.agora.io/en/conversational-ai/rest-api/restful-authentication#generate-customer-id-and-customer-secret): Used for HTTP authentication when calling the RESTful APIs.
//   - A [temporary token](https://docs.agora.io/en/conversational-ai/get-started/manage-agora-account#generate-temporary-tokens): The token is used by the agent for authentication when joining an Agora channel.
// - Obtained an API key and callback URL from a Large Language Model (LLM) provider such as [OpenAI](https://openai.com/index/openai-api/).
// - Obtained an API key from a text-to-speech (TTS) provider such as [Microsoft Azure](https://azure.microsoft.com/en-us/products/ai-services/ai-speech).
// - Implemented the [voice](https://docs.agora.io/en/voice-calling/get-started/get-started-sdk) or [video](https://docs.agora.io/en/video-calling/get-started/get-started-sdk) calling quickstart.
// > ℹ️ **info**
// > For the best conversational experience, Agora recommends using Conversational AI Engine with specific Agora Video/Voice SDK versions. For details, contact technical support.

// ## Implementation​

// This section introduces the basic RESTful API requests you use to start and stop a Conversational AI agent. In a production environment, implement these requests on your business server.

// ### Start a conversational AI agent​

// Call the `join` endpoint to create an agent instance that joins an Agora channel. Pass in the `channel` name and `token` for agent authentication.

// Sample request:

// Select a language: Node.js" style="background-color: initial; color: initial;">Node.js curl" style="background-color: initial; color: initial;">curl Python" style="background-color: initial; color: initial;">Python

// ```js
// const fetch = require('node-fetch');

// const url = "https://api.agora.io/api/conversational-ai-agent/v2/projects/:appid/join";

// const headers = {
//   "Authorization": "Basic <your_base64_encoded_credentials>",
//   "Content-Type": "application/json"
// };

// const data = {
//   "name": "unique_name",
//   "properties": {
//     "channel": "<your_channel_name>",
//     "token": "<your_rtc_token>",
//     "agent_rtc_uid": "0",
//     "remote_rtc_uids": ["*"],
//     "enable_string_uid": false,
//     "idle_timeout": 120,
//     "llm": {
//       "url": "https://api.openai.com/v1/chat/completions",
//       "api_key": "<your_llm_api_key>",
//       "system_messages": [
//         {
//           "role": "system",
//           "content": "You are a helpful chatbot."
//         }
//       ],
//       "greeting_message": "Hello, how can I help you?",
//       "failure_message": "Sorry, I don't know how to answer this question.",
//       "max_history": 10,
//       "params": {
//         "model": "gpt-4o-mini"
//       }
//     },
//     "asr": {
//       "language": "en-US"
//     },
//     "tts": {
//       "vendor": "microsoft",
//       "params": {
//           "key": "<your_tts_api_key>",
//           "region": "eastus",
//           "voice_name": "en-US-AndrewMultilingualNeural"
//       }
//     }
//   }
// };

// fetch(url, {
//   method: "POST",
//   headers: headers,
//   body: JSON.stringify(data)
// })
//   .then(response => response.json())
//   .then(json => console.log(json))
//   .catch(error => console.error("Error:", error));
// ```

// For complete information on all request parameters, see [Start a conversational AI agent](https://docs.agora.io/en/conversational-ai/rest-api/join).

// If the request is successful, you receive the following response:
// ```
// // 200 OK
// {
//   "agent_id": "1NT29X10YHxxxxxWJOXLYHNYB",
//   "create_ts": 1737111452,
//   "status": "RUNNING"
// }
// ```

// Store the `agent_id` for use in subsequent API calls to [query](https://docs.agora.io/en/conversational-ai/rest-api/query), [update](https://docs.agora.io/en/conversational-ai/rest-api/update), and [stop](https://docs.agora.io/en/conversational-ai/rest-api/leave) the AI agent.

// ### Stop the conversational AI agent​

// To end the conversation with the AI agent, call the `leave` endpoint. This causes the agent to leave the Agora channel.

// Sample request:

// Select a language: Node.js" style="background-color: initial; color: initial;">Node.js curl" style="background-color: initial; color: initial;">curl Python" style="background-color: initial; color: initial;">Python

// ```js
// const url = 'https://api.agora.io/api/conversational-ai-agent/v2/projects/:appid/agents/:agentId/leave';

// const options = {
//   method: 'POST',
//   headers: {
//     'Authorization': 'Basic <your_base64_encoded_credentials>',
//     'Content-Type': 'application/json'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));
// ```

// If the request is successful, the server responds with a `200 OK` status and an empty JSON object.
// ```
// // 200 OK
// {}
// ```

// > ℹ️ **info**
// > The number of Peak Concurrent Users (PCU) allowed to call the server API under a single App ID is limited to 20. If you need to increase this limit, please contact technical support.

// ## Reference​

// This section contains content that completes the information on this page, or points you to documentation that explains other aspects to this product.

// ### API reference​

// - [Start a conversational AI agent](https://docs.agora.io/en/conversational-ai/rest-api/join)
// - [Stop a conversational AI agent](https://docs.agora.io/en/conversational-ai/rest-api/leave)
// - [Update agent configuration](https://docs.agora.io/en/conversational-ai/rest-api/update)
// - [Query agent status](https://docs.agora.io/en/conversational-ai/rest-api/query)
// - [Retrieve a list of agents](https://docs.agora.io/en/conversational-ai/rest-api/list)
// Agora Conversational AI Documentation
// Conversational AI Product overview
// Conversational AI Engine
// Agora's Conversational AI Engine empowers you to build cutting-edge, voice-enabled applications by merging Agora's robust real-time audio streaming with the conversational intelligence of leading LLMs. Effortlessly create engaging experiences, such as AI-driven smart assistants, intelligent customer service agents, smart hardware, interactive dialogue systems, or collaborative voice-driven tools. This seamless integration ensures dynamic, responsive interactions, boosting user engagement across diverse use cases spanning customer support, education, entertainment, and more.
// Start building with
// REST quickstart
// Learn how to call the Conversational AI Engine RESTful APIs to start and stop an AI agent
// API reference
// Product Features
// Ultra-low latency
// The entire pipeline is deeply optimized, reducing AI response latency to as low as 650 ms, ensuring smooth and natural conversations.
// Customizable agent properties
// Configure agent settings, such as, idle timeouts, input/output modalities, and audio scenarios to tailor the agent functionality to your specific use case.
// Use custom LLMs
// Boost engagement using custom language models, with personalized prompts, adaptive responses, and memory capabilities.
// Integrate advanced audio features
// Enhance user experience with features like voice activity detection (VAD) and background noise reduction. Voice interruption allows users to interrupt AI at any time and respond quickly, improving conversation efficiency and fluency.
// Resilient to weak networks
// Maintains stable and smooth conversations even with up to 80% packet loss. If the network disconnects for 3–5 seconds, questions and answers can still be processed seamlessly.
// Multi-platform support
// Compatible with iOS, Android, Web, and various embedded hardware platforms, providing a seamless and consistent cross-platform experience.
// Conversational AI Pricing
// This page introduces the billing policy for the use of Agora Conversational AI Engine.

// When you use Conversational AI Engine in your project, Agora charges a fee in your monthly bill. See Billing for details. At the end of each month, Agora calculates the total usage of Conversational AI Engine across all projects under your developer account, subtracts the free quota, and multiplies the remaining usage by the corresponding unit price to calculate the total cost. The final amount is rounded to two decimal places.

// Creating a Conversational AI Engine instance using the RESTful API and joining a channel incurs an audio task fee at the following rate:

// Usage Type
// Pricing (USD / minute)
// Free Minutes
// Conversational AI Engine Audio Basic Task
// 0.0099*
// First 300 minutes are free
// ARES ASR Task
// 0.0166
// First 300 minutes are free
// *Applicable when you bring your own key (BYOK) for the ASR vendor or the multimodal large language model (MLLM). The unit price includes the audio RTC subscription fee of the engine instance.






// SKU Update

// Starting with v1.6 the original "Conversational AI Engine Audio Task" is now itemized as two separate services: Audio Basic Task and ARES ASR Task.

// Your total cost for using ARES ASR remains the same: $0.0099 (Basic) + $0.0166 (ARES ASR) = $0.0265 per minute.

// This new billing structure applies to all usage from v1.6 onwards and will be reflected in your upcoming invoices.

// The following examples demonstrate how billing is calculated for different Conversational AI Engine configurations.

// User A joins a channel and starts a voice conversation with an instance created by Conversational AI Engine. The interaction lasts for 10 minutes. User A and the Conversational AI Engine instance exit the channel at the same time. Agora calculates the cost for this session as follows:

// Usage Type
// Duration (minutes)
// Unit Price
// Service Cost (USD)
// Total Cost (USD)
// User A: Audio RTC
// 10
// 0.00099
// 0.0099
// 0.2749
// Conversational AI Engine Audio Basic Task
// 10
// 0.0099
// 0.099


// ARES ASR Task
// 10
// 0.0166
// 0.166




// User B joins a channel and starts a voice conversation with an instance created by Conversational AI Engine configured to use their own key for the ASR provider or the multimodal large language model (MLLM). The interaction lasts for 10 minutes. User B and the Conversational AI Engine instance exit the channel at the same time. Agora calculates the cost for this session as follows:

// Usage Type
// Duration (minutes)
// Unit Price
// Service Cost (USD)
// Total Cost (USD)
// User B: Audio RTC
// 10
// 0.00099
// 0.0099
// 0.1089
// Conversational AI Engine Audio Basic Task
// 10
// 0.0099
// 0.099




// On this page
// Was this helpful?
// YesNo
// Conversational AI Release notes
// This document tracks important changes and improvements to the Conversational AI Engine.

// Released on July 31, 2025.

// AI avatars

// Create visual avatar representations for your conversational agents using third-party avatar providers. AI avatars provide a visual presence during voice interactions, making conversations feel more natural and engaging. Enable AI avatars by setting avatar.enable to true and configuring the avatar.vendor and avatar.params fields when calling Start a conversational AI agent to create your agent.

// info

// AI avatars require video streaming and incur additional charges. See video calling pricing for details.

// Selective attention locking (Beta)

// This version introduces the selective attention locking feature, which uses voiceprint recognition technology to identify and filter out the speaker while suppressing background noise. This enhances the efficiency of conversational AI, particularly improving speech recognition accuracy. To experience this feature, contact technical support.

// Send picture messages (Beta)

// The toolkit now includes an API for sending picture messages. You can send image URLs to the main model, which automatically references the image in future interactions to generate more relevant responses. A new callback is available to receive image message receipt details after successful transmission.

// info

// The picture messaging feature is currently in Beta and free for a limited time.
// Image processing depends on the capabilities of the integrated LLM. Ensure the LLM you connect to the Conversational AI Engine supports image input.

// This release introduces the following modifications to the RESTful API.

// Start a conversational AI agent

// New parameters added:
// avatar.enable
// avatar.vendor
// avatar.params

// Android:

// chat
// ImageMessage
// onMessageReceiptUpdated
// MessageReceipt

// iOS:

// chat
// ChatMessage
// ChatMessageType
// ImageMessage
// onMessageReceiptUpdated
// MessageReceipt

// Web:

// chat
// TMessageReceipt
// EChatMessagePriority
// EChatMessageType
// IChatMessageBase
// IChatMessageImage

// Released on July 15, 2025.

// Support for OpenAI realtime API

// Integrate Multimodal Large Language Models (MLLMs) with Conversational AI Engine to enable end-to-end real-time audio and text interactions. See OpenAI Realtime API for integration details.

// Support for more TTS vendors

// Conversational AI Engine now supports the following additional TTS vendors:

// Cartesia
// OpenAI

// Custom ASR provider support

// To improve flexibility in configuring conversational agents, this release allows you to select a custom automatic speech recognition (ASR) provider. The Start a conversational AI agent API now includes the following new parameters:

// asr.vendor: Specify the ASR provider
// asr.params: Configure ASR parameters

// The following ASR providers are supported:

// ARES (default)
// Microsoft Azure
// Deepgram

// Billing update:
// In earlier versions, the service fee included the cost of the Ares ASR provider. Starting in v1.6, the pricing is restructured as follows:

// If you use ARES ASR, the total price remains unchanged:
// Total cost = Conversational AI Engine Audio Basic Task + ARES ASR Task
// If you use a different ASR provider, you are charged only the new Conversational AI Engine Audio Basic Task fee.

// For further details, see Pricing.

// Multi-platform toolkit

// Agora now offers a toolkit to help you quickly build conversational agent apps. The toolkit is available for iOS, Android, and Web, and includes APIs for common scenarios. Call these APIs to combine the capabilities of the Agora Voice SDK and Signaling SDK to achieve the following functions:

// Display live subtitles Display real-time text output of user–agent conversations. The subtitle component is now more robust, with better error handling, session management, and extensibility.

// Interrupt the agent Stop the agent from speaking or thinking mid-conversation.

// Receive event notifications Track changes in conversation state, performance metrics, and error events.

// Optimize audio settings Quickly apply best-practice audio configurations to improve agent responsiveness and clarity.

// This release introduces several important modifications to the RESTful API.

// Start a conversational AI agent

// New parameters added:
// asr.vendor
// asr.params
// advanced_features.enable_mllm
// properties.mllm
// turn_detection.type
// turn_detection.interrupt_duration_ms
// turn_detection.prefix_padding_ms
// turn_detection.silence_duration_ms
// turn_detection.threshold
// turn_detection.create_response
// turn_detection.interrupt_response
// turn_detection.eagerness
// parameters.enable_metrics
// parameters.data_channel
// parameters.enable_error_message

// Android SDK

// iOS SDK

// Web SDK

// Released on Jun 9, 2025.

// Voice interruption mode

// This release adds the turn_detection.interrupt_mode parameter to the Start a conversational AI agent API, allowing you to control how the agent handles human voice interruptions. The following modes are supported:

// interrupt: (Default) The human voice immediately interrupts the agent. The agent terminates the current interaction and processes the new human voice input.

// append: The human voice does not interrupt the agent. The agent processes the newly received human voice request after the current interaction ends.

// ignore: The agent ignores human voice requests received during speaking or thinking. These requests are discarded and not stored in the context.

// TTS filtering

// This release adds the tts.skip_patterns parameter to the Start a conversational AI agent API. This parameter controls whether the TTS module skips bracketed content when reading LLM response text. This prevents the agent from vocalizing structural prompt information like tone indicators, action descriptions, and system prompts, creating a more natural and immersive listening experience.

// This release introduces several important modifications to the RESTful API.

// Start a conversational AI agent
// New parameters added:
// turn_detection.interrupt_mode
// parameters.silence_config
// tts.skip_patterns

// Released on May 29, 2025.

// Metadata support for LLM requests

// This release adds the llm.vendor parameter to the Start a conversational AI agent API. When set to "custom", the agent includes additional metadata when calling the LLM, such as turn_id and timestamp.

// Support for Anthropic

// Conversational AI Engine now supports anthropic as a request style for chat completion. Refer to the llm.style parameter in Start a conversational AI agent.

// This release includes the following enhancements:

// Advanced LLM configuration: The Update agent configuration API now supports:
// llm.system_messages for updating system prompts
// llm.params for modifying configuration parameters used when calling the large language model

// This release introduces several important modifications to the RESTful API.

// Start a conversational AI agent
// New parameters added:
// turn_detection.interrupt_mode
// parameters.silence_config
// tts.skip_patterns

// Released on May 29, 2025.

// Metadata support for LLM requests

// This release adds the llm.vendor parameter to the Start a conversational AI agent API. When set to "custom", the agent includes additional metadata when calling the LLM, such as turn_id and timestamp.

// Support for Anthropic

// Conversational AI Engine now supports anthropic as a request style for chat completion. Refer to the llm.style parameter in Start a conversational AI agent.

// This release includes the following enhancements:

// Advanced LLM configuration: The Update agent configuration API now supports:
// llm.system_messages for updating system prompts
// llm.params for modifying configuration parameters used when calling the large language model

// This release introduces several important modifications to the RESTful API.

// Start a conversational AI agent

// New parameters added:
// llm.vendor
// llm.style

// Update agent configuration

// New parameters added:
// llm.system_messages
// llm.params

// Released on May 16, 2025.

// Custom LLM

// Integrate your own Large Language Models (LLMs) with the Conversational AI Engine to leverage personalized prompts, adaptive responses, and memory capabilities. See Use custom LLMs for details.

// Audio output mode

// This release adds the audio.output_mode parameter to the Start a conversational AI agent API, allowing you to specify the audio output mode for the agent. The following modes are supported:

// default: (Default) The agent generates audio and sends it to the channel.
// callback: The agent generates audio and sends it to your callback server. This mode is useful when you want to process the audio before sending it to the channel.

// Short-term memory

// This release adds the memory.enable parameter to the Start a conversational AI agent API, allowing you to enable or disable short-term memory for the agent. When enabled, the agent remembers the last few turns of the conversation, allowing for more natural and coherent interactions. See Integrate short-term memory for details.

// Transmit custom information

// This release adds the custom_information.enable parameter to the Start a conversational AI agent API, allowing you to transmit custom information to the agent. This information can be used to provide context to the agent, such as user preferences or historical data. See Transmit custom information for details.

// This release introduces several important modifications to the RESTful API.

// Start a conversational AI agent
// New parameters added:
// llm.vendor
// llm.style
// audio.output_mode
// memory.enable
// custom_information.enable

// Released on April 28, 2025.

// Display live subtitles

// This release adds the subtitles.enable parameter to the Start a conversational AI agent API, allowing you to display live subtitles for the agent's speech. This feature is useful for accessibility and for providing a visual representation of the conversation. See Display live subtitles for details.

// This release introduces several important modifications to the RESTful API.

// Start a conversational AI agent
// New parameters added:
// subtitles.enable

// Released on April 15, 2025.

// Initial release of Conversational AI Engine

// The Conversational AI Engine is a new product that allows you to build voice-enabled applications with conversational AI capabilities. The initial release includes the following features:

// Real-time audio streaming: Integrates with Agora's real-time audio streaming to provide low-latency, high-quality audio.
// LLM integration: Connects with leading LLMs to provide conversational intelligence.
// RESTful API: Provides a RESTful API for managing conversational AI agents.

// This release introduces the following RESTful API.

// Start a conversational AI agent
// Stop a conversational AI agent
// Query a conversational AI agent
// Update a conversational AI agent
// Conversational AI REST quickstart
// This page describes how to call the Conversational AI Engine RESTful APIs to start and stop an AI agent.

// Agora’s Conversational AI technology enables real-time voice interactions between users and an AI-driven agent within an Agora channel. The basic process is as follows:

// User joins a Agora channel: A user joins an Agora channel.
// Start an AI agent: The user sends a request to your business server, which then makes an API call to the Conversational AI engine to start an agent. The agent joins the same channel as the user.
// Real-time interaction: The user communicates with the AI agent through voice, leveraging the specified LLM, a text-to-speech service, and Agora's low-latency SD-RTN™.
// Stop the AI agent: When the user ends the conversation, the business server sends a request to stop the AI agent. The agent then leaves the Agora channel.
// User leaves the Agora channel: The user disconnects from the session.

// Conversational AI Engine workflow

// Before you begin, make sure that you have:

// Enabled Agora conversational AI for your project.

// The following information from Agora Console:

// App ID: The string identifier for your project used to call the Conversational AI Engine RESTful API.
// Customer ID and Customer secret: Used for HTTP authentication when calling the RESTful APIs.
// A temporary token: The token is used by the agent for authentication when joining an Agora channel.

// Obtained an API key and callback URL from a Large Language Model (LLM) provider such as OpenAI.

// Obtained an API key from a text-to-speech (TTS) provider such as Microsoft Azure.

// Implemented the voice or video calling quickstart.

// info

// For the best conversational experience, Agora recommends using Conversational AI Engine with specific Agora Video/Voice SDK versions. For details, contact technical support.

// This section introduces the basic RESTful API requests you use to start and stop a Conversational AI agent. In a production environment, implement these requests on your business server.

// Call the join endpoint to create an agent instance that joins an Agora channel. Pass in the channel name and token for agent authentication.

// Sample request:

// Select a language:

// const fetch = require(\'node-fetch\');const url = \

// https://api.agora.io/api/conversational-ai-agent/v2/projects/:appid/join";const headers = {  "Authorization": "Basic <your_base64_encoded_credentials>",  "Content-Type": "application/json"};const data = {  "name": "unique_name",  "properties": {    "channel": "<your_channel_name>",    "token": "<your_rtc_token>",    "agent_rtc_uid": "0",    "remote_rtc_uids": ["*"],    "enable_string_uid": false,    "idle_timeout": 120,    "llm": {      "url": "https://api.openai.com/v1/chat/completions",      "api_key": "<your_llm_api_key>",      "system_messages": [        {          "role": "system",          "content": "You are a helpful chatbot."        }      ],      "greeting_message": "Hello, how can I help you?",      "failure_message": "Sorry, I don\'t know how to answer this question.",      "max_history": 10,      "params": {        "model": "gpt-4o-mini"      }    },    "asr": {      "language": "en-US"    },    "tts": {      "vendor": "microsoft",      "params": {          "key": "<your_tts_api_key>",          "region": "eastus",          "voice_name": "en-US-AndrewMultilingualNeural"      }    }  }};fetch(url, {  method: "POST",  headers: headers,  body: JSON.stringify(data)})  .then(response => response.json())  .then(json => console.log(json))  .catch(error => console.error("Error:", error));

// For complete information on all request parameters, see Start a conversational AI agent.

// If the request is successful, you receive the following response:

// Copy

// Store the agent_id for use in subsequent API calls to query, update, and stop the AI agent.

// To end the conversation with the AI agent, call the leave endpoint. This causes the agent to leave the Agora channel.

// Sample request:

// Select a language:

// const url = \'https://api.agora.io/api/conversational-ai-agent/v2/projects/:appid/agents/:agentId/leave\';const options = {  method: \'POST\',  headers: {    \'Authorization\': \'Basic <your_base64_encoded_credentials>\',    \'Content-Type\': \'application/json\'  }};fetch(url, options)  .then(res => res.json())  .then(json => console.log(json))  .catch(err => console.error(err));

// If the request is successful, the server responds with a 200 OK status and an empty JSON object.

// Copy

// info

// The number of Peak Concurrent Users (PCU) allowed to call the server API under a single App ID is limited to 20. If you need to increase this limit, please contact technical support.

// This section contains content that completes the information on this page, or points you to documentation that explains other aspects to this product.

// Start a conversational AI agent
// Stop a conversational AI agent
// Update agent configuration
// Query agent status
// Retrieve a list of agents

// On this page
// Was this helpful?
// YesNo
// Enable Conversational AI
// This page shows you how to sign up for an Agora account, create a new project, and get the app ID and app certificate to generate a temporary token.

// To join a Conversational AI Engine session, you need an Agora App ID. This section shows you how to set up an Agora account, create an Agora project and get the required information from Agora Console.

// To use Agora products and services, create an Agora account with your email, phone number, or a third-party account.

// Go to the signup page.

// Fill in the required fields.

// Carefully read the Terms of Service, Privacy Policy, and Acceptable Use Policy, and tick the checkbox.

// Click Continue.

// Enter your verification code and click Confirm.

// Follow the on-screen instructions to provide your name, company name, and phone number, set a password, and click Continue.

// Once you sign up successfully, your account is automatically logged in. Follow the on-screen instructions to create your first project and test out real-time communications.

// For later visits, log in to Agora Console with your phone number, email address, or linked third-party account.

// To create an Agora project, do the following:

// In Agora Console, open the Projects page.

// Click Create New.

// Follow the on-screen instructions to enter a project name and use case, and check Secured mode: APP ID + Token (Recommended) as the authentication mechanism.

// Click Submit. You see the new project on the Projects page.

// Agora automatically assigns a unique identifier to each project, called an App ID.

// To copy this App ID, find your project on the Projects page in Agora Console, and click the copy icon in the App ID column.

// Use the following features from your Agora account to implement security and authentication features in your apps.

// When generating an authentication token on your app server, you need an App Certificate, in addition to the App ID.

// To get an App Certificate, do the following:

// On the Projects page, click the pencil icon to edit the project you want to use.

// Click the copy icon under Primary Certificate.

// To ensure communication security, best practice is to use tokens to authenticate the users who log in from your app.

// To generate a temporary RTC token for use in your Video SDK projects:

// On the Projects page, click the pencil icon next to your project.

// On the Security panel, click Generate Temp Token, enter a channel name in the pop-up box and click Generate. Copy the generated RTC token for use in your Conversational AI Engine projects.

// To generate a token for other Agora products:

// In your browser, navigate to the Agora token builder.

// Choose the Agora product your user wants to log in to. Fill in App ID and App Certificate with the details of your project in Agora Console.

// Customize the token for each user. The required fields are visible in the Agora token builder.

// Click Generate Token.

// The token appears in Token Builder.

// Copy the token and use it in your app.

// For more information on managing other aspects of your Agora account, see Agora console overview.

// Before using Conversational AI Engine, enable it for your app ID in Agora Console.

// Note

// The following steps apply to the new version of Agora Console. If you are using the old version, switch to the new version by clicking Switch to the new version at the top of the screen.

// Navigate to the Projects page, locate your project in the My Projects list and click the associated ✏️ icon to configure it.

// Under All features select Conversational AI > Configurations and toggle the switch to Enable Conversational AI.

// After enabling, you can call the Conversational AI Engine RESTful API.

// On this page
// Was this helpful?
// YesNo

// Completions(request: ChatCompletionRequest): try: logger.info(f"Received request: {request.model_dump_json()}") client = AsyncOpenAI(api_key=os.getenv("YOUR_LLM_API_KEY")) response = await client.chat.completions.create( model=request.model, messages=request.messages,  # Directly use request messages tool_choice=( request.tool_choice if request.tools and request.tool_choice else None ), tools=request.tools if request.tools else None, modalities=request.modalities, audio=request.audio, response_format=request.response_format, stream=request.stream, stream_options=request.stream_options, ) if not request.stream: raise HTTPException( status_code=400, detail="chat completions require streaming" ) async def generate(): try: async for chunk in response: logger.debug(f"Received chunk: {chunk}") yield f"data: {json.dumps(chunk.to_dict())}\n\n" yield "data: [DONE]\n\n" except asyncio.CancelledError: logger.info("Request was cancelled") raise return StreamingResponse(generate(), media_type="text/event-stream") except asyncio.CancelledError: logger.info("Request was cancelled") raise HTTPException(status_code=499, detail="Request was cancelled") except Exception as e: traceback_str = "".join(traceback.format_tb(e.traceback)) error_message = f"{str(e)}\n{traceback_str}" logger.error(error_message) raise HTTPException(status_code=500, detail=error_message)

// When calling the POST method to Start a conversational AI agent, use the LLM configuration to point your agent to the custom service:

// Copy

// info

// If accessing your custom LLM service requires identity verification, provide the authentication information in the api_key field.

// To integrate advanced features such as Retrieval-Augmented Generation and generating outputs in multimodal forms, refer to the following sections.

// To improve the accuracy and relevance of the agent's responses, use the Retrieval-Augmented Generation (RAG) feature. This feature allows your custom LLM to retrieve information from a specific knowledge base and use the retrieved results as context for generating responses.

// The following example simulates the process of retrieving and returning content from a knowledge base and creates the /rag/chat/completions endpoint to incorporate RAG retrieval results when generating responses with the LLM.

// async def perform_rag_retrieval(messages: Optional[Dict]) -> str:

// """

// Retrieve relevant content from the knowledge base using the RAG model.

// Args:

//     messages: The original message list.

// Returns:

//     str: The retrieved text content.

// """

// # TODO: Implement the actual RAG retrieval logic.

// # You can choose the first or last message from the message list as the query,

// # then send the query to the RAG model to retrieve relevant content.

// # Return the retrieval result.

// return "This is relevant content retrieved from the knowledge base."def refact_messages(context: str, messages: Optional[Dict] = None) -> Optional[Dict]:

// """

// Modify the message list by adding the retrieved context to the original messages.

// Args:

//     context: The retrieved context.

//     messages: The original message list.

// Returns:

//     List: The modified message list.

// """

// # TODO: Implement the actual message modification logic.

// # This should add the retrieved context to the original message list.

// return messages# Random waiting messages.waiting_messages = [

// "Just a moment, I\'m thinking...",

// "Let me think about that for a second...",

// "Good question, let me find out...",

// ]@app.post("/rag/chat/completions")async def create_rag_chat_completion(request: ChatCom
// Custom LLM
// In Conversational AI Engine interaction scenarios, your use case may require a custom large language model (Custom LLM). This document explains how to integrate a custom LLM into Agora's Conversational AI Engine.

// Agora's Conversational AI Engine interacts with LLM services using the OpenAI API protocol. To integrate a custom LLM, you need to provide an HTTP service compatible with the OpenAI API, capable of handling requests and responses in the OpenAI API format.

// This approach enables you to implement additional custom functionalities, including but not limited to:

// Retrieval-Augmented Generation (RAG): Allows the model to retrieve information from a specific knowledge base.
// Multimodal Capabilities: Enables the model to generate output in both text and audio formats.
// Tool Invocation: Allows the model to call external tools.
// Function Calling: Enables the model to return structured data in the form of function calls.

// Before you begin, ensure that you have:

// Implemented the basic logic for interacting with a Conversational AI agent by following the REST Quickstart.
// Set up access to a custom LLM service.
// Prepared a vector database or retrieval system if using Retrieval-Augmented Generation (RAG).

// Take the following steps to integrate your custom LLM into Agora's Conversational AI Engine.

// To integrate successfully with Agora's Conversational AI Engine, your custom LLM service must provide an interface compatible with the OpenAI Chat Completions API. The key requirements include:

// Endpoint: A request-handling endpoint, such as https://your-custom-llm-service/chat/completions.
// Request format: Must accept request parameters adhering to the OpenAI API protocol.
// Response format: Should return OpenAI API-compatible responses and support the Server-Sent Events (SSE) standard for streaming.

// The following example demonstrates how to implement an OpenAI API-compliant interface:

// class TextContent(BaseModel):    type: str = "text"    text: strclass ImageContent(BaseModel):    type: str = "image"    image_url: HttpUrlclass AudioContent(BaseModel):    type: str = "input_audio"    input_audio: Dict[str, str]class ToolFunction(BaseModel):    name: str    description: Optional[str]    parameters: Optional[Dict]    strict: bool = Falseclass Tool(BaseModel):    type: str = "function"    function: ToolFunctionclass ToolChoice(BaseModel):    type: str = "function"    function: Optional[Dict]class ResponseFormat(BaseModel):    type: str = "json_schema"    json_schema: Optional[Dict[str, str]]class SystemMessage(BaseModel):    role: str = "system"    content: Union[str, List[str]]class UserMessage(BaseModel):    role: str = "user"    content: Union[str, List[Union[TextContent, ImageContent, AudioContent]]]class AssistantMessage(BaseModel):    role: str = "assistant"    content: Union[str, List[TextContent]] = None    audio: Optional[Dict[str, str]] = None    tool_calls: Optional[List[Dict]] = Noneclass ToolMessage(BaseModel):    role: str = "tool"    content: Union[str, List[str]]    tool_call_id: str# Define the complete request formatclass ChatCompletionRequest(BaseModel):    context: Optional[Dict] = None  # Context information    model: Optional[str] = None  # Model name being used    messages: List[Union[SystemMessage, UserMessage, AssistantMessage, ToolMessage]]  # List of messages    response_format: Optional[ResponseFormat] = None  # Response format    modalities: List[str] = ["text"]  # Default modality is text    audio: Optional[Dict[str, str]] = None  # Assistant\'s audio response    tools: Optional[List[Tool]] = None  # List of tools    tool_choice: Optional[Union[str, ToolChoice]] = "auto"  # Tool selection    parallel_tool_calls: bool = True  # Whether to call tools in parallel    stream: bool = True  # Default to streaming response    stream_options: Optional[Dict] = None  # Streaming options@app.post("/chat/completions")async def create_chat_completion(request: ChatCompletionRequest):

// try:

//     logger.info(f"Received request: {request.model_dump_json()}")

//     client = AsyncOpenAI(api_key=os.getenv("YOUR_LLM_API_KEY"))

//     response = await client.chat.completions.create(

//         model=request.model,

//         messages=request.messages,  # Directly use request messages

//         tool_choice=(

//             request.tool_choice if request.tools and request.tool_choice else None

//         ),

//         tools=request.tools if request.tools else None,

//         modalities=request.modalities,

//         audio=request.audio,

//         response_format=request.response_format,

//         stream=request.stream,

//         stream_options=request.stream_options,

//     )

//     if not request.stream:

//         raise HTTPException(

//             status_code=400, detail="chat completions require streaming"

//         )

//     async def generate():

//         try:

//             async for chunk in response:

//                 logger.debug(f"Received chunk: {chunk}")

//                 yield f"data: {json.dumps(chunk.to_dict())}\n\n"

//             yield "data: [DONE]\n\n"

//         except asyncio.CancelledError:

//             logger.info("Request was cancelled")

//             raise

//     return StreamingResponse(generate(), media_type="text/event-stream")

// except asyncio.CancelledError:

//     logger.info("Request was cancelled")

//     raise HTTPException(status_code=499, detail="Request was cancelled")

// except Exception as e:

//     traceback_str = "".join(traceback.format_tb(e.__traceback__))

//     error_message = f"{str(e)}\n{traceback_str}"

//     logger.error(error_message)

//     raise HTTPException(status_code=500, detail=error_message)

// When calling the POST method to Start a conversational AI agent, use the LLM configuration to point your agent to the custom service:

// Copy

// info

// If accessing your custom LLM service requires identity verification, provide the authentication information in the api_key field.

// To integrate advanced features such as Retrieval-Augmented Generation and generating outputs in multimodal forms, refer to the following sections.

// To improve the accuracy and relevance of the agent's responses, use the Retrieval-Augmented Generation (RAG) feature. This feature allows your custom LLM to retrieve information from a specific knowledge base and use the retrieved results as context for generating responses.

// The following example simulates the process of retrieving and returning content from a knowledge base and creates the /rag/chat/completions endpoint to incorporate RAG retrieval results when generating responses with the LLM.

// async def perform_rag_retrieval(messages: Optional[Dict]) -> str:

// """

// Retrieve relevant content from the knowledge base using the RAG model.

// Args:

//     messages: The original message list.

// Returns:

//     str: The retrieved text content.

// """

// # TODO: Implement the actual RAG retrieval logic.

// # You can choose the first or last message from the message list as the query,

// # then send the query to the RAG model to retrieve relevant content.

// # Return the retrieval result.

// return "This is relevant content retrieved from the knowledge base."def refact_messages(context: str, messages: Optional[Dict] = None) -> Optional[Dict]:

// """

// Modify the message list by adding the retrieved context to the original messages.

// Args:

//     context: The retrieved context.

//     messages: The original message list.

// Returns:

//     List: The modified message list.

// """

// # TODO: Implement the actual message modification logic.

// # This should add the retrieved context to the original message list.

// return messages# Random waiting messages.waiting_messages = [

// "Just a moment, I\'m thinking...",

// "Let me think about that for a second...",

// "Good question, let me find out...",

// ]@app.post("/rag/chat/completions")async def create_rag_chat_completion(request: ChatCom
// Display live subtitles
// When interacting with conversational AI in real time, you can enable real-time subtitles to display the conversation content. This page explains how to implement real-time subtitles in your app.

// Agora provides a flexible, scalable, and standardized conversational AI engine toolkit. The toolkit supports iOS, Android, and Web platforms, and encapsulates scenario-based APIs. You can use these APIs to integrate the capabilities of the Agora Signaling SDK and Video SDK to enable the following features:

// Interrupt agents
// Display live subtitles
// Receive event notifications
// Set optimal audio parameters (iOS and Android only)
// Send picture messages

// The toolkit receives subtitle transcription content through the onTranscriptionUpdated callback and supports monitoring the following types of subtitle data:

// Agent captions: Transcribes the agent’s speech. Includes real-time updates and final results.

// User captions: Transcribes the user’s speech. Supports real-time display and status management.

// Transcription status: Reports status updates such as in progress, completed, or interrupted.

// The following diagram outlines the step-by-step process to integrate live subtitle functionality into your application:

// Subtitles rendering workflow

// Before you begin, ensure the following:

// You have implemented the Conversational AI Engine REST quickstart.
// Your app integrates Video SDK v4.5.1 or later and includes the video quickstart implementation.
// You have enabled Signaling in the Agora Console and completed Signaling quickstart for basic messaging.
// You maintain active and authenticated RTC and Signaling instances that persist beyond the component`s lifecycle. The toolkit does not manage the initialization, lifecycle, or authentication of RTC or Signaling.

// This section describes how to receive subtitle content from the subtitle processing module and display it on your app UI.

// Integrate the toolkit

// Copy the convoaiApi folder to your project and import the toolkit before calling the toolkit API. Refer to Folder structure to understand the role of each file.

// Create a toolkit instance

// Create a configuration object with the Video SDK and Signaling engine instances. Set the subtitle rendering mode, then use the configuration to create a toolkit instance.

// // Create configuration objects for the RTC and RTM instances val config = ConversationalAIAPIConfig(     rtcEngine = rtcEngineInstance,     rtmClient = rtmClientInstance,     // Set the transcription subtitle rendering mode. Options:     // - TranscriptionRenderMode.Word: Renders subtitles word by word.     // - TranscriptionRenderMode.Text: Renders the full sentence at once.          renderMode = TranscriptionRenderMode.Word,     enableLog = true ) // Create component instance val api = ConversationalAIAPIImpl(config)

// Subscribe to the channel

// Subtitles are delivered through Signaling channel messages. To receive subtitle data, call subscribeMessage before starting the agent session.

// api.subscribeMessage("channelName") { error ->     if (error != null) {         // Handle error     } }

// Receive subtitles

// Call the addHandler method to register your implementation of the subtitle transcription callback.

// api.addHandler(covEventHandler)

// Implement subtitle UI rendering logic

// Inherit your subtitle UI module from the IConversationSubtitleCallback interface. Implement the onTranscriptionUpdated method to handle the logic for rendering subtitles to the UI.

//  private val covEventHandler = object : IConversationalAIAPIEventHandler { override fun onTranscriptionUpdated(agentUserId: String, transcription: Transcription) {         // Handle subtitle data and update the UI here     }       }

// Add a Conversational AI agent to the channel

// To start a Conversational AI agent, configure the following parameters in your POST request:

// Parameter
// Description
// Required
// advanced_features.enable_rtm: true
// Starts the Signaling service
// Yes
// parameters.data_channel: "rtm"
// Enables Signaling as the data transmission channel
// Yes
// parameters.enable_metrics: true
// Enables agent performance data collection
// Optional
// parameters.enable_error_message: true
// Enables reporting of agent error events
// Optional


// After a successful response, the agent joins the specified Video SDK channel and is ready to interact with the user.

// Unsubscribe from the channel

// After an agent session ends, unsubscribe from channel messages to release subtitle-related resources:

// api.unsubscribeMessage("channelName") { error ->     if (error != null) {         // Handle the error     } }

// Release resources

// At the end of each call, use the destroy method to clean up the cache.

// api.destroy()

// This section contains content that completes the information on this page, or points you to documentation that explains other aspects to this product.

// IConversationalAIAPI.kt: API interface and related data structures and enumerations
// ConversationalAIAPIImpl.kt: ConversationalAI API main implementation logic
// ConversationalAIUtils.kt: Tool functions and event callback management
// subRender/
// v3/: Subtitle module
// TranscriptionController.kt: Subtitle Controller
// MessageParser.kt: Message Parser

// This section provides API reference documentation for the subtitles module.

// On this page
// Was this helpful?
// YesNo
// Transmit custom information
// When interacting with a Conversational AI agent, you can transmit custom context information from the client, such as the user`s speaking status, selected text, personal signature, or score, enabling the agent to generate responses tailored to the user`s needs.

// This document explains how to use the capabilities of the Signaling SDK to include custom information in interactions with the Conversational AI agent.

// Agora Signaling SDK allows users in a channel to set custom temporary status information and notifies other online users in the channel through event notifications.

// If your app integrates both Voice SDK and Signaling services, you can leverage the Signaling features when creating a Conversational AI agent. This allows the agent to retrieve temporary status information from the Signaling channel before invoking the LLM. The information is used as context to guide the agent in generating responses that better align with user needs.

// Before you begin, ensure that you have:

// Implemented the basic logic for interacting with a Conversational AI agent by following the REST Quickstart.
// Integrated the Signaling SDK into your app and implemented basic messaging functionality by following the Signaling SDK Quickstart.

// Take the following steps to transmit custom context information from the client to the LLM.

// To enable Signaling integration, set advanced_features.enable_rtm to truein the POST request when creating a Conversational AI agent. Refer to the following sample request:

// Copy

// Refer to Signaling User status management to set status information for users in the channel.

// Before invoking the LLM, the agent automatically retrieves the active user`s temporary status information and transmits it as context to the model. This temporary status information is stored in the context.presence field.

// The following example illustrates a scenario where UserA selects the text "Pythagorean theorem" in the app and asks the agent, "What does this mean?". The JSON example shows how the agent retrieves a temporary status field named selection from Signaling before calling the LLM. The request structure is as follows:

// Copy

// Adapt the LLM to process the temporary status information in the context.presence field and generate content that better meets user needs. For implementation details, refer to the Custom LLM documentation.

// On this page
// Was this helpful?
// YesNo
// Audio output mode
// In addition to text output, the Agora Conversational AI Engine can deliver responses in audio format, allowing for more natural and immersive user interactions. This page describes how to configure the agent for audio output and modify the interface to support features such as context management, subtitle alignment, and agent broadcasting.

// Before you begin, make sure you have the following:

// A reference implementation of a Conversational AI agent that includes the basic logic for interacting with an AI agent.
// If you plan to implement subtitles for audio output, read the Display live subtitles documentation and complete the required configuration.

// Take the following steps to set up and configure the audio output mode.

// To configure the output mode, set the llm.output_modalities field when you Start a conversational AI agent, as follows:

// ["audio"]: Sets the output to audio-only mode. In this configuration, you don`t need to set up a text-to-speech (TTS) module. The agent directly plays the audio returned by the custom LLM. This page focuses on how to use this audio-only mode.

// ["text", "audio"]: Sets the output to both text and audio modes. In this configuration, two types of audio are returned: one generated by the TTS module and one provided by the custom LLM.

// To use the Agora Conversational AI Engine with the OpenAI Chat Completions API, ensure that your LLM service is compatible with the expected request and response formats. Agora uses an extended API that supports multiple response types, including text, audio, subtitles, and verbatim subtitle timestamps. It also introduces an additional words field for real-time subtitle alignment.

// To adapt your LLM service, refer to Custom LLM for guidance on transforming your API to meet these requirements.

// Compared with text requests, audio requests include two additional optional fields:

// modalities: Specifies the output mode.
// audio: Specifies the output timbre (voice) and format.

// Include these fields in the llm.params object of the Start a conversational AI agent request.

// The following example shows the format of an audio request:

// Copy

// The audio response includes three types of content. You can send each type to the agent independently for processing:

// Audio type
// Description
// Source
// Agent processing
// Audio data data
// Base64-encoded PCM byte stream array
// *   LLM generation with audio processing capabilities




// Custom audio processing service generation | Plays the audio directly | | Transcription content transcript | The complete text content corresponding to the audio | LLM generation | Stores the text in short-term memory (context) | | Verbatim subtitles words | Subtitle content with word-by-word timestamps | Supports LLM generation with verbatim output | Processes into verbatim real-time subtitles |

// The specific data structure of a streaming response is as follows:

// Copy

// The Conversational AI agent summarizes different types of responses in the following format:

// Copy

// The audio object contains the following fields:

// audio

// data string

// Audio data as a Base64-encoded PCM byte stream.

// transcript string

// Subtitle content corresponding to the audio.

// words array

// An array of word-level subtitle objects. The LLM must support word-level output.

// Hide properties

// text string

// The spoken word.

// start_ts number

// Start time in milliseconds relative to the beginning of the PCM audio data.

// end_ts number

// End time in milliseconds relative to the beginning of the PCM audio data.

// duration number

// Duration in milliseconds that the word is played.

// Depending on your application use-case, configure your custom large model to selectively process and return the relevant fields:

// Audio-only output: Only the data field is required.

// Subtitle-only output: Only the transcript field is required. The agent displays the subtitle but does not play it using the TTS module.

// Audio with verbatim subtitles: The data and words fields are required. Each item in the words array must include the text, start_ts, end_ts, and duration fields.

// Conversational AI Engine supports the following advanced features:

// When the response contains the audio.transcript field, the agent automatically stores the subtitle content in its context manager for use in subsequent interactions. If the audio.transcript field is not included, the content is not stored.

// To ensure the agent retains the audio modality output in short-term memory, include the audio.transcript field in the response.

// When you Display live subtitles, the Conversational AI Engine can use the audio.words field to segment the audio. The engine aligns subtitles based on the start_ts, end_ts, and duration fields within audio.words.

// To enable the agent to segment the audio based on subtitle content during playback, make sure that the LLM sends both the audio.data and audio.words fields in the response.

// If the agent you created is not configured with a TTS module but is set to use audio output with output_modalities is set to ["audio"], you can enable it to broadcast custom messages by adapting your LLM as follows:

// If the agent isn`t configured with a TTS module but is set to use audio output (output_modalities is set to ["audio"]), you can enable it to broadcast custom messages by adapting your LLM as follows:

// In the messages list received by the agent and passed to the LLM, the model should handle the last message based on its role:

// assistant: The model treats the message as a directive that doesn`t require reasoning. It converts the message to audio and returns it to the agent. The agent plays the audio directly.

// user: The model treats the message as a prompt that requires reasoning. The agent decides whether to broadcast the message based on whether the model`s response includes audio. This corresponds to a typical user–agent conversation.

// info

// The following agent broadcasts also adopt this protocol:

// When the agent announces a greeting greeting_message, a processing failure prompt failure_message or a silent prompt silence_message.
// When you Broadcast a custom message using the TTS module.

// This section contains content that completes the information on this page, or points you to documentation that explains other aspects to this product.

// Agora provides an open-source Conversational AI sample server project for your reference. Download the project or view the source code for a complete example.

// On this page
// Was this helpful?
// YesNo
// Integrate short-term memory
// Short-term memory enables your conversational agent to maintain context and coherence by storing structured conversation data during a session. This includes not only message content and roles, but also turn tracking, interruption handling, timestamps, and source metadata.

// Built on the OpenAI Chat Completions format with conversational AI extensions, short-term memory integrates seamlessly with large language models while providing flexibility for custom implementations, long-term storage, and dynamic memory updates.

// This guide shows you how to access, use, and implement short-term memory in your applications.

// info

// This guide applies to Conversational AI Engine version 1.4 and above.

// Conversational AI Engine stores short-term memory in JSON format, following the OpenAI Chat Completions structure. The following example shows the data structure:

// Copy

// Each message contains both standard OpenAI fields and enhanced fields that provide additional context for conversational AI scenarios:

// OpenAI standard fields:

// role: Specifies the message sender`s role in the conversation. Only user and assistant (agent) are supported in short-term memory. system messages are not included.

// content: The specific text content. Currently, short-term memory does not consider multimodal input.

// Conversational AI Engine extensions:

// turn_id: Dialogue turn identifier. Starts from 0 and increments with each dialogue turn between the user and agent.

// timestamp: The timestamp of the corresponding message, with millisecond accuracy.

// metadata: Metadata of the message containing the following fields:

// source: Indicates how the message was generated:

// Value
// Description
// user message
// assistant message
// asr
// Speech recognition result
// ✓
// ✗
// message
// Text message
// ✓
// ✗
// command
// Messages generated by RESTful API call
// ✓
// ✓
// llm
// Large Language Model
// ✗
// ✓
// greeting
// Greeting message
// ✗
// ✓
// llm_failure
// LLM call failed
// ✗
// ✓
// silence
// Silent reminder message
// ✗
// ✓


// interrupted: Whether this assistant message was interrupted by human voice:

// true: This message was interrupted.
// false (default): This message was not interrupted. The field is hidden when false.

// interrupt_timestamp: The timestamp when the agent message was interrupted, with millisecond precision. Only exists when interrupted is true.

// original: The complete content actually generated by the LLM. Only exists when interrupted is true.

// Conversational AI Engine provides the following methods to access short-term memory:

// During agent runtime: Call the Retrieve agent history API to retrieve the agent`s complete short-term memory in JSON format. This API returns all short-term memory stored during the agent`s lifecycle.

// After agent stops: Agora sends short-term memory to your business server through the message notification service. For details, see Notification event types.
// Pass memory content to the LLM​
// Depending on the llm.vendor field you specify when creating the agent, Conversational AI Engine uses different strategies to pass memory content to the LLM.

// When llm.vendor is not "custom", the engine only transfers the OpenAI standard fields (role and content) from short-term memory to ensure compatibility.

// Copy

// When llm.vendor is set to "custom", the engine transmits all fields in short-term memory to the LLM. You can implement a wrapper to filter or merge extended fields as needed. For implementation details, see Custom LLM.

// Example use cases:

// Add timestamps: Include message timestamps in the content field
// Add user context: Prepend user information to the content field
// Handle interruptions: Provide the complete original content for interrupted messages

// Combine these enhancements with system_messages to give your LLM deeper conversational awareness, allowing it to maintain user context and gracefully handle interrupted responses.

// Copy

// Short-term memory disappears when the agent stops. To preserve this data:

// Store short-term memory: Save the short-term memory to your server after the agent stops.
// Inject into new sessions: When creating a new agent, use llm.system_messages to inject either the original memory content or a summarized version.

// The following example shows how to inject summarized memory content using the system_messages array:

// Copy

// Starting with version 1.4, you can call the Update agent configuration API to update the agent`s llm.system_messages field while the agent is running. This enables you to update the memory content dynamically.

// On this page
// Was this helpful?
// YesNo
// Interrupt agent
// When interacting with an agent, you may need to interrupt the agent to begin a new round of conversation. The Agora Conversational AI Engine supports agent interruption in the following ways:

// Voice interruption: The engine detects user voice input and automatically stops the agent`s response.
// Manual interruption: Your app can explicitly stop the agent by calling a REST API or client SDK method—typically triggered by a button tap or custom command.

// This page describes how to implement agent interruption in your app.

// Conversational AI Engine supports an intelligent interruption feature that allows a user`s voice input to automatically interrupt the speaking agent. This enables quicker response times and more natural, fluid interactions.

// By default, this feature is disabled. To enable it, set advanced_features.enable_aivad to true when calling Start a conversational AI agent.

// To customize the agent`s behavior when human voice interrupts the agent, configure the following parameters:

// turn_detection.interrupt_mode: Defines how the agent responds when interrupted by human voice:

// interrupt: Immediately stop the current interaction and process the human voice input.
// append: Complete the current interaction, then process the human voice input.
// ignore: Discard the human voice input without processing or storing it in the conversation context.

// turn_detection.interrupt_duration_ms: (Default 160) The minimum duration (in milliseconds) that the user`s voice must exceed the Voice Activity Detection (VAD) threshold before triggering an interruption.

// The following example shows how to do this:

// Copy

// If the request succeeds, the API returns a 200 status code and a response body like the following:

// Copy

// Conversational AI Engine supports actively triggering an interruption by calling RESTful APIs or client component APIs. This allows users to interrupt the agent through a button click or a specific command.

// Use the Interrupt agent API to manually initiate an interruption request.

// Copy

// If the request is successful, the API returns a 200 status code and the following response body:

// Copy

// Agora provides a set of flexible, scalable and standardized client components for its conversational AI engine. These components support iOS, Android, and Web platforms and encapsulate scenario-based APIs. You can use them to integrate Agora Real-Time Communication (RTC) and Real-Time Messaging Signaling capabilities, enabling the following features:

// Interrupt the agent
// Display real-time subtitles
// Receive event notifications
// Optimize audio (Android and iOS only)

// Before you begin, make sure you:

// Integrate Video SDK v4.5.1 or later and follow the Quickstart guide to implement basic real-time audio and video features.
// Enable the Signaling service for your project in the Agora Console and follow the Signaling Quickstart to implement real-time messaging.
// Implement the basic logic to communicate with a Conversational AI agent.
// Ensure that the RTC engine instance is initialized and Signaling is logged in. The toolkit does not handle initialization, lifecycle management, authentication, or login for Video SDK or Signaling.

// Copy the convoaiApi folder to your project and import it before calling API methods. Refer to the component structure to understand the role of each file.

// Create a configuration object for the RTC engine and Signaling client instances, then use it to initialize the component instance.

// // Create a configuration object for the RTC and RTM instancesval config = ConversationalAIAPIConfig(    rtcEngine = rtcEngineInstance,    rtmClient = rtmClientInstance,    enableLog = true)// Create the component instanceval api = ConversationalAIAPIImpl(config)

// Call Start a conversational AI agent using the following parameter settings:

// advanced_features.enable_rtm: true: Start the Signaling service (Required)
// parameters.data_channel: "rtm": Enable the RTM data transmission channel (Required)
// parameters.enable_metrics: true: Receive agent performance data (Enabled on demand)
// parameters.enable_error_message: true: Receive agent error events (Enable on demand)

// After the call is successful, the agent joins the specified RTC channel and the user can start interacting with the agent.

// Call the interrupt method to interrupt the agent.

// api.interrupt("agentId") { error -> /* ... */ }

// When the agent interaction ends, destroy the component instance to release all resources.

// api.destroy()

// Agora provides a sample project for your reference. Download or view the source code for a complete example.

// The structure of the client component folder and the functions of each file are as follows:

// info

// Copy only the following files and folders to integrate the client component. You do not need to copy other files.

// IConversationalAIAPI.kt: API interface and related data structures and enumerations

// ConversationalAIAPIImpl.kt: ConversationalAI API main implementation logic

// ConversationalAIUtils.kt: Tool functions and event callback management subRender/

// v3/: Subtitle module
// TranscriptionController.kt: Subtitle controller
// MessageParser.kt: Message parser

// Start a conversational AI Agent

// Interrupt the Agent

// On this page
// Was this helpful?
// YesNo
// Receive event notifications
// Real-time conversational AI applications require responsive user interfaces that react to agent events. This page demonstrates how to implement event handling to create dynamic, interactive experiences with conversational agents.

// Agora provides a flexible, scalable, and standardized conversational AI engine toolkit. The toolkit supports iOS, Android, and Web platforms, and encapsulates scenario-based APIs. You can use these APIs to integrate the capabilities of the Agora Chat SDK and Video SDK to enable the following features:

// Interrupt agents
// Display live subtitles
// Receive event notifications
// Set optimal audio parameters (iOS and Android only)

// The component provides a set of callback methods that allow you to listen for various agent-related events and system information:

// onAgentStateChanged : Listen for agent state changes through Signaling presence events. Possible states include: silent, listening, thinking, and speaking. Use this callback to update the agent UI or track the conversation flow.

// onAgentInterrupted : Listen for agent interruption events through Signaling messages. Use this to handle scenarios where the agent is interrupted mid-response.

// onAgentMetrics : Listen for agent performance metrics through Signaling messages. Metrics include LLM reasoning delay, TTS synthesis delay, and more. Use this callback to monitor system performance.

// onAgentError : Listen for agent error events through Signaling messages. These may include errors in agent modules such as LLM or TTS. Use this callback for error monitoring, logging, and implementing graceful degradation strategies.

// Before you begin, ensure the following:

// You have implemented the Conversational AI Engine REST quickstart.
// Your app integrates Video SDK v4.5.1 or later and includes the video quickstart implementation.
// You have enabled Signaling in the Agora Console and completed Signaling quickstart for basic messaging.
// You maintain active and authenticated RTC and Signaling instances that persist beyond the component`s lifecycle. The toolkit does not manage the initialization, lifecycle, or authentication of RTC or Signaling.

// This section describes how to implement Conversational AI engine events using the toolkit.

// Integrate the toolkit

// Copy the convoaiApi folder to your project and import the toolkit before calling the toolkit API. Refer to Folder structure to understand the role of each file.

// Create a toolkit instance

// Create a configuration object with the Video SDK and Signaling engine instances. Use the configuration to create a toolkit instance.

// // Create a configuration object for the Video SDK and Chat SDK instances val config = ConversationalAIAPIConfig(     rtcEngine = rtcEngineInstance,     rtmClient = rtmClientInstance,     enableLog = true ) // Create the toolkit instance val api = ConversationalAIAPIImpl(config)

// Register events

// Call the addHandler method to register and implement agent-related event callbacks.

// // Register event callbacks api.addHandler(object : IConversationalAIAPIEventHandler {     // Listen for agent state changes     override fun onAgentStateChanged(agentUserId: String, event: StateChangeEvent) {         when (event.state) {             AgentState.SILENT -> {                 updateAgentStatus("Waiting...")             }             AgentState.LISTENING -> {                 updateAgentStatus("Listening...")             }             AgentState.THINKING -> {                 updateAgentStatus("Thinking...")             }             AgentState.SPEAKING -> {                 updateAgentStatus("Speaking...")             }             AgentState.UNKNOWN -> {                 Log.w("AgentState", "Unknown agent state: $event")             }         }     }     // Listen for agent interruption events     override fun onAgentInterrupted(agentUserId: String, event: InterruptEvent) {         Log.d("AgentInterrupt", "Agent $agentUserId interrupted at turn ${event.turnId}")         showInterruptNotification()     }     // Monitor agent performance metrics     override fun onAgentMetrics(agentUserId: String, metric: Metric) {         when (metric.type) {             ModuleType.LLM -> {                 Log.d("Metrics", "LLM latency: ${metric.value} ms")             }             ModuleType.TTS -> {                 Log.d("Metrics", "TTS latency: ${metric.value} ms")             }             else -> {                 Log.d("Metrics", "${metric.type}: ${metric.name} = ${metric.value}")             }         }     }     // Handle agent errors     override fun onAgentError(agentUserId: String, error: ModuleError) {         Log.e("AgentError", "Error in ${error.type}: ${error.message} (code: ${error.code})")         when (error.type) {             ModuleType.LLM -> {                 showErrorMessage("AI processing failed. Please try again later.")             }             ModuleType.TTS -> {                 showErrorMessage("Speech synthesis failed.")             }             else -> {                 showErrorMessage("System error: ${error.message}")             }         }     }     // Handle debug logs     override fun onDebugLog(log: String) {         if (BuildConfig.DEBUG) {             Log.d("ConvoAI", log)         }         // Optional: Send logs to a remote server for diagnostics     } })

// Subscribe to the channel

// Subtitles are delivered through Signaling channel messages. To receive subtitle data, call subscribeMessage before starting the agent session.

// api.subscribeMessage("channelName") { error ->     if (error != null) {         // Handle error     } }

// Add a Conversational AI agent to the channel

// To start a Conversational AI agent, configure the following parameters in your POST request:

// Parameter
// Description
// Required
// advanced_features.enable_rtm: true
// Starts the Signaling service
// Yes
// parameters.data_channel: "rtm"
// Enables Signaling as the data transmission channel
// Yes
// parameters.enable_metrics: true
// Enables agent performance data collection
// Optional
// parameters.enable_error_message: true
// Enables reporting of agent error events
// Optional


// After a successful response, the agent joins the specified Video SDK channel and is ready to interact with the user.

// Unsubscribe from the channel

// After an agent session ends, unsubscribe from channel messages to release subtitle-related resources:

// api.unsubscribeMessage("channelName") { error ->     if (error != null) {         // Handle the error     } }

// Release resources

// At the end of each call, use the destroy method to clean up the cache.

// api.destroy()

// This section contains content that completes the information on this page, or points you to documentation that explains other aspects to this product.

// Refer to the following open-source sample code for your reference.

// Conversational-AI-Demo

// To integrate the client components, only the files and folders listed below are required. You do not need to copy any other files.

// IConversationalAIAPI.kt: Defines the API interface, data structures, and enumerations.
// ConversationalAIAPIImpl.kt: Contains the main implementation logic of the ConversationalAI API.
// ConversationalAIUtils.kt: Provides utility functions and manages event callbacks.
// v3/: Contains the subtitle rendering module.
// TranscriptionController.kt: Controls subtitle rendering and synchronization.
// MessageParser.kt: Parses transcription and message data.

// On this page
// Was this helpful?
// YesNo
// Notification event types
// After enabling Agora message notifications, the Agora notification server sends channel event notifications to your server through HTTPS POST requests. The data format is JSON, the character encoding is UTF-8, and the signature algorithm can be either HMAC/SHA1 or HMAC/SHA256.

// This page explains the types of events returned in channel event callbacks and their meanings.

// The message notification callback header contains the following fields:

// Header

// Content-Type string

// Application/json

// Agora-Signature string

// The signature value generated by Agora using the customer key and HMAC/SHA1 algorithm. Use the customer key and HMAC/SHA1 algorithm to verify the signature value. See Verify the signature for details.

// Agora-Signature-V2 string

// The signature value generated by Agora using the customer key and HMAC/SHA256 algorithm. Use the customer key and HMAC/SHA256 algorithm to verify the signature value. See Verify the signature for details.
// Request body​
// The message notification callback request body contains the following fields:

// BODY

// noticeId string

// Notification ID. Identifies an event notification from the Agora server.

// productId integer

// Business ID. A value of 17 indicates a Conversational AI Engine notification.

// eventType integer

// The event type of the notification. See Event types for details.

// notifyMs integer

// The Unix timestamp (ms) indicating when the Agora message server sent the event notification to your server. This value is updated when the notification is retried.

// sid string

// The session ID.

// payload object

// The specific content of the notification event. payload varies depending on the event type. For details, see Event types.

// Following is an example of a message notification callback request body:

// Copy

// The Agora message notification service notifies the following Conversational AI Engine events:

// Event Type
// Event name
// Event description
// 101
// agent joined
// The agent joins the channel.
// 102
// agent left
// The agent leaves the channel.
// 103
// agent history
// After an agent stops, its stored history is notified which includes the following information:


// Messages exchanged between the user and the agent
// Timestamps indicating when the agent was created and stopped

// The maximum number of entries is determined by the llm.max_history parameter you can set when starting the agent. The default value is 32. | | 110 | agent error | Agent error. |

// An eventType of 101 indicates that an agent has joined a channel. The payload contains the following fields:

// payload

// agent_id string

// Unique identifier of the agent.

// start_ts integer

// Timestamp indicating when the agent was created.

// channel string

// The name of the channel the agent was in.

// Copy

// An eventType of 102 indicates that an agent has left a channel. The payload contains the following fields:

// payload

// agent_id string

// Unique identifier of the agent.

// start_ts integer

// Timestamp indicating when the agent was created.

// stop_ts integer

// Timestamp indicating when the agent left the channel.

// channel string

// The name of the channel the agent was in.

// status string

// Agent status.

// message string

// The reason why the agent left the channel.

// Following are some examples of the payload when an agent leaves a channel for different reasons.

// {   "agent_id": "1NT29X10YHxxxxxWJOXLYHNYB",   "start_ts": 1737111452,   "stop_ts": 1737111455,   "channel": "xxxxx",   "status": "STOPPED",   "message": "OK"}
// 103 agent history​
// An eventType of 103 notifies the history of a user and agent dialogue. The notification payload contains the following fields:

// payload

// agent_id string

// Unique identifier of the agent.

// channel string

// The name of the channel the agent was in.

// start_ts integer

// The timestamp indicating when the agent started and joined the channel.

// stop_ts integer

// The timestamp indicating when the agent stopped and left the channel.

// contents array

// Agent history.

// Hide properties

// role string

// Possible values: user, assistant

// The message sender.

// user: User
// assistant: AI agent

// content string

// Message content.

// Copy

// An eventType of 110 indicates that an agent has encountered an error. The payload contains the following fields:

// payload

// agent_id string

// Unique identifier of the agent.

// start_ts integer

// Timestamp indicating when the agent was created.

// channel string

// The name of the channel the agent was in.

// turn_id string

// Subtitle conversation turn. For details, see Live Subtitle API Reference.

// errors array

// An array of error messages. Each object contains the following fields:

// Hide properties

// module string

// The module where the error occurred.

// turn_id integer

// Subtitle dialogue turn.

// code integer

// Error code. Refer to the error code document of the vendor corresponding to the error module for detailed information.

// message string

// The error message.

// Copy

// On this page
// Was this helpful?
// YesNo
// Send picture messages
// When interacting with an agent, you may need to upload images or send image messages from the client to help the agent better understand the user`s intent. This page describes how to use the Conversational AI Engine toolkit to send image messages to the large language model from the app. This allows the LLM to automatically reference the image content in subsequent conversations with the agent, allowing it to generate responses that better meet user needs.

// Agora provides a flexible, scalable, and standardized conversational AI engine toolkit. The toolkit supports iOS, Android, and Web platforms, and encapsulates scenario-based APIs. You can use these APIs to integrate the capabilities of the Agora Signaling SDK and Video SDK to enable the following features:

// Interrupt agents
// Display live subtitles
// Receive event notifications
// Set optimal audio parameters (iOS and Android only)
// Send picture messages

// Call the component`s chat API to send a picture message, and listen to the onMessageReceiptUpdated callback to receive the picture message receipt.

// Before you begin, ensure the following:

// You have implemented the Conversational AI Engine REST quickstart.
// Your app integrates Video SDK v4.5.1 or later and includes the video quickstart implementation.
// You have enabled Signaling in the Agora Console and completed Signaling quickstart for basic messaging.
// You maintain active and authenticated RTC and Signaling instances that persist beyond the component`s lifecycle. The toolkit does not manage the initialization, lifecycle, or authentication of RTC or Signaling.

// info

// The picture messaging feature is currently in Beta and free for a limited time.
// Image processing depends on the capabilities of the integrated LLM. Ensure the LLM you connect to the Conversational AI Engine supports image input.

// This section explains how to send a picture message.

// Integrate the toolkit

// Copy the convoaiApi folder to your project and import the toolkit before calling the toolkit API. Refer to Folder structure to understand the role of each file.

// Create a toolkit instance

// Create a configuration object with the Video SDK and Signaling engine instances. Use the configuration to create a toolkit instance.

// // Create configuration objects for the RTC and RTM instances val config = ConversationalAIAPIConfig(     rtcEngine = rtcEngineInstance,     rtmClient = rtmClientInstance,     enableLog = true ) // Create component instance val api = ConversationalAIAPIImpl(config)

// Register callback

// Call the addHandler method to register your implementation of the callback.

// api.addHandler(covEventHandler)

// Subscribe to the channel

// Agent-related events are delivered through Signaling channel messages. To receive these events, call subscribeMessage before starting the agent session.

// api.subscribeMessage("channelName") { error ->     if (error != null) {         // Handle error     } }

// Add a Conversational AI agent to the channel

// To start a Conversational AI agent, configure the following parameters in your POST request:

// Parameter
// Description
// Required
// advanced_features.enable_rtm: true
// Starts the Signaling service
// Yes
// parameters.data_channel: "rtm"
// Enables Signaling as the data transmission channel
// Yes
// parameters.enable_metrics: true
// Enables agent performance data collection
// Optional
// parameters.enable_error_message: true
// Enables reporting of agent error events
// Optional


// After a successful response, the agent joins the specified Video SDK channel and is ready to interact with the user.

// Send an image

// Call the chat method to send a picture message. The following example sends a picture using a URL:

// val uuid = "unique-image-id-123" // Generate a unique image identifier val imageUrl = "https://example.com/image.jpg" // HTTP/HTTPS URL of the image api.chat("agentUserId", ImageMessage(uuid = uuid, imageUrl = imageUrl)) { error ->     if (error != null) {         Log.e("Chat", "Failed to send image: ${error.errorMessage}")     } else {         Log.d("Chat", "Image send request successful")     } }

// info

// The callback of the chat completion interface only indicates whether the sending request is successful, and does not reflect the actual processing status of the message.

// Handle image sending status

// The success of sending a picture message is confirmed by the picture message receipt callback onMessageReceiptUpdated. If sending fails, the agent error callback onAgentError is fired. The uuid value in the callback identifies the uploaded picture.

// Image sent successfully

// When you receive the onMessageReceiptUpdateda callback, follow the steps below to parse the JSON message in the callback and obtain the image`s uuid and status information to confirm that the image was sent successfully:

// override fun onMessageReceiptUpdated(agentUserId: String, receipt: MessageReceipt) {      if (receipt.chatMessageType == ChatMessageType.Image) {          try {              val json = JSONObject(receipt.message)              // Check if the uuid field is included              if (json.has("uuid")) {                  val receivedUuid = json.getString("uuid")                                    // If the uuid matches, the image was sent successfully                  if (receivedUuid == "your-sent-uuid") {                      Log.d("ImageSend", "Image sent successfully: $receivedUuid")                      // Update the UI to show the successful sending status                  }              }          } catch (e: Exception) {              Log.e("ImageSend", "Failed to parse message receipt: ${e.message}")          }      }  }

// Image sending failed

// If you receive the onAgentError callback, follow the steps below to parse the JSON message in the callback to obtain the image`s uuid and status information to confirm that the image sending failed:

// override fun onMessageError(agentUserId: String, error: MessageError) {      if (error.chatMessageType == ChatMessageType.Image) {          try {              val json = JSONObject(error.message)              // Check if it contains the "uuid" field              if (json.has("uuid")) {                  val failedUuid = json.getString("uuid")                  // If the uuid matches, this image failed to send                  if (failedUuid == "your-sent-uuid") {                      Log.e("ImageSend", "Image send failed: $failedUuid")                      // Update the UI to show the failed send status                  }              }          } catch (e: Exception) {              Log.e("ImageSend", "Failed to parse error message: ${e.message}")          }      }  }

// Unsubscribe from the channel

// After an agent session ends, unsubscribe from channel messages to release resources:

// api.unsubscribeMessage("channelName") { error ->     if (error != null) {         // Handle the error     } }

// Release resources

// At the end of each call, use the destroy method to clean up the cache.

// api.destroy()

// This section contains content that completes the information on this page, or points you to documentation that explains other aspects to this product.

// IConversationalAIAPI.kt: API interface and related data structures and enumerations
// ConversationalAIAPIImpl.kt: ConversationalAI API main implementation logic
// ConversationalAIUtils.kt: Tool functions and event callback management
// subRender/
// v3/: Subtitle module
// TranscriptionController.kt: Subtitle controller
// MessageParser.kt: Message parser
// Start a conversational AI agent
// POST

// https://api.agora.io/api/conversational-ai-agent/v2/projects/{appid}/join

// Use this endpoint to create and start a Conversational AI agent instance.

// appid stringrequired

// The App ID of the project.
// Request body​
// APPLICATION/JSON

// BODYrequired

// name stringrequired

// The unique identifier of the agent. The same identifier cannot be used repeatedly.

// properties objectrequired

// Configuration details of the agent.

// Hide properties

// channel stringrequired

// The name of the channel to join.

// token stringrequired

// The authentication token used by the agent to join the channel.

// agent_rtc_uid stringrequired

// The user ID of the agent in the channel. A value of 0 means that a random UID is generated and assigned. Set the token accordingly.

// remote_rtc_uids array[string]required

// A list of user IDs that the agent subscribes to in the channel. Only subscribed users can interact with the agent. Use "*" to subscribe to all users in the channel.

// info

// The "*" selector includes all UIDs present in the channel, which may include other AI agents. If you're running multiple agents in the same channel, review the best practices under the idle_timeout parameter to avoid unintended behavior and unnecessary usage costs.
// When using an AI Avatar, subscribing to all users with "*" is not supported.

// enable_string_uid booleannullable

// Default: false

// Whether to enable String uid:

// true: Both agent and subscriber user IDs use strings.
// false: Both agent and subscriber user IDs must be integers.

// idle_timeout integernullable

// Default: 30

// Sets the timeout after all the users specified in remote_rtc_uids are detected to have left the channel. When the timeout value is exceeded, the agent automatically stops and exits the channel. A value of 0 means that the agent does not exit until it is stopped manually.

// Multi-agent use cases

// If multiple AI agents are active in the same channel and are configured to subscribe to all users using remote_rtc_uids: ["*"], they detect each other's presence. As a result, the idle_timeout condition, when all other users have left, might never be triggered. This can cause agents to run indefinitely and lead to significant unintended usage.

// Agent lifecycle best practice

// For precise and reliable control over the agent's lifecycle, use the leave API to terminate the agent as soon as its task is complete.

// advanced_features objectnullable

// Advanced features configuration.

// Hide properties

// enable_aivad booleannullable

// Default: false

// Whether to enable the intelligent interruption handling function (AIVAD). This feature is currently available only for English.

// enable_mllm booleannullable

// Default: false

// Enable Multimodal Large Language Model. Enabling MLLM automatically disables ASR, LLM, and TTS. When you set this parameter to true, enable_aivad is also disabled.

// enable_rtm booleannullable

// Default: false

// Whether to enable the Signaling (RTM) service. When enabled, the agent can combine the capabilities provided by Signaling to implement advanced functions, such as delivering custom information.

// info

// Before enabling the Signaling service, make sure the token includes both RTC and RTM privileges. When an agent joins an RTM channel, it reuses the token specified in the token field. For more information, see "How can I generate a token with both RTC and Signaling privileges?".

// asr objectnullable

// Automatic Speech Recognition (ASR) configuration.

// Hide properties

// language stringnullable

// Default: en-US

// The BCP-47 language tag identifying the primary language used for agent interaction. If params contains a vendor-specific language code, it takes precedence over this setting.

// vendor stringnullable

// Default: ares

// Possible values: ares, microsoft, deepgram

// ASR provider:

// ares: Adaptive Recognition Engine for Speech
// microsoft: Microsoft Azure
// deepgram: Deepgram

// params objectrequired

// The configuration parameters for the ASR vendor. See ASR Overview for details.

// tts objectrequired

// Text-to-speech (TTS) module configuration.

// Hide properties

// vendor stringrequired

// Possible values: microsoft, elevenlabs, cartesia, openai, humeai

// TTS provider.

// microsoft: Microsoft Azure
// elevenlabs: ElevenLabs
// cartesia : Cartesia
// openai: OpenAI
// humeai: Hume AI

// params objectrequired

// The configuration parameters for the TTS vendor. See TTS Overview for details.

// skip_patterns array[integer]nullable

// Controls whether the TTS module skips bracketed content when reading LLM response text. This prevents the agent from vocalizing structural prompt information like tone indicators, action descriptions, and system prompts, creating a more natural and immersive listening experience. Enable this feature by specifying one or more values:

// 1: Skip content in Chinese parentheses （）
// 2: Skip content in Chinese square brackets 【】
// 3: Skip content in parentheses ( )
// 4: Skip content in square brackets [ ]
// 5: Skip content in curly braces { }

// info

// Nested brackets: When input text contains nested brackets and multiple bracket types are configured to be skipped, the system processes only the outermost brackets. The system matches from the beginning of the text and skips the first outermost bracket pair that meets the skip rule, including all nested content.
// Agent memory: The agent's short-term memory always contains the complete, unfiltered LLM text, regardless of live captioning settings.
// Real-time subtitles: When enabled, subtitles exclude filtered content during TTS playback but restore the complete text after each sentence finishes.

// llm objectrequired

// Large language model (LLM) configuration.

// Hide properties

// url stringrequired

// The LLM callback address.

// api_key stringnullable

// The LLM verification API key. The default value is an empty string. Ensure that you enable the API key in a production environment.

// system_messages array[object]nullable

// A set of predefined information used as initial context for the agent.
// Query agent status
// GET

// https://api.agora.io/api/conversational-ai-agent/v2/projects/{appid}/agents/{agentId}

// Use this endpoint to get the current status of the specified Conversational AI agent instance.

// appid stringrequired

// The App ID of the project.

// agentId stringrequired

// The agent instance ID you obtained after successfully calling join to Start a conversational AI agent.

// If the returned status code is 200, the request was successful. The response body contains the result of the request.

// OK

// message string

// Request message.

// start_ts integer

// Agent creation timestamp.

// stop_ts integer

// Agent stop timestamp.

// status string

// Possible values: IDLE, STARTING, RUNNING, STOPPING, STOPPED, RECOVERING, FAILED

// Current status.

// IDLE (0): Agent is idle.
// STARTING (1): The agent is being started.
// RUNNING (2): The agent is running.
// STOPPING (3): The agent is stopping.
// STOPPED (4): The agent has exited.
// RECOVERING (5): The agent is recovering.
// FAILED (6): The agent failed to execute.

// agent_id string

// Unique id of the agent instance

// If the returned status code is not 200, the request failed. The response body includes the detail and reason for failure. Refer to status codes to understand the possible reasons for failure.
// Authorization
// This endpoint requires Basic Auth.
// Request example
// curl
// Python
// Node.js

// Copy
// Response example
// Copy
// Update agent configuration
// POST

// https://api.agora.io/api/conversational-ai-agent/v2/projects/{appid}/agents/{agentId}/update

// Use this endpoint to adjust Conversational AI agent instance parameters at runtime.

// appid stringrequired

// The App ID of the project.

// agentId stringrequired

// The agent instance ID you obtained after successfully calling join to Start a conversational AI agent.
// Request body​
// APPLICATION/JSON

// BODY

// properties objectnullable

// Hide properties

// token stringnullable

// The authentication token used by the agent to join the channel.

// llm objectnullable

// Large Language Model (LLM) settings.

// Hide properties

// system_messages array[object]nullable

// A set of predefined messages appended to the beginning of each LLM request. These messages help control the LLM’s output and can include role definitions, prompts, response examples, and more. This field must be compatible with the OpenAI protocol.

// params objectnullable

// Additional LLM information included in the message body, such as the model used, the maximum number of tokens, and more. Supported configurations vary by LLM provider. Refer to the provider’s documentation for details.

// info

// Updating this field overwrites the configuration set when the agent was created. When updating, make sure to pass the complete params field.

// mllm objectnullable

// Multimodal Large Language Model (MLLM) configuration for real-time audio and text processing.

// Hide properties

// params objectnullable

// Additional MLLM configuration parameters. See MLLM Overview for details.

// If the returned status code is 200, the request was successful. The response body contains the result of the request.

// OK

// agent_id string

// Unique id of the agent instance

// create_ts integer

// Timestamp of when the agent was created

// status string

// Possible values: IDLE, STARTING, RUNNING, STOPPING, STOPPED, RECOVERING, FAILED

// Current status.

// IDLE (0): Agent is idle.
// STARTING (1): The agent is being started.
// RUNNING (2): The agent is running.
// STOPPING (3): The agent is stopping.
// STOPPED (4): The agent has exited.
// RECOVERING (5): The agent is recovering.
// FAILED (6): The agent failed to execute.

// If the returned status code is not 200, the request failed. The response body includes the detail and reason for failure. Refer to status codes to understand the possible reasons for failure.
// Authorization
// This endpoint requires Basic Auth.
// Request example
// curl
// Python
// Node.js

// Copy
// Response example
// Copy

