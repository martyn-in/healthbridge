'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { evaluateSymptomTriage, generateAdaptiveQuestions } from '@/services/aiService';
import { SymptomAssessment } from '@/types';
export default function SymptomsPage() {
  const { activeProfile, addAssessment, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [mainConcern, setMainConcern] = useState<string>('');
  const [selectedBodyArea, setSelectedBodyArea] = useState<string>('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [duration, setDuration] = useState<string>('');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [adaptiveAnswers, setAdaptiveAnswers] = useState<Record<string, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<SymptomAssessment | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const bodyAreas = [
    'Chest / Heart', 'Head / Brain', 'Stomach / Abdomen',
    'Throat & Respiratory', 'Skin & Allergy', 'Joints & Muscles',
  ];

  const commonAssociated = [
    'Fever or Chills', 'Shortness of Breath', 'Nausea / Vomiting',
    'Dizziness or Lightheadedness', 'Fatigue / Body Ache', 'Sweating',
  ];

  const toggleAssociated = (symptom: string) => {
    setAssociatedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const adaptiveQuestions = selectedBodyArea ? generateAdaptiveQuestions(mainConcern, selectedBodyArea) : [];

  const handleRunAssessment = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const assessment = evaluateSymptomTriage({
        profileId: activeProfile.id,
        profileName: activeProfile.name,
        mainConcern,
        bodyArea: selectedBodyArea || 'General',
        duration: duration || '1-2 days',
        severity,
        associatedSymptoms,
      });

      setAssessmentResult(assessment);
      addAssessment(assessment);
      showToast('Symptom assessment saved!');
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
    <div className="space-y-8 font-sans pb-10">
      {/* Hero Header */}
      <div 
        className="p-6 rounded-3xl frosted-card relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)]"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm bg-[#6E56CF]/15 text-[#6E56CF]">
              <Stethoscope className="h-3.5 w-3.5" /> Clinical Triage Protocol
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
              Symptom Assessment
            </h1>
            <p className="text-sm font-medium leading-relaxed text-[var(--text-secondary)] max-w-xl">
              Symptom evaluation for <span className="font-bold text-[var(--text-primary)] bg-[var(--accent-lavender)] px-2 py-0.5 rounded-md shadow-sm">{activeProfile.name}</span>. Receive preliminary clinical guidance, severity grading, and next steps.
            </p>
          </div>
          
          <div className="w-20 h-20 shrink-0 rounded-2xl bg-[var(--accent-lavender)] shadow-sm flex items-center justify-center border border-[var(--border-subtle)] text-[#6E56CF]">
            <Activity className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Progress Wizard Steps Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-sm font-bold text-[var(--text-secondary)] py-2 anim-fade-up">
          <div className="flex items-center gap-2">
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm transition-all"
              style={{
                backgroundColor: step >= 1 ? '#6E56CF' : 'var(--bg-card-subtle)',
                color: step >= 1 ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              1
            </span>
            <span style={{ color: step >= 1 ? '#6E56CF' : 'var(--text-secondary)' }}>Symptoms</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 rounded-full bg-[var(--border-subtle)]">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: step >= 2 ? '100%' : '0%', backgroundColor: '#6E56CF' }} />
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm transition-all"
              style={{
                backgroundColor: step >= 2 ? '#6E56CF' : 'var(--bg-card-subtle)',
                color: step >= 2 ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              2
            </span>
            <span style={{ color: step >= 2 ? '#6E56CF' : 'var(--text-secondary)' }}>Severity</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 rounded-full bg-[var(--border-subtle)]">
             <div className="h-full rounded-full transition-all duration-500" style={{ width: step >= 3 ? '100%' : '0%', backgroundColor: '#6E56CF' }} />
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm transition-all"
              style={{
                backgroundColor: step >= 3 ? '#6E56CF' : 'var(--bg-card-subtle)',
                color: step >= 3 ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              3
            </span>
            <span style={{ color: step >= 3 ? '#6E56CF' : 'var(--text-secondary)' }}>Context</span>
          </div>
        </div>
      )}

      {/* Step 1: Main Concern */}
      {step === 1 && (
        <div className="neu-card p-8 rounded-3xl space-y-6 anim-fade-up bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full bg-[#6E56CF]"></div>
            What is the primary concern for {activeProfile.name}?
          </h2>

          <div>
            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
              Describe symptoms or onset of discomfort:
            </label>
            <textarea
              rows={4}
              value={mainConcern}
              onChange={(e) => setMainConcern(e.target.value)}
              placeholder="e.g. Persistent dry throat, mild headache, and fatigue for 2 days..."
              className="w-full rounded-2xl bg-[var(--bg-card-subtle)] p-5 text-sm font-medium text-[var(--text-primary)] border border-[var(--border-subtle)] outline-none focus:ring-2 focus:ring-[#6E56CF] resize-none transition-all placeholder-[var(--text-muted)]"
            />
          </div>

          <div>
            <span className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider block mb-3">
              Common Presets
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMainConcern('Mild throat discomfort and dry cough')}
                className="pill-btn pill-btn-ghost shadow-sm bg-[var(--accent-lavender)] text-[var(--accent-purple)] hover:brightness-105 transition-all card-lift"
              >
                Mild Throat Irritation
              </button>
              <button
                onClick={() => setMainConcern('Moderate stomach cramping after meals for 3 days')}
                className="pill-btn pill-btn-ghost shadow-sm bg-[var(--accent-lavender)] text-[var(--accent-purple)] hover:brightness-105 transition-all card-lift"
              >
                Stomach Cramping
              </button>
              <button
                onClick={() => {
                  setMainConcern('Sudden severe crushing chest pain radiating to left arm');
                  setSeverity('Severe');
                  setSelectedBodyArea('Chest / Heart');
                }}
                className="pill-btn font-bold transition-all card-lift bg-rose-600 text-white shadow-md"
              >
                <AlertTriangle className="w-4 h-4 mr-1 inline" /> Emergency Check
              </button>
            </div>
          </div>

          <button
            disabled={!mainConcern.trim()}
            onClick={() => setStep(2)}
            className="w-full pill-btn pill-btn-primary py-4 text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 mt-4 card-lift disabled:opacity-50"
          >
            <span>Continue to Severity & Region</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Step 2: Body Area & Severity */}
      {step === 2 && (
        <div className="neu-card p-8 rounded-3xl space-y-8 anim-fade-up bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full bg-[#6E56CF]"></div>
            Affected Anatomical Region & Severity
          </h2>

          <div>
            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
              Select Primary Region:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {bodyAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedBodyArea(area)}
                  className={`p-4 rounded-2xl text-sm font-bold text-left transition-all card-lift flex items-center gap-2 border border-[var(--border-subtle)] ${
                    selectedBodyArea === area
                      ? 'bg-[#6E56CF] text-white shadow-md'
                      : 'bg-[var(--bg-card-subtle)] text-[var(--text-primary)] hover:border-[#6E56CF]'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${selectedBodyArea === area ? 'bg-white' : 'bg-transparent'}`} />
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
                Severity Level:
              </label>
              <div className="flex gap-3 bg-[var(--bg-card-subtle)] p-1.5 rounded-full border border-[var(--border-subtle)]">
                {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => {
                  let activeColor = '#6E56CF';
                  if (sev === 'Moderate') activeColor = '#FF9500';
                  if (sev === 'Severe') activeColor = '#FF3366';
                  
                  return (
                    <button
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all ${
                        severity === sev ? 'shadow-md text-white' : 'text-[var(--text-secondary)]'
                      }`}
                      style={{
                        backgroundColor: severity === sev ? activeColor : 'transparent',
                      }}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
                Onset & Duration:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[#6E56CF] appearance-none transition-all"
              >
                <option value="">-- Select Onset Duration --</option>
                <option value="Less than 24 hours">Less than 24 hours</option>
                <option value="1 to 2 days">1 to 2 days</option>
                <option value="3 to 7 days">3 to 7 days</option>
                <option value="More than a week">More than a week</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-3">
              Associated Symptoms (Select all applicable):
            </label>
            <div className="flex flex-wrap gap-3">
              {commonAssociated.map((sym) => {
                const isActive = associatedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleAssociated(sym)}
                    className={`pill-btn text-xs font-bold transition-all card-lift border border-[var(--border-subtle)] ${
                      isActive ? 'bg-[#6E56CF] text-white shadow-md' : 'bg-[var(--bg-card-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    {isActive ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : <span className="mr-1 text-[var(--text-secondary)]">+</span>} {sym}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-4 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-bold transition-all card-lift"
            >
              Back
            </button>
            <button
              disabled={!selectedBodyArea || !severity || !duration}
              onClick={() => setStep(3)}
              className="flex-1 pill-btn pill-btn-primary py-4 text-sm font-black shadow-lg transition-all card-lift disabled:opacity-40"
            >
              Next: Clinical Context
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Adaptive Questions */}
      {step === 3 && (
        <div className="neu-card p-8 rounded-3xl space-y-6 anim-fade-up bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <h2 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full bg-[#6E56CF]"></div>
            Targeted Assessment ({selectedBodyArea})
          </h2>

          <div className="space-y-4">
            {adaptiveQuestions.map((q, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] space-y-3 transition-all">
                <label className="text-sm font-bold text-[var(--text-primary)] block leading-relaxed">
                  <span className="mr-1 font-black text-[#6E56CF]">Q{idx + 1}.</span> {q}
                </label>
                <div className="flex gap-3">
                  {['Yes', 'No', 'Unsure'].map((ans) => {
                    const isActive = adaptiveAnswers[q] === ans;
                    return (
                      <button
                        key={ans}
                        onClick={() => setAdaptiveAnswers({ ...adaptiveAnswers, [q]: ans })}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all border border-[var(--border-subtle)] ${
                          isActive ? 'bg-[#6E56CF] text-white shadow-md' : 'bg-[var(--bg-card)] text-[var(--text-primary)]'
                        }`}
                      >
                        {ans}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-4 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-bold transition-all card-lift"
            >
              Back
            </button>
            <button
              onClick={handleRunAssessment}
              disabled={isGenerating}
              className="flex-1 pill-btn pill-btn-primary py-4 text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 card-lift disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Context...</span>
                </>
              ) : (
                <span>Complete Triage Evaluation</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Assessment Result Screen */}
      {step === 4 && assessmentResult && (
        <div className="space-y-6 anim-fade-up">
          <div
            className="rounded-3xl p-8 text-white shadow-lg relative overflow-hidden"
            style={{ 
              backgroundColor: assessmentResult.urgency === 'urgent_care' ? '#FF3366' : '#6E56CF',
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)'
            }}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="rounded-2xl bg-white/20 p-4 text-white backdrop-blur-md shadow-sm border border-white/20">
                {assessmentResult.urgency === 'urgent_care' ? (
                  <ShieldAlert className="h-8 w-8 text-white" />
                ) : (
                  <Activity className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-white/80">Triage Classification</span>
                <h2 className="text-2xl font-black text-white">{assessmentResult.urgencyTitle}</h2>
              </div>
            </div>
          </div>

          <div className="frosted-card rounded-3xl p-8 space-y-6 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Clinical Summary</h3>
            <p className="text-sm font-medium leading-relaxed text-[var(--text-secondary)] p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
              {assessmentResult.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Possible Considerations</h4>
                <ul className="space-y-2">
                  {assessmentResult.possibleCauses.map((cause, i) => (
                    <li key={i} className="text-xs font-bold p-3 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]" />
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">Recommended Next Steps</h4>
                <ul className="space-y-2">
                  {assessmentResult.nextSteps.map((stepItem, i) => (
                    <li key={i} className="text-xs font-bold p-3 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-[#6E56CF] shrink-0" />
                      {stepItem}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-[var(--border-subtle)]">
              <button
                onClick={resetForm}
                className="pill-btn pill-btn-ghost flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Start New Assessment
              </button>

              <div className="text-xs font-bold text-[var(--text-secondary)]">
                Recommended Specialist: <span className="text-[#6E56CF]">{assessmentResult.recommendedDoctorType}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
