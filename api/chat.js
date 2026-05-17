// api/chat.js
// Vercel Serverless Function - AI Orchestration & Synthesis Engine
// Calls multiple AI providers in parallel and synthesizes responses

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- AI Provider Call Functions ---

async function callGroq(messages) {
  if (!GROQ_API_KEY) return { model: 'Groq (Llama 3)', response: 'Groq API key not configured. Add GROQ_API_KEY to environment variables.', error: true };
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });
    const data = await res.json();
    return { model: 'Groq (Llama 3 70B)', response: data.choices?.[0]?.message?.content || 'No response', time: data.usage?.total_time };
  } catch (e) {
    return { model: 'Groq (Llama 3)', response: `Error: ${e.message}`, error: true };
  }
}

async function callGemini(messages) {
  if (!GEMINI_API_KEY) return { model: 'Gemini', response: 'Gemini API key not configured. Add GEMINI_API_KEY to environment variables.', error: true };
  try {
    const contents = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });
    const data = await res.json();
    return { model: 'Google Gemini', response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response' };
  } catch (e) {
    return { model: 'Gemini', response: `Error: ${e.message}`, error: true };
  }
}

async function callMixtral(messages) {
  if (!GROQ_API_KEY) return { model: 'Mixtral', response: 'Groq API key not configured.', error: true };
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages,
        temperature: 0.9,
        max_tokens: 2048,
      }),
    });
    const data = await res.json();
    return { model: 'Mixtral 8x7B', response: data.choices?.[0]?.message?.content || 'No response' };
  } catch (e) {
    return { model: 'Mixtral', response: `Error: ${e.message}`, error: true };
  }
}

// --- Synthesis Engine ---
function calculateConfidence(responses) {
  const valid = responses.filter(r => !r.error);
  if (valid.length === 0) return { score: 0, level: 'none' };
  if (valid.length === 1) return { score: 65, level: 'medium' };

  // Simple heuristic: check response length similarity and key phrase overlap
  const lengths = valid.map(r => r.response.length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const lengthVariance = lengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / lengths.length;
  const normalizedVariance = Math.min(lengthVariance / (avgLen * avgLen), 1);

  // Higher variance = lower confidence
  const baseScore = 85 - normalizedVariance * 40;
  const errorPenalty = (responses.length - valid.length) * 15;
  const score = Math.max(20, Math.min(95, Math.round(baseScore - errorPenalty)));

  let level = 'high';
  if (score < 50) level = 'low';
  else if (score < 75) level = 'medium';

  return { score, level };
}

async function synthesizeResponses(userMessage, aiResponses) {
  const validResponses = aiResponses.filter(r => !r.error);
  if (validResponses.length === 0) return 'No AI models are currently available. Please configure API keys.';

  if (validResponses.length === 1) return validResponses[0].response;

  // Build synthesis prompt
  const responseTexts = validResponses.map((r, i) =>
    `--- ${r.model} ---\n${r.response}`
  ).join('\n\n');

  const synthesisMessages = [
    {
      role: 'system',
      content: `You are Noema AI, a meta-intelligence system that combines multiple AI perspectives into one superior answer. You have received responses from ${validResponses.length} different AI models. Combine the best points from each into a single, coherent, comprehensive answer. Use markdown formatting. Be thorough but concise. If models disagree, present the most common viewpoint and briefly note alternatives.`
    },
    {
      role: 'user',
      content: `User Question: ${userMessage}\n\nHere are the responses from ${validResponses.length} AI models:\n\n${responseTexts}\n\nPlease synthesize these into one comprehensive, well-structured answer. Preserve the best insights from each model.`
    }
  ];

  // Use the best available model for synthesis
  const synthersisResponse = await callGroq(synthesisMessages);
  if (synthersisResponse.error) {
    // Fallback: just return the first valid response
    return validResponses[0].response;
  }
  return synthersisResponse.response;
}

// --- Save message to Supabase ---
async function saveMessage(conversationId, role, content, metadata = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        role,
        content,
        metadata,
      }),
    });
  } catch (e) {
    console.error('Failed to save message:', e);
  }
}

// --- Main Handler ---
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { message, conversationId, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    // Build conversation history for AI context
    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful AI assistant. Provide clear, accurate, and well-structured responses using markdown formatting when appropriate.'
    };
    const contextHistory = history.slice(-6).map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Call 3 AI providers in parallel with different perspectives
    const [groqResult, geminiResult, mixtralResult] = await Promise.all([
      callGroq([systemPrompt, ...contextHistory, { role: 'user', content: message }]),
      callGemini([systemPrompt, ...contextHistory, { role: 'user', content: message }]),
      callMixtral([systemPrompt, ...contextHistory, { role: 'user', content: message }]),
    ]);

    const aiResponses = [groqResult, geminiResult, mixtralResult];

    // Calculate confidence
    const confidence = calculateConfidence(aiResponses);

    // Synthesize all responses
    const synthesized = await synthesizeResponses(message, aiResponses);

    // Save to database
    await saveMessage(conversationId, 'user', message);

    const metadata = {
      confidence,
      sources: aiResponses.map(r => ({
        model: r.model,
        preview: r.response.substring(0, 200),
        error: r.error || false,
      })),
    };
    await saveMessage(conversationId, 'assistant', synthesized, metadata);

    return res.status(200).json({
      content: synthesized,
      confidence,
      sources: aiResponses,
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: error.message });
  }
}
