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
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function AssistantPage() {
  const { assistantMessages, sendAssistantMessage, clearAssistantHistory, language, activeProfile } = useApp();
  const router = useRouter();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    sendAssistantMessage(inputQuery);
    setInputQuery('');
  };

  const samplePrompts = [
    'Explain LDL Cholesterol level 142 mg/dL in simple terms',
    'Summarize my latest lab report',
    'What questions should I ask Dr. Mehta during my visit?',
    'What are common symptoms of high blood pressure?',
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600/20 border border-teal-500/30 text-teal-400">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <span className="chip chip-teal text-[10px] uppercase mb-1.5 inline-flex">Clinical Knowledge Engine</span>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Clinical & Patient Health Assistant</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Patient context active for <span className="font-bold text-teal-400">{activeProfile.name}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              ttsEnabled
                ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Text-to-Speech"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>
          <button
            onClick={clearAssistantHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-card border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden" style={{ height: '560px' }}>
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {assistantMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                <Sparkles className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Clinical & Patient Health Assistant</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Ask medical questions, get lab result explanations, or request medication guidance. Patient context is loaded for {activeProfile.name}.
                </p>
              </div>
            </div>
          )}

          {assistantMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 animate-fade-in-up ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold shrink-0 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-teal-500 to-teal-700 text-white'
                    : 'bg-gradient-to-br from-slate-700 to-slate-900 text-teal-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-sm sm:max-w-md rounded-2xl p-4 text-xs sm:text-[13px] leading-relaxed space-y-2.5 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-tr-sm'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-sm border border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-200/30 dark:border-slate-600">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act.actionPath) router.push(act.actionPath);
                          else if (act.query) sendAssistantMessage(act.query);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold text-[11px] border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-950 transition-colors"
                      >
                        <span>{act.label}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] opacity-50 block text-right font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts Strip */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0 self-center">Presets:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendAssistantMessage(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-nowrap text-[11px] font-medium hover:border-teal-400 dark:hover:border-teal-600 hover:text-teal-700 dark:hover:text-teal-300 transition-all shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsListening(!isListening);
              if (!isListening) {
                setInputQuery('Summarize blood report results');
                setTimeout(() => setIsListening(false), 2000);
              }
            }}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Voice Input"
          >
            <Mic className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask medical questions, lab result explanations, or medication guidance..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 transition-all"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 disabled:opacity-40 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
