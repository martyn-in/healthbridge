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
  ArrowRight,
  ShieldCheck,
  Ban,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { evaluateSafetyEscalation, SafetyClassification } from '@/lib/localSafetyRouter';

export interface DynamicEmergencyGuidance {
  problem?: string;
  urgency?: 'routine' | 'urgent' | 'emergency';
  headline: string;
  immediateActions: string[];
  avoid?: string[];
  warningSigns?: string[];
  seekEmergencyCare?: boolean;
  // Only sources genuinely returned by Gemini grounding — never fabricated
  sources?: { title: string; url?: string }[];
}

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
  const [isLoadingGuidance, setIsLoadingGuidance] = useState<boolean>(false);
  const [activeGuidance, setActiveGuidance] = useState<DynamicEmergencyGuidance | null>(null);
  const [safetyEscalation, setSafetyEscalation] = useState<SafetyClassification | null>(null);
  const [fallbackWarning, setFallbackWarning] = useState<string | null>(null);

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
    } else if (!isSosActive) {
      setIsConfirmed(false);
      setQuickInput('');
      setActiveGuidance(null);
      setSafetyEscalation(null);
      setFallbackWarning(null);
      setIsLoadingGuidance(false);
    }
    return () => clearInterval(timer);
  }, [isSosActive]);

  if (!isSosActive) return null;

  const primaryContact = emergencyContacts.find((c) => c.isPrimary) || emergencyContacts[0];

  // Real Gemini Grounded Emergency Assistance Call
  const handleQuickAssistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = quickInput.trim();
    if (!query) return;

    setFallbackWarning(null);
    setIsLoadingGuidance(true);

    try {
      // 1. Instant local safety escalation check
      const localSafety = evaluateSafetyEscalation(query);
      setSafetyEscalation(localSafety);

      // 2. Call server-side real Gemini Emergency Assist endpoint
      const res = await fetch('/api/emergency/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (data.safetyEscalation) {
        setSafetyEscalation(data.safetyEscalation);
      }

      if (res.ok && data.success && data.guidance) {
        setActiveGuidance({
          problem: data.guidance.problem,
          urgency: data.guidance.urgency,
          headline: data.guidance.headline,
          immediateActions: data.guidance.immediateActions || [],
          avoid: data.guidance.avoid || [],
          warningSigns: data.guidance.warningSigns || [],
          // Real Gemini assessment — not forced to true
          seekEmergencyCare: data.guidance.seekEmergencyCare === true,
          // Only real grounding sources — empty array if none retrieved
          sources: Array.isArray(data.guidance.sources) ? data.guidance.sources : [],
        });
        const srcCount = data.guidance.sources?.length || 0;
        showToast(srcCount > 0 ? `Gemini AI guidance grounded with ${srcCount} source(s).` : 'Gemini AI guidance generated.');
      } else if (data.error === 'NO_GROUNDING_EVIDENCE') {
        setActiveGuidance(null);
        setFallbackWarning(
          'No medical evidence could be retrieved for this query. This query could not be safely grounded. Contact emergency medical services directly.'
        );
        showToast('Contact emergency medical services directly.');
      } else {
        setActiveGuidance(null);
        setFallbackWarning(
          data.message || 'AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.'
        );
        showToast('Contact emergency medical services if needed.');
      }
    } catch (err) {
      console.error('[HealthBridge Emergency Quick Assist Client Error]:', err);
      setActiveGuidance(null);
      setFallbackWarning('AI emergency assistance is temporarily unavailable. Contact emergency medical services if needed.');
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-red-200 dark:border-red-900/50 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-4 sm:p-5 text-white text-center relative shrink-0">
          <button
            onClick={cancelSos}
            className="absolute top-3.5 right-3.5 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
            aria-label="Cancel Emergency"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto mb-2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/10 animate-pulse">
            <AlertOctagon className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-wide uppercase">
            {t(language, 'emergencySos')}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-red-100 mt-0.5 font-medium">
            Real-Time Medical Safety & Emergency Assistance Active
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
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
              {/* Emergency Call Actions - High Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 text-white font-black py-3.5 px-4 shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all text-sm active:scale-95"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Call 112 / 108</span>
                </a>
                <a
                  href={`tel:${primaryContact?.phone || '112'}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-teal-600 text-white font-bold py-3.5 px-4 shadow hover:bg-slate-800 transition-all text-sm active:scale-95"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Call {primaryContact?.name.split(' ')[0] || 'Contact'}</span>
                </a>
              </div>

              {/* Emergency Quick Assist Input */}
              <div className="rounded-2xl bg-red-50/70 dark:bg-red-950/30 p-3.5 sm:p-4 border border-red-200 dark:border-red-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <Zap className="h-4 w-4" /> Emergency Quick Assist
                  </span>
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-300">
                    Gemini AI Grounded Assist
                  </span>
                </div>

                <form onSubmit={handleQuickAssistSubmit} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                    What happened?
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="e.g. legs broken, snake bit my hand"
                      disabled={isLoadingGuidance}
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 shadow-sm disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!quickInput.trim() || isLoadingGuidance}
                      className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-black shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
                    >
                      {isLoadingGuidance ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating AI...</span>
                        </>
                      ) : (
                        <span>Get Guidance</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Loading Indicator */}
              {isLoadingGuidance && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-900/50 flex items-center gap-3 text-xs font-semibold text-amber-800 dark:text-amber-300 animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                  <span>Gemini AI is analyzing your stated emergency...</span>
                </div>
              )}

              {/* 1. Critical Safety Escalation Banner */}
              {safetyEscalation?.isCriticalEscalation && (
                <div className="rounded-2xl bg-red-600 text-white p-4 shadow-xl border border-red-500 space-y-2">
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-300">
                    <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0" />
                    <span>{safetyEscalation.headline}</span>
                  </div>
                  <p className="text-xs font-bold leading-relaxed">
                    {safetyEscalation.recommendedAction}
                  </p>
                </div>
              )}

              {/* 2. Fallback Warning on API Failure */}
              {fallbackWarning && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-4 border border-amber-300 dark:border-amber-900/50 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-extrabold text-amber-800 dark:text-amber-300">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Emergency Safety Notice</span>
                  </div>
                  <p className="text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
                    {fallbackWarning}
                  </p>
                </div>
              )}

              {/* 3. Real Dynamic Gemini Emergency Guidance Card */}
              {activeGuidance && (
                <div className="rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-5 border-2 border-red-500 shadow-xl space-y-4 text-xs anim-fade-in">
                  {/* Title + Urgency Badge */}
                  <div className="border-b border-red-100 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      {activeGuidance.problem && (
                        <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 tracking-wider flex-1 block">
                          {activeGuidance.problem}
                        </span>
                      )}
                      {activeGuidance.urgency && (
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0 ${
                          activeGuidance.urgency === 'emergency'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : activeGuidance.urgency === 'urgent'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {activeGuidance.urgency}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-[#0D1B2A] dark:text-white mt-1">
                      {activeGuidance.headline}
                    </h3>
                  </div>

                  {/* Seek Emergency Care Banner — only shown if Gemini assessed it as needed */}
                  {activeGuidance.seekEmergencyCare && (
                    <a
                      href="tel:112"
                      className="flex items-center justify-between p-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 shrink-0" /> Call 112 / 108 Emergency Services Immediately
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </a>
                  )}

                  {/* Immediate Actions */}
                  {activeGuidance.immediateActions && activeGuidance.immediateActions.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-extrabold text-slate-900 dark:text-white block uppercase text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Immediate Precautions (Do This Now)
                      </span>
                      <ul className="space-y-1.5 text-slate-800 dark:text-slate-200 font-semibold pl-1">
                        {activeGuidance.immediateActions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What NOT to do */}
                  {activeGuidance.avoid && activeGuidance.avoid.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-1.5">
                      <span className="font-extrabold text-red-700 dark:text-red-400 uppercase text-[11px] flex items-center gap-1.5">
                        <Ban className="w-4 h-4 text-red-600 shrink-0" /> Do NOT (Dangerous Practices to Avoid)
                      </span>
                      <ul className="space-y-1 text-red-950 dark:text-red-200 font-semibold list-disc list-inside">
                        {activeGuidance.avoid.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warning Signs */}
                  {activeGuidance.warningSigns && activeGuidance.warningSigns.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-extrabold text-amber-700 dark:text-amber-400 block uppercase text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Watch For Warning Signs
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 font-semibold pl-1">
                        {activeGuidance.warningSigns.join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Genuine Grounding Sources — only shown when Gemini actually returned them */}
                  {activeGuidance.sources && activeGuidance.sources.length > 0 ? (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 font-medium space-y-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Grounding Sources ({activeGuidance.sources.length}):
                      </span>
                      {activeGuidance.sources.map((src, idx) => (
                        <p key={idx} className="italic text-slate-600 dark:text-slate-400">
                          • {src.title}{' '}
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline text-teal-600 dark:text-teal-400 ml-1"
                            >
                              [Link]
                            </a>
                          )}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 italic pt-1 border-t border-slate-100 dark:border-slate-700">
                      No grounding sources were returned for this query.
                    </p>
                  )}
                </div>
              )}

              {/* Live Location Card */}
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
                    const shareText = `Emergency SOS for ${activeProfile.name}! Location: https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}`;
                    if (navigator.share) {
                      navigator.share({
                        title: 'EMERGENCY SOS - HealthBridge AI',
                        text: shareText,
                      }).catch(() => {
                        navigator.clipboard.writeText(shareText);
                        showToast('Emergency location link copied to clipboard!');
                      });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      showToast('Emergency location link copied to clipboard!');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-teal-700 dark:text-cyan-400 font-semibold hover:underline mt-1 active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" /> {t(language, 'shareLocation')}
                </button>
              </div>

              {/* Emergency Medical Card */}
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
