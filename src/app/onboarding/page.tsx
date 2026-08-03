'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useApp } from '@/context/AppContext';
import { Language } from '@/types';
import { Check, ChevronRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <Logo size="md" />
          <span className="text-xs font-bold text-teal-600 dark:text-cyan-400">Step {step} of 7</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Select Preferred Language</h2>
            <p className="text-xs text-slate-500">Choose the primary language for your health guidance.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी (Hindi)' },
                { code: 'te', label: 'తెలుగు (Telugu)' },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code as Language)}
                  className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                    language === l.code
                      ? 'bg-teal-600 text-white border-teal-700 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Basic Medical Profile</h2>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Your Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Allergies & Conditions (Optional)</h2>
            <p className="text-slate-500">Helps the scanner prevent duplicate or allergic medicine warnings.</p>
            <input
              type="text"
              placeholder="e.g. Penicillin, Dust Mites"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm"
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Emergency Contact Setup</h2>
            <input
              type="text"
              placeholder="Contact Name (e.g. Priya Sharma)"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm"
            />
            <input
              type="text"
              placeholder="Phone Number (+91 98765 43210)"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Notification Preferences</h2>
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 text-teal-900 dark:text-cyan-300 font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-teal-600 dark:text-cyan-400 shrink-0" />
              <span>Browser push reminders for daily medicine doses & refill dates enabled.</span>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 text-xs">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Safety Consent</h2>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2 text-slate-700 dark:text-slate-300">
              <p>
                HealthBridge AI provides educational guidance and does not replace a licensed healthcare professional. In an emergency, contact local emergency services (112 / 108) immediately.
              </p>
              <label className="flex items-center gap-2 font-bold cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={agreedConsent}
                  onChange={(e) => setAgreedConsent(e.target.checked)}
                  className="rounded text-teal-600"
                />
                I understand and agree to AI safety parameters.
              </label>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Onboarding Complete!</h2>
            <p className="text-xs text-slate-500">Your family health account is ready. Welcome to HealthBridge AI.</p>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>{step === 7 ? 'Launch HealthBridge Dashboard' : 'Continue'}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
