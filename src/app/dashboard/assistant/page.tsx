'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  Volume2,
  Trash2,
  Sparkles,
  ShieldCheck,
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
    'What are the symptoms of high blood pressure?',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-800 to-navy-900 p-6 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-cyan-300 border border-teal-500/30">
            <Bot className="h-8 w-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-cyan-300 text-[10px] font-bold uppercase mb-1">
              <Sparkles className="h-3 w-3" /> Voice & Text Health Guide
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold">Aira AI Health Assistant</h1>
            <p className="text-xs text-slate-200">
              Assisting <span className="font-bold text-teal-300">{activeProfile.name}</span> in English, Hindi, and Telugu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              ttsEnabled ? 'bg-teal-500 text-white border-teal-400' : 'bg-white/10 text-white border-white/20'
            }`}
            title="Toggle Text-to-Speech"
          >
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>
          <button
            onClick={clearAssistantHistory}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
            title="Clear Chat"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-card border border-slate-200 dark:border-slate-800 flex flex-col h-[520px] overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {assistantMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-white font-bold text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-navy-900 text-white'
                    : 'bg-gradient-to-br from-teal-600 to-cyan-500'
                }`}
              >
                {msg.sender === 'user' ? 'U' : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-md sm:max-w-lg rounded-2xl p-4 text-xs sm:text-sm space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {/* Suggested Action Chips inside AI message */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-200 dark:border-slate-700">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act.actionPath) router.push(act.actionPath);
                          else if (act.query) sendAssistantMessage(act.query);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/10 dark:bg-teal-950/60 text-teal-700 dark:text-cyan-300 font-semibold text-xs border border-teal-500/30 hover:bg-teal-500/20 flex items-center gap-1"
                      >
                        <span>{act.label}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] opacity-60 block text-right font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts Strip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold shrink-0 self-center">Try:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendAssistantMessage(prompt)}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 whitespace-nowrap hover:border-teal-500 hover:text-teal-600 font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsListening(!isListening);
              if (!isListening) setInputQuery('What does an LDL cholesterol of 142 mean?');
            }}
            className={`p-2.5 rounded-xl border transition-colors ${
              isListening
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Speech-to-Text Input"
          >
            <Mic className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Aira anything about symptoms, lab terms, or app navigation..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-none outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-teal-600 disabled:opacity-50 text-white hover:bg-teal-700 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
