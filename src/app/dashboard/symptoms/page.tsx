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
  Heart,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { evaluateSymptomTriage, generateAdaptiveQuestions } from '@/services/aiService';
import { SymptomAssessment } from '@/types';
import { useRouter } from 'next/navigation';
import { Card3D } from '@/components/3d/Card3D';

export default function SymptomsPage() {
  const { activeProfile, profiles, setActiveProfile, addAssessment, triggerSos } = useApp();
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [mainConcern, setMainConcern] = useState<string>('');
  const [selectedBodyArea, setSelectedBodyArea] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe' | ''>('');
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
        severity: (severity || 'Mild') as 'Mild' | 'Moderate' | 'Severe',
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
    <div className="space-y-8 font-sans pb-10">
      {/* Hero Header */}
      <Card3D depth={10}>
        <div 
          className="p-6 rounded-3xl frosted-card relative overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(0, 102, 255, 0.05), transparent 60%)' }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0066FF' }}>
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 text-[11px] font-bold shadow-sm backdrop-blur-md" style={{ color: '#0066FF' }}>
                <Stethoscope className="h-3.5 w-3.5" /> Clinical Triage Protocol
              </div>
              <h1 className="text-3xl font-black text-primary tracking-tight">
                Symptom Assessment
              </h1>
              <p className="text-sm font-medium text-muted max-w-xl leading-relaxed">
                Symptom evaluation for <span className="font-bold text-primary bg-white/60 px-2 py-0.5 rounded-md shadow-sm">{activeProfile.name}</span>. Receive preliminary clinical guidance, severity grading, and next steps.
              </p>
            </div>
            
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-white/60 shadow-sm flex items-center justify-center border border-white/50 backdrop-blur-sm">
              <Activity className="h-10 w-10" style={{ color: '#0066FF' }} />
            </div>
          </div>
        </div>
      </Card3D>

      {/* Progress Wizard Steps Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-sm font-bold text-muted py-2 anim-fade-up">
          <div className="flex items-center gap-2">
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm transition-all"
              style={{
                backgroundColor: step >= 1 ? '#0066FF' : '#E2E8F0',
                color: step >= 1 ? '#FFFFFF' : '#9BAABF'
              }}
            >
              1
            </span>
            <span style={{ color: step >= 1 ? '#0066FF' : '#9BAABF' }}>Symptoms</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 rounded-full bg-black/5">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: step >= 2 ? '100%' : '0%', backgroundColor: '#0066FF' }} />
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm transition-all"
              style={{
                backgroundColor: step >= 2 ? '#0066FF' : '#E2E8F0',
                color: step >= 2 ? '#FFFFFF' : '#9BAABF'
              }}
            >
              2
            </span>
            <span style={{ color: step >= 2 ? '#0066FF' : '#9BAABF' }}>Severity</span>
          </div>
          <div className="h-0.5 w-8 sm:w-16 rounded-full bg-black/5">
             <div className="h-full rounded-full transition-all duration-500" style={{ width: step >= 3 ? '100%' : '0%', backgroundColor: '#0066FF' }} />
          </div>
          <div className="flex items-center gap-2">
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-sm transition-all"
              style={{
                backgroundColor: step >= 3 ? '#0066FF' : '#E2E8F0',
                color: step >= 3 ? '#FFFFFF' : '#9BAABF'
              }}
            >
              3
            </span>
            <span style={{ color: step >= 3 ? '#0066FF' : '#9BAABF' }}>Context</span>
          </div>
        </div>
      )}

      {/* Step 1: Main Concern */}
      {step === 1 && (
        <div className="neu-card p-8 rounded-3xl space-y-6 anim-fade-up">
          <h2 className="text-lg font-black text-primary flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: '#0066FF' }}></div>
            What is the primary concern for {activeProfile.name}?
          </h2>

          <div>
            <label className="block text-sm font-bold text-muted mb-3">
              Describe symptoms or onset of discomfort:
            </label>
            <textarea
              rows={4}
              value={mainConcern}
              onChange={(e) => setMainConcern(e.target.value)}
              placeholder="e.g. Persistent dry throat, mild headache, and fatigue for 2 days..."
              className="w-full rounded-2xl bg-black/5 p-5 text-sm font-medium text-primary border-0 outline-none focus:ring-2 shadow-inner resize-none transition-all"
              style={{ boxShadow: 'inset 2px 2px 5px rgba(166,180,200,0.5), inset -3px -3px 7px rgba(255,255,255,0.7)' }}
            />
          </div>

          <div>
            <span className="text-xs font-extrabold text-muted uppercase tracking-wider block mb-3">
              Common Presets
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMainConcern('Mild throat discomfort and dry cough')}
                className="pill-btn pill-btn-ghost shadow-sm bg-white hover:bg-slate-50 transition-all card-lift"
              >
                Mild Throat Irritation
              </button>
              <button
                onClick={() => setMainConcern('Moderate stomach cramping after meals for 3 days')}
                className="pill-btn pill-btn-ghost shadow-sm bg-white hover:bg-slate-50 transition-all card-lift"
              >
                Stomach Cramping
              </button>
              <button
                onClick={() => {
                  setMainConcern('Sudden severe crushing chest pain radiating to left arm');
                  setSeverity('Severe');
                  setSelectedBodyArea('Chest / Heart');
                }}
                className="pill-btn font-bold transition-all card-lift"
                style={{ backgroundColor: '#FF3366', color: 'white', boxShadow: '0 4px 10px rgba(255,51,102,0.3)' }}
              >
                <AlertTriangle className="w-4 h-4 mr-1 inline" /> Emergency Check
              </button>
            </div>
          </div>

          <button
            disabled={!mainConcern.trim()}
            onClick={() => setStep(2)}
            className="w-full pill-btn pill-btn-primary py-4 text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 mt-4 card-lift disabled:opacity-50 disabled:transform-none"
            style={{ backgroundColor: '#0066FF' }}
          >
            <span>Continue to Severity & Region</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Step 2: Body Area & Severity */}
      {step === 2 && (
        <div className="neu-card p-8 rounded-3xl space-y-8 anim-fade-up">
          <h2 className="text-lg font-black text-primary flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: '#0066FF' }}></div>
            Affected Anatomical Region & Severity
          </h2>

          <div>
            <label className="block text-sm font-bold text-muted mb-3">
              Select Primary Region:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {bodyAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedBodyArea(area)}
                  className={`p-4 rounded-2xl text-sm font-bold text-left transition-all card-lift flex items-center gap-2 ${
                    selectedBodyArea === area
                      ? 'shadow-md'
                      : 'bg-white shadow-sm hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedBodyArea === area ? '#0066FF' : 'rgba(255,255,255,0.8)',
                    color: selectedBodyArea === area ? '#FFFFFF' : '#0D1B2A',
                  }}
                >
                  <div className={`w-2 h-2 rounded-full ${selectedBodyArea === area ? 'bg-white' : 'bg-transparent'}`} />
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-muted mb-3">
                Severity Level:
              </label>
              <div className="flex gap-3 bg-white/50 p-1.5 rounded-full shadow-inner border border-white/60 backdrop-blur-sm">
                {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => {
                  let activeColor = '#0066FF';
                  if (sev === 'Moderate') activeColor = '#FF9500';
                  if (sev === 'Severe') activeColor = '#FF3366';
                  
                  return (
                    <button
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all ${
                        severity === sev ? 'shadow-md' : 'hover:bg-black/5'
                      }`}
                      style={{
                        backgroundColor: severity === sev ? activeColor : 'transparent',
                        color: severity === sev ? 'white' : '#9BAABF'
                      }}
                    >
                      {sev}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted mb-3">
                Onset & Duration:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full py-3.5 px-4 rounded-2xl bg-white shadow-sm border border-white/60 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239BAABF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
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
            <label className="block text-sm font-bold text-muted mb-3">
              Associated Symptoms (Select all applicable):
            </label>
            <div className="flex flex-wrap gap-3">
              {commonAssociated.map((sym) => {
                const isActive = associatedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleAssociated(sym)}
                    className="pill-btn text-xs font-bold transition-all card-lift"
                    style={{
                      backgroundColor: isActive ? '#0066FF' : 'rgba(255,255,255,0.8)',
                      color: isActive ? '#FFFFFF' : '#0D1B2A',
                      border: isActive ? 'none' : '1px solid rgba(255,255,255,0.9)',
                      boxShadow: isActive ? '0 4px 10px rgba(0,102,255,0.25)' : '0 2px 5px rgba(166,180,200,0.15)'
                    }}
                  >
                    {isActive ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : <span className="mr-1 text-muted">+</span>} {sym}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-4 rounded-full bg-white shadow-sm hover:shadow-md text-primary text-sm font-bold transition-all card-lift"
            >
              Back
            </button>
            <button
              disabled={!selectedBodyArea || !severity || !duration}
              onClick={() => setStep(3)}
              className="flex-1 pill-btn pill-btn-primary py-4 text-sm font-black shadow-lg transition-all card-lift disabled:opacity-40 disabled:transform-none"
              style={{ backgroundColor: '#0066FF' }}
            >
              Next: Clinical Context
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Adaptive Questions */}
      {step === 3 && (
        <div className="neu-card p-8 rounded-3xl space-y-6 anim-fade-up">
          <h2 className="text-lg font-black text-primary flex items-center gap-2">
            <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: '#0066FF' }}></div>
            Targeted Assessment ({selectedBodyArea})
          </h2>

          <div className="space-y-4">
            {adaptiveQuestions.map((q, idx) => (
              <div key={idx} className="p-5 rounded-2xl frosted-card space-y-3 transition-all hover:bg-white/90">
                <label className="text-sm font-bold text-primary block leading-relaxed">
                  <span style={{ color: '#0066FF' }} className="mr-1 font-black">Q{idx + 1}.</span> {q}
                </label>
                <div className="flex gap-3">
                  {['Yes', 'No', 'Unsure'].map((ans) => {
                    const isActive = adaptiveAnswers[q] === ans;
                    return (
                      <button
                        key={ans}
                        onClick={() => setAdaptiveAnswers({ ...adaptiveAnswers, [q]: ans })}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${isActive ? 'shadow-md' : 'shadow-sm bg-white/80 hover:bg-white'}`}
                        style={{
                          backgroundColor: isActive ? '#0066FF' : '',
                          color: isActive ? 'white' : '#0D1B2A'
                        }}
                      >
                        {ans}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-4 rounded-full bg-white shadow-sm hover:shadow-md text-primary text-sm font-bold transition-all card-lift"
            >
              Back
            </button>
            <button
              onClick={handleRunAssessment}
              disabled={isGenerating}
              className="flex-1 pill-btn pill-btn-primary py-4 text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 card-lift disabled:opacity-70 disabled:transform-none"
              style={{ backgroundColor: '#0066FF' }}
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
              backgroundColor: assessmentResult.urgency === 'urgent_care' ? '#FF3366' : '#0066FF',
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)'
            }}
          >
            {/* Sparkline decoration */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
               <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
                 <path d="M0 40 Q 20 40, 40 20 T 80 40 T 120 60 T 160 40 T 200 40" stroke="white" strokeWidth="4" strokeLinecap="round" className="sparkline-path" />
               </svg>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="rounded-2xl bg-white/20 p-4 text-white backdrop-blur-md shadow-sm border border-white/20">
                {assessmentResult.urgency === 'urgent_care' ? (
                  <ShieldAlert className="h-8 w-8 text-white drop-shadow-md" />
                ) : (
                  <Activity className="h-8 w-8 text-white drop-shadow-md" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="flex h-2 w-2 relative">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                   </span>
                  <span className="text-xs uppercase tracking-widest font-black text-white/90">
                    Triage Classification
                  </span>
                </div>
                <h2 className="text-2xl font-black drop-shadow-sm">{assessmentResult.urgencyTitle}</h2>
                <p className="text-sm text-white/90 mt-1 font-medium">
                  Recommended Specialist: <span className="font-black bg-white/20 px-2 py-0.5 rounded-md">{assessmentResult.recommendedDoctorType}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="frosted-card rounded-3xl p-6 shadow-sm border border-white/80 space-y-4 hover:shadow-md transition-all">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted flex items-center gap-2">
                <Info className="h-4 w-4" style={{ color: '#0066FF' }} /> Assessment Summary & Reasoning
              </h3>
              <p className="text-sm text-primary leading-relaxed font-semibold bg-white/50 p-4 rounded-2xl">
                {assessmentResult.summary}
              </p>
            </div>

            <div className="frosted-card rounded-3xl p-6 shadow-sm border border-white/80 space-y-4 hover:shadow-md transition-all">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" style={{ color: '#00C875' }} /> Recommended Action Protocol
              </h3>
              <ul className="space-y-3 text-sm text-primary">
                {assessmentResult.nextSteps.map((st, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white/70 p-3.5 rounded-2xl border border-white font-bold shadow-sm">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-black text-white shrink-0 mt-0.5" style={{ backgroundColor: '#0066FF' }}>
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl frosted-card shadow-sm">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/dashboard/care')}
                className="pill-btn pill-btn-primary flex items-center gap-2 px-6 py-3 text-sm font-black shadow-md card-lift"
                style={{ backgroundColor: '#0066FF' }}
              >
                <MapPin className="h-4 w-4" /> Locate Nearby Hospitals
              </button>
            </div>

            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm hover:shadow-md text-primary text-sm font-bold transition-all card-lift"
            >
              <RotateCcw className="h-4 w-4" /> New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
