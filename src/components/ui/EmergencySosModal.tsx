'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  MapPin,
  Share2,
  X,
  AlertOctagon,
  Heart,
  Zap,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Search,
  ArrowRight,
  ShieldCheck,
  Ban,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { normalizeEmergencyInput } from '@/lib/emergencyNormalizer';
import {
  VERIFIED_STATIC_EMERGENCY_TEMPLATES,
  EmergencyGuidanceCardData,
} from '@/lib/emergencyKnowledgeBase';

export const EmergencySosModal: React.FC = () => {
  const {
    isSosActive,
    cancelSos,
    language,
    activeProfile,
    emergencyContacts,
    userLocation,
    requestUserLocation,
    showToast,
  } = useApp();

  const [countdown, setCountdown] = useState<number>(3);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  // Emergency Quick Assist state
  const [quickInput, setQuickInput] = useState<string>('');
  const [activeGuidance, setActiveGuidance] = useState<EmergencyGuidanceCardData | null>(null);
  const [loadingGuidance, setLoadingGuidance] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isSosActive && !isConfirmed) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsConfirmed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsConfirmed(false);
      setQuickInput('');
      setActiveGuidance(null);
    }
    return () => clearInterval(timer);
  }, [isSosActive]);

  if (!isSosActive) return null;

  const primaryContact = emergencyContacts.find((c) => c.isPrimary) || emergencyContacts[0];

  // Fast zero-latency intent resolution & RAG fetch
  const handleQuickAssistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    // 1. Instant Zero-Latency Guidance Rendering using Deterministic Router
    const classification = normalizeEmergencyInput(quickInput);
    const instantTemplate =
      VERIFIED_STATIC_EMERGENCY_TEMPLATES[classification.intent] ||
      VERIFIED_STATIC_EMERGENCY_TEMPLATES.UNKNOWN;

    setActiveGuidance(instantTemplate);
    showToast(`Instant evidence-based first-aid loaded for ${classification.canonicalName}`);

    // 2. Concurrently fetch RAG-enriched evidence server API
    setLoadingGuidance(true);
    try {
      const res = await fetch('/api/emergency-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: quickInput.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.guidance) {
          setActiveGuidance(data.guidance);
        }
      }
    } catch (err) {
      console.warn('RAG fetch background enrichment error:', err);
    } finally {
      setLoadingGuidance(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-red-200 dark:border-red-900/50 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white text-center relative shrink-0">
          <button
            onClick={cancelSos}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
            aria-label="Cancel Emergency"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/10 animate-pulse">
            <AlertOctagon className="h-9 w-9 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-wide uppercase">
            {t(language, 'emergencySos')}
          </h2>
          <p className="text-[11px] text-red-100 mt-0.5">
            Real-Time Medical Safety & Emergency Assistance Active
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {!isConfirmed ? (
            <div className="text-center space-y-4 py-6">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Confirming emergency activation in...
              </p>
              <div className="text-6xl font-black text-red-600 dark:text-red-400 animate-bounce">
                {countdown}
              </div>
              <button
                onClick={cancelSos}
                className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t(language, 'emergencyCancel')}
              </button>
            </div>
          ) : (
            <>
              {/* Emergency Call Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 text-white font-black py-3.5 px-4 shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all text-sm"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Call 112 / 108</span>
                </a>
                <a
                  href={`tel:${primaryContact?.phone || '112'}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-teal-600 text-white font-bold py-3.5 px-4 shadow hover:bg-slate-800 transition-all text-sm"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Call {primaryContact?.name.split(' ')[0] || 'Contact'}</span>
                </a>
              </div>

              {/* ── EMERGENCY QUICK ASSIST INPUT ── */}
              <div className="rounded-2xl bg-red-50/70 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <Zap className="h-4 w-4" /> Emergency Quick Assist
                  </span>
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-300">
                    One-Word Rapid Search
                  </span>
                </div>

                <form onSubmit={handleQuickAssistSubmit} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    What happened?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="Type emergency, e.g. snakebite"
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all shrink-0 flex items-center gap-1"
                    >
                      <span>Get Immediate Guidance</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* ── DEDICATED EMERGENCY GUIDANCE CARD ── */}
              {activeGuidance && (
                <div className="rounded-2xl bg-white dark:bg-slate-800 p-5 border-2 border-red-500 shadow-xl space-y-4 text-xs anim-fade-in">
                  
                  {/* 1. Emergency Title */}
                  <div className="border-b border-red-100 dark:border-slate-700 pb-3">
                    <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 tracking-wider">
                      Authoritative Guidance • {activeGuidance.emergencyType.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0D1B2A] dark:text-white mt-1">
                      {activeGuidance.headline}
                    </h3>
                  </div>

                  {/* 2. Call Emergency Services Banner */}
                  {activeGuidance.callEmergencyServices && (
                    <a
                      href="tel:112"
                      className="flex items-center justify-between p-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md"
                    >
                      <span className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4" /> Call 112 / 108 Emergency Medical Services Now
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}

                  {/* 3. Do This Now (3-5 Steps) */}
                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 dark:text-white block uppercase text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Do This Now
                    </span>
                    <ul className="space-y-1.5 text-slate-800 dark:text-slate-200 font-semibold pl-1">
                      {activeGuidance.immediateActions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 4. Do NOT */}
                  {activeGuidance.doNotDo && activeGuidance.doNotDo.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-1.5">
                      <span className="font-extrabold text-red-700 dark:text-red-400 uppercase text-[11px] flex items-center gap-1.5">
                        <Ban className="w-4 h-4 text-red-600 shrink-0" /> Do NOT (Dangerous Practices to Avoid)
                      </span>
                      <ul className="space-y-1 text-red-950 dark:text-red-200 font-semibold list-disc list-inside">
                        {activeGuidance.doNotDo.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 5. Watch For */}
                  {activeGuidance.warningSigns && activeGuidance.warningSigns.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-extrabold text-amber-700 dark:text-amber-400 block uppercase text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Watch For
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 font-semibold pl-1">
                        {activeGuidance.warningSigns.join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* 6. Sources Citation */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 font-medium space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Guidance based on approved clinical sources:
                    </span>
                    {activeGuidance.sourceTitles.map((title, idx) => (
                      <p key={idx} className="italic text-slate-600 dark:text-slate-400">
                        • {title}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Card */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-red-500" /> Live GPS Location
                  </span>
                  <button
                    onClick={requestUserLocation}
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Refresh GPS
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {userLocation
                    ? `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}`
                    : 'Location Access Pending'}
                </p>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'EMERGENCY SOS - HealthBridge AI',
                        text: `Emergency SOS for ${activeProfile.name}! Location: https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}`,
                      });
                    } else {
                      alert(`Location link copied: https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}`);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-teal-700 dark:text-cyan-400 font-semibold hover:underline mt-1"
                >
                  <Share2 className="h-3.5 w-3.5" /> {t(language, 'shareLocation')}
                </button>
              </div>

              {/* Medical Critical Profile */}
              <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-900/40 space-y-2 text-xs text-red-950 dark:text-red-200">
                <div className="font-bold flex items-center gap-1.5 text-sm text-red-700 dark:text-red-400">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  Emergency Medical Card — {activeProfile.name}
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-800 dark:text-slate-200 pt-1">
                  <div>
                    <span className="font-semibold text-slate-500">Blood Group:</span>{' '}
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {activeProfile.bloodGroup}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Age / Sex:</span>{' '}
                    <span>{activeProfile.age} yrs / {activeProfile.gender}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-500">Allergies:</span>{' '}
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {activeProfile.allergies.join(', ') || 'None Reported'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-500">Known Conditions:</span>{' '}
                    <span>{activeProfile.conditions.join(', ') || 'None Reported'}</span>
                  </div>
                </div>
              </div>

              {/* Cancel Action */}
              <button
                onClick={cancelSos}
                className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                {t(language, 'emergencyCancel')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
