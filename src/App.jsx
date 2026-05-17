// ============================================================
// NOEMA AI — App.jsx
// The Mind Behind All Minds
// ALL UI CODE IS HERE — Future updates go in this file only!
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

// --- SVG Icons (inline, no external deps) ---
const Icons = {
  send: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  menu: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
  x: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  trash: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
  search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  brain: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>,
  zap: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  layers: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>,
  shield: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>,
  chevronDown: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  message: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  copy: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
}

// ============================================================
// APP COMPONENT — EVERYTHING IS HERE
// ============================================================
export default function App() {
  // --- STATE ---
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSources, setExpandedSources] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [showCopyToast, setShowCopyToast] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const abortControllerRef = useRef(null)

  // --- SUPABASE CONFIG (read from env) ---
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  // Direct Supabase calls from client
  const supabaseFetch = useCallback(async (table, options = {}) => {
    if (!supabaseUrl || !supabaseKey) return []
    const { select = '*', filter = '', order = 'created_at.desc', limit = 100 } = options
    const url = `${supabaseUrl}/rest/v1/${table}?select=${select}&order=${order}&limit=${limit}${filter}`
    const res = await fetch(url, {
      headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    })
    return res.json()
  }, [supabaseUrl, supabaseKey])

  const supabaseInsert = useCallback(async (table, data) => {
    if (!supabaseUrl || !supabaseKey) return null
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', 'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    return result[0] || result
  }, [supabaseUrl, supabaseKey])

  const supabaseDelete = useCallback(async (table, id) => {
    if (!supabaseUrl || !supabaseKey) return
    await fetch(`${supabaseUrl}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
    })
  }, [supabaseUrl, supabaseKey])

  // --- LOAD CONVERSATIONS ---
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      // Try Supabase first
      const data = await supabaseFetch('conversations', { order: 'updated_at.desc' })
      if (Array.isArray(data) && data.length >= 0) {
        setConversations(data)
        return
      }
    } catch (e) { /* fallback to API */ }
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      if (Array.isArray(data)) setConversations(data)
    } catch (e) { setConversations([]) }
  }

  // --- LOAD MESSAGES FOR ACTIVE CONVERSATION ---
  useEffect(() => {
    if (!activeConvId) { setMessages([]); return }
    loadMessages(activeConvId)
  }, [activeConvId])

  const loadMessages = async (convId) => {
    try {
      const data = await supabaseFetch('messages', {
        filter: `&conversation_id=eq.${convId}`,
        order: 'created_at.asc',
        limit: 500,
      })
      if (Array.isArray(data)) {
        setMessages(data.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          metadata: m.metadata || {},
          created_at: m.created_at,
        })))
        return
      }
    } catch (e) { /* fallback */ }
    try {
      const res = await fetch(`/api/conversations/${convId}`)
      const data = await res.json()
      if (data.messages) setMessages(data.messages)
    } catch (e) { setMessages([]) }
  }

  // --- SCROLL TO BOTTOM ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  // --- CREATE NEW CONVERSATION ---
  const createConversation = async () => {
    try {
      const conv = await supabaseInsert('conversations', { title: 'New Chat' })
      if (conv) {
        setConversations(prev => [conv, ...prev])
        setActiveConvId(conv.id)
        setMessages([])
        return conv.id
      }
    } catch (e) { /* fallback */ }
    try {
      const res = await fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'New Chat' }) })
      const conv = await res.json()
      setConversations(prev => [conv, ...prev])
      setActiveConvId(conv.id)
      setMessages([])
      return conv.id
    } catch (e) { return null }
  }

  // --- DELETE CONVERSATION ---
  const deleteConversation = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this conversation?')) return
    try { await supabaseDelete('conversations', id) } catch (e) { /* fallback */ }
    try { await fetch(`/api/conversations/${id}`, { method: 'DELETE' }) } catch (e) {}
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeConvId === id) { setActiveConvId(null); setMessages([]) }
  }

  // --- SEND MESSAGE ---
  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    let convId = activeConvId
    if (!convId) {
      convId = await createConversation()
      if (!convId) return
    }

    const userMsg = { id: Date.now().toString(), role: 'user', content: text, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setStreamingText('')
    setExpandedSources(false)

    // Auto-generate title from first message
    if (messages.length === 0) {
      const title = text.length > 40 ? text.substring(0, 40) + '...' : text
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, title } : c))
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId: convId, history: messages }),
      })

      if (!res.ok) throw new Error('API request failed')

      const data = await res.json()

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        metadata: {
          confidence: data.confidence,
          sources: data.sources,
        },
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, something went wrong. Please make sure the API keys are configured and try again.\n\nError: ${error.message}`,
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
      setStreamingText('')
      loadConversations() // refresh sidebar
    }
  }

  // --- COPY MESSAGE ---
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text)
    setShowCopyToast(true)
    setTimeout(() => setShowCopyToast(false), 2000)
  }

  // --- CONFIDENCE BADGE ---
  const ConfidenceBadge = ({ confidence }) => {
    if (!confidence) return null
    const { score, level } = confidence
    const colors = {
      high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {score}% AI Consensus
      </span>
    )
  }

  // --- AI SOURCES PANEL ---
  const AISourcesPanel = ({ sources }) => {
    if (!sources || sources.length === 0) return null
    return (
      <div className="mt-3 border border-navy-600/50 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSources(!expandedSources)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-slate-300 hover:bg-navy-700/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Icons.layers className="w-3.5 h-3.5" />
            AI Sources ({sources.filter(s => !s.error).length} models)
          </span>
          <Icons.chevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSources ? 'rotate-180' : ''}`} />
        </button>
        {expandedSources && (
          <div className="border-t border-navy-600/50 p-3 space-y-2">
            {sources.map((source, i) => (
              <div key={i} className={`p-2 rounded text-xs ${source.error ? 'bg-red-500/5 border border-red-500/10' : 'bg-navy-700/30'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${source.error ? 'text-red-400' : 'text-amber-400'}`}>
                    {source.model}
                  </span>
                  {source.error && <span className="text-red-400/60 text-[10px]">Error</span>}
                </div>
                {!source.error && (
                  <p className="text-slate-500 line-clamp-2 leading-relaxed">
                    {source.preview || source.response?.substring(0, 150) || 'No preview'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // --- MESSAGE RENDERER ---
  const MessageBubble = ({ msg }) => {
    const isUser = msg.role === 'user'
    return (
      <div className={`animate-fadeIn flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'order-1' : 'order-1'}`}>
          {/* Metadata row */}
          {!isUser && msg.metadata?.confidence && (
            <div className="flex items-center gap-2 mb-1.5">
              <ConfidenceBadge confidence={msg.metadata.confidence} />
            </div>
          )}

          {/* Message content */}
          <div className={`relative group rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-amber-400 text-navy-900 rounded-br-md'
              : 'glass rounded-bl-md'
          }`}>
            {/* Copy button */}
            {!isUser && (
              <button
                onClick={() => copyMessage(msg.content)}
                className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-navy-700 hover:bg-navy-600 text-slate-400 hover:text-white"
                title="Copy"
              >
                <Icons.copy className="w-3 h-3" />
              </button>
            )}

            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <div className="markdown-body text-sm text-slate-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="rounded-lg overflow-hidden my-2 border border-navy-600/50">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-navy-800 text-xs text-slate-400">
                            <span>{match[1]}</span>
                          </div>
                          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.8rem' }}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      )
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* AI Sources */}
          {!isUser && msg.metadata?.sources && (
            <AISourcesPanel sources={msg.metadata.sources} />
          )}
        </div>
      </div>
    )
  }

  // --- WELCOME SCREEN ---
  const WelcomeScreen = () => (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center animate-fadeIn">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-6 shadow-lg shadow-amber-400/20">
            <Icons.brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Noema AI
            </span>
          </h1>
          <p className="text-slate-400 text-lg">The Mind Behind All Minds</p>
          <p className="text-slate-500 text-sm mt-1">Multiple AI perspectives. One superior answer.</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Icons.layers, title: 'Multi-AI Fusion', desc: 'Combines perspectives from multiple AI models simultaneously' },
            { icon: Icons.brain, title: 'Smart Synthesis', desc: 'Intelligently merges responses into one superior answer' },
            { icon: Icons.shield, title: 'Confidence Scoring', desc: 'See how much AI models agree on each answer' },
          ].map((f, i) => (
            <div key={i} className="glass rounded-xl p-4 text-left hover:border-amber-400/30 transition-colors">
              <f.icon className="w-5 h-5 text-amber-400 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Sample Prompts */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-3">Try asking</p>
          {[
            'Explain quantum computing in simple terms',
            'Write a Python function to sort a list',
            'What are the benefits of meditation?',
            'Compare React vs Vue for a new project',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => { setInput(prompt); inputRef.current?.focus() }}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-navy-700/50 border border-transparent hover:border-navy-600/50 transition-all"
            >
              <span className="text-amber-400 mr-2">#</span>{prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // --- CHAT VIEW ---
  const ChatView = () => (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="animate-fadeIn flex justify-start mb-4">
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 typing-dot" />
                  <span className="ml-2 text-xs text-slate-500">Consulting multiple AIs...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-navy-700/50 p-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 glass rounded-2xl px-4 py-3 focus-within:border-amber-400/30 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
                }}
                placeholder="Ask Noema AI anything..."
                rows={1}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 resize-none outline-none max-h-32"
                style={{ minHeight: '24px', height: 'auto' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:bg-navy-600 disabled:text-slate-500 text-navy-900 flex items-center justify-center transition-all hover:shadow-lg hover:shadow-amber-400/20 disabled:shadow-none"
            >
              <Icons.send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-2">
            Noema AI synthesizes responses from multiple models. Answers may not always be accurate.
          </p>
        </div>
      </div>
    </div>
  )

  // --- SIDEBAR ---
  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-navy-700/50`}>
      <div className="w-72 h-full flex flex-col bg-navy-800/50">
        {/* Header */}
        <div className="p-4 border-b border-navy-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Icons.brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Noema AI</h1>
              <p className="text-[10px] text-slate-500">Multi-AI Platform</p>
            </div>
          </div>
          <button
            onClick={() => { createConversation(); inputRef.current?.focus() }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 text-sm font-medium transition-colors"
          >
            <Icons.plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Icons.search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-navy-700/50 text-xs text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-amber-400/30"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {conversations
            .filter(c => !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg mb-0.5 group transition-colors ${
                  activeConvId === conv.id ? 'bg-amber-400/10 text-amber-400' : 'text-slate-400 hover:bg-navy-700/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate flex-1 font-medium">{conv.title}</span>
                  <button
                    onClick={(e) => deleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                  >
                    <Icons.trash className="w-3 h-3" />
                  </button>
                </div>
              </button>
            ))
          }
          {conversations.length === 0 && (
            <p className="text-center text-xs text-slate-600 py-8">No conversations yet</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-navy-700/50">
          <p className="text-[10px] text-slate-600 text-center">
            {supabaseUrl ? 'Connected to Supabase' : 'Configure .env for database'}
          </p>
        </div>
      </div>
    </div>
  )

  // --- MAIN RENDER ---
  return (
    <div className="h-screen flex bg-navy-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-navy-700/50 bg-navy-900/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <Icons.menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Icons.brain className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-white hidden sm:inline">Noema AI</span>
          </div>
          <div className="w-9" /> {/* Spacer for balance */}
        </header>

        {/* Content */}
        {activeConvId || messages.length > 0 ? <ChatView /> : <WelcomeScreen />}
      </div>

      {/* Copy Toast */}
      {showCopyToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs">
            Copied to clipboard
          </div>
        </div>
      )}
    </div>
  )
}
