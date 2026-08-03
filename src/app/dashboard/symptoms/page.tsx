'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  MapPin,
  Calendar,
  ShieldAlert,
  Sparkles,
  Info,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { evaluateSymptomTriage, generateAdaptiveQuestions } from '@/services/aiService';
import { SymptomAssessment } from '@/types';
import { useRouter } from 'next/navigation';

export default function SymptomsPage() {
  const { activeProfile, profiles, setActiveProfile, addAssessment, triggerSos } = useApp();
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [mainConcern, setMainConcern] = useState<string>('');
  const [selectedBodyArea, setSelectedBodyArea] = useState<string>('Head / Throat');
  const [duration, setDuration] = useState<string>('1 to 2 days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [adaptiveAnswers, setAdaptiveAnswers] = useState<Record<string, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<SymptomAssessment | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const bodyAreas = [
    'Head / Throat',
    'Chest / Heart',
    'Stomach / Abdomen',
    'Back / Joints / Limbs',
    'Skin / Rash',
    'General Fatigue / Fever',
  ];

  const commonAssociated = [
    'Mild Fever',
    'Fatigue',
    'Headache',
    'Nausea',
    'Cough',
    'Body Ache',
    'Loss of Appetite',
    'Nasal Congestion',
  ];

  const adaptiveQuestions = generateAdaptiveQuestions(mainConcern, selectedBodyArea);

  const toggleAssociated = (sym: string) => {
    setAssociatedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleRunAssessment = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = evaluateSymptomTriage({
        profileId: activeProfile.id,
        profileName: activeProfile.name,
        mainConcern,
        bodyArea: selectedBodyArea,
        duration,
        severity,
        associatedSymptoms,
        additionalNotes: Object.values(adaptiveAnswers).join(' '),
      });
      setAssessmentResult(result);
      addAssessment(result);
      setIsGenerating(false);
      setStep(4);
    }, 1200);
  };

  const resetForm = () => {
    setStep(1);
    setMainConcern('');
    setAssociatedSymptoms([]);
    setAdaptiveAnswers({});
    setAssessmentResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-premium border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[80px] pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-300 uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-cyan-400" /> Flagship Workflow #1
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            AI-Guided Symptom Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Interactive clinical evaluation for <span className="font-bold text-teal-300">{activeProfile.name}</span>. Receive preliminary health guidance, urgency classification, and safe next steps.
          </p>
        </div>

        <div className="z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assessing for:</span>
          <select
            value={activeProfile.id}
            onChange={(e) => {
              const selected = profiles.find((p) => p.id === e.target.value);
              if (selected) setActiveProfile(selected);
            }}
            className="bg-slate-950 text-xs font-bold text-teal-300 border border-teal-500/30 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.relationship})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Wizard Steps Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-bold text-slate-500 py-2">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-cyan-400 font-extrabold' : ''}`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold shadow-sm ${step >= 1 ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-glow' : 'bg-slate-800 text-slate-400'}`}>1</span>
            <span>Symptoms</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-600" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-cyan-400 font-extrabold' : ''}`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold shadow-sm ${step >= 2 ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-glow' : 'bg-slate-800 text-slate-400'}`}>2</span>
            <span>Severity & Area</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-600" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-cyan-400 font-extrabold' : ''}`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold shadow-sm ${step >= 3 ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-glow' : 'bg-slate-800 text-slate-400'}`}>3</span>
            <span>Questions</span>
          </div>
        </div>
      )}

      {/* Wizard Form Containers */}
      {step === 1 && (
        <div className="rounded-3xl bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>1. What is the primary concern for</span>
            <span className="text-teal-400 font-extrabold">{activeProfile.name}?</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Describe your main symptoms or discomfort:
            </label>
            <textarea
              rows={3}
              value={mainConcern}
              onChange={(e) => setMainConcern(e.target.value)}
              placeholder="e.g. Mild persistent dry cough, scratchy throat, and slight headache since yesterday..."
              className="w-full rounded-2xl bg-slate-950/80 p-4 text-sm text-white border border-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            disabled={!mainConcern.trim()}
            onClick={() => setStep(2)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-glow hover:shadow-glow-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Severity & Area</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Body Area & Severity Selection
          </h2>

          {/* Body Area Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Affected Body Area:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {bodyAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedBodyArea(area)}
                  className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                    selectedBodyArea === area
                      ? 'bg-teal-500 text-white border-teal-600 shadow'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Severity & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Severity Level:
              </label>
              <div className="flex gap-2">
                {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      severity === sev
                        ? sev === 'Severe'
                          ? 'bg-red-600 text-white border-red-700'
                          : sev === 'Moderate'
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-teal-600 text-white border-teal-700'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Duration:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Less than 24 hours">Less than 24 hours</option>
                <option value="1 to 2 days">1 to 2 days</option>
                <option value="3 to 7 days">3 to 7 days</option>
                <option value="More than a week">More than a week</option>
              </select>
            </div>
          </div>

          {/* Associated Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Associated Symptoms (Select all that apply):
            </label>
            <div className="flex flex-wrap gap-2">
              {commonAssociated.map((sym) => (
                <button
                  key={sym}
                  onClick={() => toggleAssociated(sym)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    associatedSymptoms.includes(sym)
                      ? 'bg-teal-600 text-white border-teal-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {associatedSymptoms.includes(sym) ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="font-bold text-xs">+</span>
                  )}
                  <span>{sym}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
            >
              Next: Adaptive Questions
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Adaptive Clinical Context Questions
          </h2>
          <p className="text-xs text-slate-500">
            AI Triage algorithm generates custom questions based on affected body area ({selectedBodyArea}).
          </p>

          <div className="space-y-4">
            {adaptiveQuestions.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Q{idx + 1}: {q}
                </label>
                <div className="flex gap-2">
                  {['Yes', 'No', 'Unsure'].map((ans) => (
                    <button
                      key={ans}
                      onClick={() => setAdaptiveAnswers({ ...adaptiveAnswers, [q]: ans })}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        adaptiveAnswers[q] === ans
                          ? 'bg-teal-600 text-white border-teal-700'
                          : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleRunAssessment}
              disabled={isGenerating}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-navy-700 text-white font-bold text-sm shadow-lg hover:from-teal-700 hover:to-navy-800 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <span>Generating Triage Guidance...</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  <span>Generate Preliminary Guidance</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Assessment Result Screen */}
      {step === 4 && assessmentResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Urgency Badge Header */}
          <div
            className={`rounded-2xl p-6 text-white shadow-xl border ${
              assessmentResult.urgency === 'urgent_care'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 border-red-500'
                : assessmentResult.urgency === 'routine_care'
                ? 'bg-gradient-to-r from-amber-600 to-orange-700 border-amber-500'
                : 'bg-gradient-to-r from-teal-700 to-navy-800 border-teal-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-3">
                {assessmentResult.urgency === 'urgent_care' ? (
                  <ShieldAlert className="h-8 w-8 text-white" />
                ) : (
                  <Activity className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold opacity-90">
                  Triage Classification
                </span>
                <h2 className="text-2xl font-black">{assessmentResult.urgencyTitle}</h2>
                <p className="text-xs text-white/90 mt-0.5">
                  Recommended Specialist: <span className="font-bold underline">{assessmentResult.recommendedDoctorType}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview & Reasoning */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-600" /> Clinical Reasoning & Assessment
              </h3>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {assessmentResult.summary}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Possible General Explanations (Not a final diagnosis):
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {assessmentResult.possibleCauses.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safe Next Steps & Urgent Red Flags */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> General Next Steps
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {assessmentResult.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-teal-600">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Watch For These Warning Red Flags:
                </span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {assessmentResult.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-500">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => router.push('/dashboard/care')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700"
              >
                <MapPin className="h-4 w-4" /> Find Nearby Clinics
              </button>
              <button
                onClick={() => router.push('/dashboard/appointments')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-700 text-white text-xs font-bold shadow hover:bg-navy-800"
              >
                <Calendar className="h-4 w-4" /> Book Consultation
              </button>
              {assessmentResult.urgency === 'urgent_care' && (
                <button
                  onClick={triggerSos}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow animate-pulse"
                >
                  <ShieldAlert className="h-4 w-4" /> Trigger Emergency SOS
                </button>
              )}
            </div>

            <button
              onClick={resetForm}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300"
            >
              <RotateCcw className="h-4 w-4" /> Start New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
