'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  Volume2,
  Trash2,
  User,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function AssistantPage() {
  const { assistantMessages, sendAssistantMessage, clearAssistantHistory, language, activeProfile } = useApp();
  const router = useRouter();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages, isLoading]);

  const handleSend = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    const query = inputQuery;
    setInputQuery('');
    setIsLoading(true);
    await sendAssistantMessage(query);
    setIsLoading(false);
  };

  const handleQuickAction = async (prompt: string) => {
    if (prompt === 'Check Symptoms') {
      router.push('/dashboard/symptoms');
      return;
    }
    if (prompt === 'Nearest hospital') {
      router.push('/dashboard/care');
      return;
    }
    if (prompt === 'Explain my report') {
      router.push('/dashboard/reports');
      return;
    }
    setIsLoading(true);
    await sendAssistantMessage(prompt);
    setIsLoading(false);
  };

  const samplePrompts = [
    'Explain LDL Cholesterol level 142 mg/dL in simple terms',
    'Summarize my latest lab report',
    'What questions should I ask Dr. Mehta during my visit?',
    'What are common symptoms of high blood pressure?',
  ];

  const quickActions = [
    'Check Symptoms',
    'Explain my report',
    'Drug interactions',
    'Nearest hospital'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="frosted-card rounded-3xl p-6 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0066FF 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, #E6F0FF 0%, #F3F5F8 100%)' }}>
              <Bot className="h-8 w-8" style={{ color: '#0066FF' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: '#0D1B2A' }}>HealthBridge AI</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: '#E8E3FF', color: '#6E56CF' }}>
                  Powered by Google Gemini
                </span>
                <span className="dot-live"></span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#9BAABF' }}>
                Patient context active for <span className="font-bold" style={{ color: '#0D1B2A' }}>{activeProfile?.name || 'User'}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className="pill-btn pill-btn-ghost flex items-center gap-2"
              title="Toggle Text-to-Speech"
            >
              <Volume2 className="h-4 w-4" style={{ color: ttsEnabled ? '#0066FF' : '#9BAABF' }} />
              <span className="text-xs font-semibold" style={{ color: ttsEnabled ? '#0066FF' : '#9BAABF' }}>
                {ttsEnabled ? 'Voice On' : 'Voice Off'}
              </span>
            </button>
            <button
              onClick={clearAssistantHistory}
              className="pill-btn pill-btn-ghost flex items-center gap-2 text-xs font-semibold"
              title="Clear Chat History"
            >
              <Trash2 className="h-4 w-4" style={{ color: '#FF3366' }} />
              <span style={{ color: '#FF3366' }}>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickAction(action)}
            className={`pill-btn pill-btn-ghost text-xs font-semibold anim-fade-up delay-${(idx + 1) * 100}`}
            style={{ color: '#0D1B2A' }}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="frosted-card rounded-3xl flex flex-col h-[500px] overflow-hidden shadow-sm">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {assistantMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 anim-fade-up">
              <div className="p-4 rounded-full" style={{ background: 'rgba(0,102,255,0.05)' }}>
                <Bot className="h-12 w-12 opacity-50" style={{ color: '#0066FF' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: '#0D1B2A' }}>How can I help you today?</h3>
              <div className="flex flex-col gap-2 max-w-sm w-full">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(prompt)}
                    className="neu-card p-3 rounded-2xl text-sm font-medium text-left hover:card-lift transition-all"
                    style={{ color: '#0D1B2A' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            assistantMessages.map((msg: any, idx: number) => (
              <div
                key={msg.id || idx}
                className={`flex items-end gap-3 anim-fade-up ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 shadow-sm font-bold"
                  style={{
                    background: msg.sender === 'user' ? 'var(--accent-lavender)' : 'linear-gradient(135deg, #6E56CF 0%, #7C5CFC 100%)',
                    color: msg.sender === 'user' ? '#6E56CF' : '#ffffff'
                  }}
                >
                  {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-md sm:max-w-lg rounded-2xl p-4 text-sm space-y-2 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#6E56CF] text-white rounded-br-sm'
                      : 'glass-subcard text-[var(--text-primary)] rounded-bl-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* Suggested Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-3 flex flex-wrap gap-2 border-t" style={{ borderColor: msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)' }}>
                      {msg.suggestedActions.map((act: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (act.actionPath) router.push(act.actionPath);
                            else if (act.query) handleQuickAction(act.query);
                          }}
                          className="px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all hover:opacity-80 shadow-sm"
                          style={{
                            background: msg.sender === 'user' ? 'rgba(255,255,255,0.15)' : '#ffffff',
                            color: msg.sender === 'user' ? '#ffffff' : '#0066FF'
                          }}
                        >
                          <span>{act.label}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] block font-medium mt-1" style={{ opacity: 0.6, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex items-center gap-3 anim-fade-up">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0 bg-indigo-500 text-white shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-xl p-3.5 glass-subcard text-xs font-semibold text-indigo-400 flex items-center gap-2 border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>HealthBridge AI is analyzing your request...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white/40 backdrop-blur-md border-t" style={{ borderColor: 'rgba(255,255,255,0.5)' }}>
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsListening(!isListening);
                if (!isListening) {
                  setInputQuery('Summarize blood report results');
                  setTimeout(() => setIsListening(false), 2000);
                }
              }}
              className="p-3 rounded-2xl transition-all shadow-sm flex items-center justify-center"
              style={{
                background: isListening ? '#FF3366' : '#ffffff',
                color: isListening ? '#ffffff' : '#0D1B2A',
                border: '1px solid rgba(255,255,255,0.8)'
              }}
              title="Voice Input"
            >
              <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>

            <textarea
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Ask medical questions, lab explanations, or guidance..."
              className="flex-1 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm text-sm font-medium outline-none resize-none h-[48px] placeholder:text-slate-400"
              style={{ color: '#0D1B2A', border: '1px solid rgba(255,255,255,0.9)' }}
              rows={1}
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="pill-btn pill-btn-primary px-5 h-[48px] rounded-2xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              style={{ opacity: (!inputQuery.trim() || isLoading) ? 0.5 : 1 }}
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
