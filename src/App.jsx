import React, { useState, useRef, useEffect, useCallback } from 'react'
import { SYSTEM_PROMPT, QUICK_QUERIES, STARTER_CHIPS, DRILL_SCENARIOS } from './constants'
import styles from './App.module.css'

const PhoneIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .94h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>)
const UserIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>)
const SendIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>)
const PlusIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M12 5v14M5 12h14"/></svg>)

function FormattedText({ text }) {
  const parts = text.split('\n')
  return (
    <div>
      {parts.map((line, i) => {
        const numMatch = line.match(/^(\d+)\.\s(.+)/)
        const bulletMatch = line.match(/^[-]\s(.+)/)
        if (numMatch) return (
          <div key={i} className={styles.numberedLine}>
            <span className={styles.stepNum}>{numMatch[1]}</span>
            <span dangerouslySetInnerHTML={{ __html: numMatch[2].replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`(.+?)`/g,'<code>$1</code>') }} />
          </div>
        )
        if (bulletMatch) return (
          <div key={i} className={styles.bulletLine}>
            <span className={styles.bulletDot}>▶</span>
            <span dangerouslySetInnerHTML={{ __html: bulletMatch[1].replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`(.+?)`/g,'<code>$1</code>') }} />
          </div>
        )
        if (line.trim() === '') return <br key={i} />
        return <p key={i} className={styles.textLine} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`(.+?)`/g,'<code>$1</code>') }} />
      })}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className={styles.msg}>
      <div className={`${styles.msgAvatar} ${styles.botAvatar}`}>AI</div>
      <div className={styles.msgBody}>
        <div className={styles.msgSender}>L1 Assistant</div>
        <div className={`${styles.bubble} ${styles.botBubble}`}>
          <div className={styles.typingDots}><span /><span /><span /></div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('chat')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('hh_l1_api_key') || '')
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('hh_l1_api_key') || '')
  const [keyStatus, setKeyStatus] = useState(() => localStorage.getItem('hh_l1_api_key') ? 'saved' : '')
  const [drillAnswers, setDrillAnswers] = useState({})
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const saveApiKey = () => {
    const k = apiKeyInput.trim()
    if (!k) { setKeyStatus('empty'); return }
    localStorage.setItem('hh_l1_api_key', k)
    setApiKey(k)
    setKeyStatus('saved')
  }

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    const activeKey = apiKey || apiKeyInput.trim()
    if (!activeKey) { setKeyStatus('missing'); return }
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    const userMsg = { role: 'user', content: msg, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    const newHistory = [...history, { role: 'user', content: msg }]
    setHistory(newHistory)
    setLoading(true)
    try {
      const { askGemini } = await import('./api.js')
      const reply = await askGemini(apiKey, SYSTEM_PROMPT, newHistory)
      setHistory(prev => [...prev, { role: 'assistant', content: reply }])
      setMessages(prev => [...prev, { role: 'bot', content: reply, id: Date.now() }])
    } catch (err) {
      const isAuth = err.message?.includes('401') || err.message?.toLowerCase().includes('invalid')
      if (isAuth) { setKeyStatus('invalid'); setApiKey(''); localStorage.removeItem('hh_l1_api_key') }
      const errorMsg = isAuth ? 'Invalid API key. Please update the key in the sidebar.' : 'Error: ' + (err.message || 'Unknown error')
      setMessages(prev => [...prev, { role: 'bot', content: errorMsg, id: Date.now(), isError: true }])
    }
    setLoading(false)
  }, [input, loading, apiKey, history])

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const handleTextareaInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const keyStatusMsg = {
    saved: { text: 'Connected', cls: styles.keyOk },
    invalid: { text: 'Invalid key', cls: styles.keyErr },
    missing: { text: 'Key required to chat', cls: styles.keyErr },
    empty: { text: 'Please enter a key', cls: styles.keyErr },
  }[keyStatus] || null

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}><PhoneIcon /></div>
            <div className={styles.logoText}>HH L1 Support<span className={styles.logoSub}>Happiest Minds Technologies</span></div>
          </div>
          <div className={styles.statusPill}><span className={styles.statusDot} />Assistant Online</div>
        </div>

        <div className={styles.apiKeySection}>
          <div className={styles.sidebarLabel}>Google Gemini API Key</div>
          <div className={styles.apiKeyRow}>
            <input type="password" className={styles.apiKeyInput} placeholder="AIza..." value={apiKeyInput} onChange={e => { setApiKeyInput(e.target.value); setKeyStatus('') }} onKeyDown={e => e.key === 'Enter' && saveApiKey()} autoComplete="off" />
            <button className={`${styles.apiKeySaveBtn} ${keyStatus === 'saved' ? styles.apiKeySaved : ''}`} onClick={saveApiKey}>{keyStatus === 'saved' ? '✓ Saved' : 'Save'}</button>
          </div>
          {keyStatusMsg && <div className={`${styles.keyStatus} ${keyStatusMsg.cls}`}>{keyStatusMsg.text}</div>}
          <div className={styles.keyHint}>Get key: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" className={styles.keyLink}>makersuite.google.com</a></div>
        </div>

        <div className={styles.sidebarDivider} />
        <div className={styles.sidebarSection}>
          <div className={styles.sidebarLabel}>Quick Queries</div>
          {QUICK_QUERIES.map(q => (
            <button key={q.label} className={styles.quickBtn} onClick={() => { setMode('chat'); sendMessage(q.query) }}>
              <span className={styles.qIcon}>{q.icon}</span>{q.label}
            </button>
          ))}
        </div>
        <div className={styles.sidebarDivider} />
        <div className={styles.sidebarSection}>
          <div className={styles.sidebarLabel}>SLA Reference</div>
          <div className={styles.slaCard}>
            {[{p:'P1',cls:styles.p1,time:'Respond 15 min · Resolve 2 hr'},{p:'P2',cls:styles.p2,time:'Respond 15 min · Resolve 4 hr'},{p:'P3',cls:styles.p3,time:'Respond 2 hr · Resolve 2 days'},{p:'P4',cls:styles.p4,time:'Respond 1 day · Next release'}].map(row => (
              <div key={row.p} className={styles.slaRow}><span className={`${styles.slaBadge} ${row.cls}`}>{row.p}</span><span className={styles.slaTime}>{row.time}</span></div>
            ))}
          </div>
        </div>
        <div className={styles.sidebarFooter}>
          <button className={styles.newChatBtn} onClick={() => { setMessages([]); setHistory([]) }}><PlusIcon /> New Conversation</button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <div className={styles.headerAvatar}><UserIcon /></div>
            <div><div className={styles.chatTitle}>L1 Support Assistant</div><div className={styles.chatSubtitle}>Happiest Health PMS · ERPNext Healthcare</div></div>
          </div>
          <div className={styles.modeTabs}>
            <button className={`${styles.modeTab} ${mode==='chat'?styles.modeTabActive:''}`} onClick={() => setMode('chat')}>Chat</button>
            <button className={`${styles.modeTab} ${mode==='drill'?styles.modeTabActive:''}`} onClick={() => setMode('drill')}>Scenario Drill</button>
          </div>
        </div>

        {mode === 'chat' && (
          <>
            <div className={styles.messages}>
              {messages.length === 0 && (
                <div className={styles.welcome}>
                  <div className={styles.welcomeIcon}><PhoneIcon /></div>
                  <h2 className={styles.welcomeTitle}>Happiest Health L1 Support Guide</h2>
                  <p className={styles.welcomeDesc}>Ask me anything about PMS issues, escalation decisions, billing, therapy sessions, or SLA timings.</p>
                  <div className={styles.chips}>
                    {STARTER_CHIPS.map(c => <button key={c.label} className={styles.chip} onClick={() => sendMessage(c.query)}>{c.label}</button>)}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`${styles.msg} ${msg.role==='user'?styles.userMsg:''}`}>
                  <div className={`${styles.msgAvatar} ${msg.role==='user'?styles.userAvatar:styles.botAvatar}`}>{msg.role==='user'?'ME':'AI'}</div>
                  <div className={styles.msgBody}>
                    <div className={`${styles.msgSender} ${msg.role==='user'?styles.userSender:''}`}>{msg.role==='user'?'You':'L1 Assistant'}</div>
                    <div className={`${styles.bubble} ${msg.role==='user'?styles.userBubble:styles.botBubble} ${msg.isError?styles.errorBubble:''}`}>
                      {msg.role==='user' ? msg.content : <FormattedText text={msg.content} />}
                    </div>
                  </div>
                </div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.inputArea}>
              <div className={styles.inputRow}>
                <textarea ref={textareaRef} className={styles.textarea} placeholder="Describe the user's issue or ask a question..." value={input} onChange={handleTextareaInput} onKeyDown={handleKeyDown} rows={1} />
                <button className={styles.sendBtn} onClick={() => sendMessage()} disabled={loading || !input.trim()}><SendIcon /></button>
              </div>
              <div className={styles.inputHint}><span>Enter to send · Shift+Enter for new line</span><span className={styles.hintTag}>Symptom → Steps → Escalate If</span></div>
            </div>
          </>
        )}

        {mode === 'drill' && (
          <div className={styles.drillPanel}>
            <p className={styles.drillIntro}>Test yourself with real Happiest Health support scenarios. Type what you would do, then reveal the correct answer.</p>
            {DRILL_SCENARIOS.map((sc, i) => (
              <div key={i} className={styles.drillCard}>
                <div className={styles.drillHeader}><span className={styles.drillTag}>{sc.tag}</span><span className={styles.drillNum}>Scenario {i+1} of {DRILL_SCENARIOS.length}</span></div>
                <div className={styles.drillScenario}>{sc.scenario}</div>
                <div className={styles.drillBody}>
                  <textarea className={styles.drillTextarea} rows={3} placeholder="Type what steps you would take on this call..." />
                  <div className={styles.drillActions}>
                    <button className={styles.drillRevealBtn} onClick={() => setDrillAnswers(prev => ({...prev,[i]:!prev[i]}))}>
                      {drillAnswers[i] ? 'Hide Answer' : 'Reveal Correct Answer'}
                    </button>
                  </div>
                  {drillAnswers[i] && <div className={styles.drillAnswer}><strong>Correct steps:</strong><FormattedText text={sc.answer} /></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
