'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { Language } from '@/types';
import { Check, ChevronRight, ShieldCheck, Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { language, setLanguage, addEmergencyContact } = useApp();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('Rahul Sharma');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin');
  const [contactName, setContactName] = useState('Priya Sharma');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [agreedConsent, setAgreedConsent] = useState(false);

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-modal border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10 animate-fade-in-up">
        {/* Top Accent Strip */}
        <div className="h-1 w-full bg-teal-650" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <Logo size="md" />
            <span className="chip chip-teal text-[10px] font-extrabold uppercase">Step {step} of 7</span>
          </div>

          {/* Steps */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Select Preferred Language</h2>
                <p className="text-xs text-slate-500 mt-1">Choose the primary language for your health guidance.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिंदी (Hindi)' },
                  { code: 'te', label: 'తెలుగు (Telugu)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as Language)}
                    className={`p-4 rounded-xl border text-sm font-bold transition-all active:scale-[0.98] ${
                      language === l.code
                        ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Basic Medical Profile</h2>
                <p className="text-xs text-slate-505 mt-1">Enter your clinical identity parameters.</p>
              </div>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Your Full Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 text-xs font-semibold outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Blood Group:</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 text-xs font-semibold outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Allergies & Conditions</h2>
                <p className="text-xs text-slate-500 mt-1">Helps the scanner prevent duplicate or allergic medicine warnings.</p>
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-slate-700 dark:text-slate-300">Allergies / Special Warnings:</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Dust Mites"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 text-xs font-semibold outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Emergency Contact Setup</h2>
                <p className="text-xs text-slate-500 mt-1">Setup your primary responder contact number.</p>
              </div>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Contact Name:</label>
                  <input
                    type="text"
                    placeholder="Contact Name (e.g. Priya Sharma)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 text-xs font-semibold outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Phone Number:</label>
                  <input
                    type="text"
                    placeholder="Phone Number (+91 98765 43210)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 text-xs font-semibold outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Notification Preferences</h2>
                <p className="text-xs text-slate-500 mt-1">Get instant reminders for dosing compliance.</p>
              </div>
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-start gap-2.5">
                <Check className="h-4 w-4 text-teal-655 shrink-0 mt-0.5" />
                <span>Browser push reminders for daily medicine doses & refill dates enabled.</span>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Safety Consent</h2>
                <p className="text-xs text-slate-500 mt-1">Agree to system terms before proceeding.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 space-y-3.5 text-slate-600 dark:text-slate-350">
                <p className="leading-relaxed">
                  HealthBridge AI provides educational guidance and does not replace a licensed healthcare professional. In an emergency, contact local emergency services (112 / 108) immediately.
                </p>
                <label className="flex items-center gap-2.5 font-bold cursor-pointer pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-slate-900 dark:text-white">
                  <input
                    type="checkbox"
                    checked={agreedConsent}
                    onChange={(e) => setAgreedConsent(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500/20"
                  />
                  <span>I understand and agree to AI safety parameters.</span>
                </label>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-450 text-xl font-bold border border-emerald-250 dark:border-emerald-900">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Onboarding Complete!</h2>
                <p className="text-xs text-slate-500 mt-1.5">Your family health account is ready. Welcome to HealthBridge AI.</p>
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl bg-teal-650 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{step === 7 ? 'Launch HealthBridge Dashboard' : 'Continue'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
