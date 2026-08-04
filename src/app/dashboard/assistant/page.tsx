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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-teal-400 border border-slate-700">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[10px] font-bold uppercase mb-1 border border-slate-700">
              Clinical Knowledge Engine
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">Clinical & Patient Health Assistant</h1>
            <p className="text-xs text-slate-300">
              Patient context active for <span className="font-bold text-teal-400">{activeProfile.name}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              ttsEnabled ? 'bg-teal-600 text-white border-teal-500' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Toggle Text-to-Speech"
          >
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">{ttsEnabled ? 'Voice On' : 'Voice Off'}</span>
          </button>
          <button
            onClick={clearAssistantHistory}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
            title="Clear Chat History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[540px] overflow-hidden">
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
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-teal-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? 'U' : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-md sm:max-w-lg rounded-xl p-4 text-xs sm:text-sm space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {/* Suggested Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-200 dark:border-slate-700">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (act.actionPath) router.push(act.actionPath);
                          else if (act.query) sendAssistantMessage(act.query);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold text-xs border border-teal-200 dark:border-teal-800 hover:bg-teal-100 flex items-center gap-1"
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
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold shrink-0 self-center">Presets:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendAssistantMessage(prompt)}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 whitespace-nowrap hover:border-teal-500 font-medium transition-colors"
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
            className={`p-2.5 rounded-xl border transition-colors ${
              isListening ? 'bg-red-600 text-white border-red-700 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
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
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500/20"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-teal-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm hover:bg-teal-700 transition-colors flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
