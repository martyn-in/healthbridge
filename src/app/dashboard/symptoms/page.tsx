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
  Info,
  User,
  HelpCircle,
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
    }, 1000);
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
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <Stethoscope className="h-3.5 w-3.5" /> Clinical Triage Protocol
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Symptom Assessment & Guidance
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Evaluated for patient <span className="font-bold text-teal-400">{activeProfile.name}</span>. Receive preliminary clinical guidance, severity grading, and next steps.
          </p>
        </div>

        {/* Profile Selector */}
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Record:</span>
          <select
            value={activeProfile.id}
            onChange={(e) => {
              const p = profiles.find((prof) => prof.id === e.target.value);
              if (p) setActiveProfile(p);
            }}
            className="bg-slate-900 text-white font-bold py-1 px-2.5 rounded-lg border border-slate-700 outline-none text-xs"
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
        <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold text-slate-500 py-2">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>1</span>
            <span>Symptoms</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>2</span>
            <span>Severity & Region</span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600 dark:text-teal-400 font-bold' : ''}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}>3</span>
            <span>Clinical Context</span>
          </div>
        </div>
      )}

      {/* Step 1: Main Concern */}
      {step === 1 && (
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. What is the primary concern for {activeProfile.name}?
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Describe symptoms or onset of discomfort:
            </label>
            <textarea
              rows={3}
              value={mainConcern}
              onChange={(e) => setMainConcern(e.target.value)}
              placeholder="e.g. Persistent dry throat, mild headache, and fatigue for 2 days..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 p-4 text-xs font-medium text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">
              Common Presets (Click to evaluate):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMainConcern('Mild throat discomfort and dry cough')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              >
                Mild Throat Irritation
              </button>
              <button
                onClick={() => setMainConcern('Moderate stomach cramping after meals for 3 days')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
              >
                Stomach Cramping
              </button>
              <button
                onClick={() => {
                  setMainConcern('Sudden severe crushing chest pain radiating to left arm');
                  setSeverity('Severe');
                  setSelectedBodyArea('Chest / Heart');
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800/60 hover:bg-red-100"
              >
                Chest Discomfort (Emergency Check)
              </button>
            </div>
          </div>

          <button
            disabled={!mainConcern.trim()}
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-xl bg-teal-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue to Severity & Body Area</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Step 2: Body Area & Severity */}
      {step === 2 && (
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Affected Anatomical Region & Severity
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Select Primary Region:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {bodyAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedBodyArea(area)}
                  className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                    selectedBodyArea === area
                      ? 'bg-teal-600 text-white border-teal-700'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

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
                          ? 'bg-amber-600 text-white border-amber-700'
                          : 'bg-teal-600 text-white border-teal-700'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                Onset & Duration:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Less than 24 hours">Less than 24 hours</option>
                <option value="1 to 2 days">1 to 2 days</option>
                <option value="3 to 7 days">3 to 7 days</option>
                <option value="More than a week">More than a week</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Associated Symptoms (Select all applicable):
            </label>
            <div className="flex flex-wrap gap-2">
              {commonAssociated.map((sym) => (
                <button
                  key={sym}
                  onClick={() => toggleAssociated(sym)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    associatedSymptoms.includes(sym)
                      ? 'bg-teal-600 text-white border-teal-700 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {associatedSymptoms.includes(sym) ? '✓ ' : '+ '} {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
            >
              Next: Clinical Questions
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Adaptive Questions */}
      {step === 3 && (
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Targeted Assessment Questions ({selectedBodyArea})
          </h2>
          <p className="text-xs text-slate-500">
            Triage algorithm generated context questions for targeted evaluation:
          </p>

          <div className="space-y-4">
            {adaptiveQuestions.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Q{idx + 1}: {q}
                </label>
                <div className="flex gap-2">
                  {['Yes', 'No', 'Unsure'].map((ans) => (
                    <button
                      key={ans}
                      onClick={() => setAdaptiveAnswers({ ...adaptiveAnswers, [q]: ans })}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        adaptiveAnswers[q] === ans
                          ? 'bg-teal-600 text-white border-teal-700'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
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
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleRunAssessment}
              disabled={isGenerating}
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <span>Generating Triage Summary...</span>
              ) : (
                <span>Complete Triage Evaluation</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Assessment Result Screen */}
      {step === 4 && assessmentResult && (
        <div className="space-y-6">
          {/* Urgency Badge Header */}
          <div
            className={`rounded-xl p-6 text-white shadow-sm border ${
              assessmentResult.urgency === 'urgent_care'
                ? 'bg-red-900/90 border-red-700'
                : assessmentResult.urgency === 'routine_care'
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/10 p-2.5 text-white">
                {assessmentResult.urgency === 'urgent_care' ? (
                  <ShieldAlert className="h-6 w-6 text-red-400" />
                ) : (
                  <Activity className="h-6 w-6 text-teal-400" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Triage Classification
                </span>
                <h2 className="text-xl font-bold">{assessmentResult.urgencyTitle}</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Recommended Specialist: <span className="font-semibold text-white">{assessmentResult.recommendedDoctorType}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview & Reasoning */}
            <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Assessment Summary & Reasoning
              </h3>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {assessmentResult.summary}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Possible General Explanations:
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

            {/* Next Steps & Red Flags */}
            <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Recommended Action Protocol
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {assessmentResult.nextSteps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                    <span className="font-bold text-teal-600">{i + 1}.</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Warning Red Flags to Monitor:
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
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => router.push('/dashboard/care')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
              >
                <MapPin className="h-3.5 w-3.5" /> Locate Nearby Hospitals
              </button>
              <button
                onClick={() => router.push('/dashboard/appointments')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800"
              >
                <Calendar className="h-3.5 w-3.5" /> Book Consultation
              </button>
              {assessmentResult.urgency === 'urgent_care' && (
                <button
                  onClick={triggerSos}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  <ShieldAlert className="h-3.5 w-3.5" /> Trigger SOS Protocol
                </button>
              )}
            </div>

            <button
              onClick={resetForm}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" /> New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

