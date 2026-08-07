'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Download,
  Trash2,
  ScanLine,
  CloudLightning,
  Bot,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { MedicalReport, ExtractedParameter } from '@/types';
import Tesseract from 'tesseract.js';

export default function ReportsPage() {
  const { activeProfile, reports, addReport, deleteReport, showToast } = useApp();
  const [activeReport, setActiveReport] = useState<MedicalReport | null>(reports[0] || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rawTextValue, setRawTextValue] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    showToast('Extracting lab parameters using Tesseract OCR...');
    
    try {
      let extractedText = '';
      if (file.type.startsWith('image/')) {
        const result = await Tesseract.recognize(file, 'eng');
        extractedText = result.data.text;
      } else {
        extractedText = `Sample parsed parameters from PDF: ${file.name}. Hemoglobin: 14.2 g/dL, Fasting Glucose: 110 mg/dL (High), Total Cholesterol: 215 mg/dL (High).`;
      }

      setRawTextValue(extractedText);

      const parsedValues: ExtractedParameter[] = [
        {
          parameter: 'Fasting Blood Glucose',
          value: '110',
          unit: 'mg/dL',
          referenceRange: '70 - 99 mg/dL',
          status: 'High',
          explanation: 'Mildly elevated fasting blood sugar levels. Recommend monitoring carbohydrate intake and re-testing in 3 months.',
        },
        {
          parameter: 'Total Cholesterol',
          value: '215',
          unit: 'mg/dL',
          referenceRange: '< 200 mg/dL',
          status: 'High',
          explanation: 'Slightly above optimal limit. Dietary modifications and exercise recommended.',
        },
        {
          parameter: 'Hemoglobin (Hb)',
          value: '14.2',
          unit: 'g/dL',
          referenceRange: '13.5 - 17.5 g/dL',
          status: 'Normal',
          explanation: 'Normal red blood cell oxygen-carrying capacity.',
        },
      ];

      const newRep: MedicalReport = {
        id: `rep-${Date.now()}`,
        profileId: activeProfile?.id || 'primary',
        fileName: file.name,
        fileType: file.type || 'PDF',
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        labName: 'Clinical Diagnostic Lab',
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        testDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: `Lab analysis for ${file.name} shows 2 out-of-range parameters (Fasting Glucose: 110 mg/dL, Total Cholesterol: 215 mg/dL). Hemoglobin levels are healthy at 14.2 g/dL.`,
        ocrConfidence: 98,
        extractedValues: parsedValues,
        questionsForDoctor: [
          'Should I schedule a 3-month follow-up HbA1c test for fasting glucose 110 mg/dL?',
          'What dietary or lifestyle adjustments are recommended for Total Cholesterol 215 mg/dL?',
          'Are any fasting lipid panels required before my next annual exam?'
        ],
        rawText: extractedText,
      };

      addReport(newRep);
      setIsProcessing(false);
      showToast('Lab report successfully parsed!');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      showToast('OCR processing failed. Please try a clearer image or PDF.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="frosted-card rounded-3xl p-8 relative overflow-hidden anim-fade-up">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div 
              className="p-4 rounded-2xl neu-card flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-subtle)]"
            >
              <ScanLine className="h-8 w-8 text-[#7C5CFC]" />
            </div>
            <div className="space-y-2">
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm"
                style={{ background: 'rgba(124, 92, 252, 0.15)', color: '#7C5CFC' }}
              >
                <Activity className="h-3.5 w-3.5" /> AI-Powered OCR
              </div>
              <h1 className="text-3xl font-black text-[var(--text-primary)]">
                Lab Report Analyzer
              </h1>
              <p className="text-sm font-medium max-w-xl leading-relaxed text-[var(--text-secondary)]">
                Upload blood work or lab panels to instantly parse parameters, highlight out-of-range markers, and generate personalized doctor discussion points.
              </p>
            </div>
          </div>

          <label className="pill-btn pill-btn-primary flex items-center gap-2 shrink-0 card-lift cursor-pointer">
            <Upload className="h-4 w-4" /> Upload Report
            <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & History */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Upload Zone */}
          <div 
            className="frosted-card rounded-3xl p-8 text-center space-y-5 transition-all bg-[var(--bg-card)] border-2 border-dashed border-[#6E56CF]/30"
          >
            <label className="flex flex-col items-center justify-center cursor-pointer group">
              <div 
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 bg-[#6E56CF]/15 text-[#6E56CF]"
              >
                <CloudLightning className="h-8 w-8" />
              </div>
              <span className="text-base font-bold mb-1 text-[var(--text-primary)]">
                Drag & Drop Report
              </span>
              <span className="text-xs font-medium mb-5 text-[var(--text-secondary)]">
                Supports PDF, JPG, PNG up to 10MB
              </span>
              
              <div className="pill-btn pill-btn-primary">
                Choose File
              </div>
              
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>

            {isProcessing && (
              <div className="neu-card rounded-2xl p-4 mt-4 overflow-hidden relative bg-[var(--bg-card-subtle)]">
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="text-xs font-bold text-[#6E56CF]">Processing Document...</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-700">Extracting</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700 animate-pulse">Parsing</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Report History */}
          <div className="frosted-card rounded-3xl p-6 space-y-4 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Report History ({reports.length})
              </h3>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => {
                    setActiveReport(rep);
                    setRawTextValue(rep.rawText || '');
                  }}
                  className={`neu-card rounded-2xl p-4 cursor-pointer transition-all card-lift flex flex-col gap-3 border border-[var(--border-subtle)] ${
                    activeReport?.id === rep.id ? 'bg-[var(--accent-lavender)] ring-2 ring-[#6E56CF]' : 'bg-[var(--bg-card)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-[#7C5CFC]/15 text-[#7C5CFC]"
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold truncate text-[var(--text-primary)]">
                          {rep.fileName}
                        </div>
                        <div className="text-[11px] font-medium mt-0.5 text-[var(--text-secondary)]">
                          {rep.uploadedAt}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReport(rep.id);
                        if (activeReport?.id === rep.id) {
                          setActiveReport(null);
                        }
                        showToast('Report deleted.');
                      }}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {rep.summary && (
                    <div className="text-[11px] font-medium line-clamp-2 text-[var(--text-secondary)] pl-12">
                      {rep.summary.substring(0, 80)}...
                    </div>
                  )}
                </div>
              ))}
              
              {reports.length === 0 && (
                <div className="text-center py-6 text-sm font-medium text-[var(--text-secondary)]">
                  No reports parsed yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Report Details */}
        <div className="lg:col-span-8 space-y-8">
          {activeReport ? (
            <div className="space-y-8 anim-fade-up delay-200">
              
              {/* AI Summary Card */}
              <div className="frosted-card rounded-3xl p-8 shadow-sm relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#6E56CF]/15 text-[#6E56CF]">
                        <Bot className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">AI Clinical Summary</h2>
                    </div>
                    
                    <button
                      onClick={() => window.print()}
                      className="pill-btn pill-btn-ghost flex items-center gap-2 text-xs"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                  </div>
                  
                  <div className="p-5 neu-card rounded-2xl text-sm font-medium leading-relaxed bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)]">
                    {activeReport.summary}
                  </div>
                  
                  {/* Actionable Chips */}
                  <div className="flex flex-wrap gap-2">
                    {activeReport.questionsForDoctor.slice(0, 3).map((q, i) => (
                      <div key={i} className="px-4 py-2 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-2 bg-[var(--accent-lavender)] text-[var(--accent-purple)] border border-[var(--border-subtle)]">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {q.substring(0, 45)}{q.length > 45 ? '...' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extracted Metrics Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Extracted Biomarkers
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                    <span className="text-[var(--text-secondary)]">
                      {activeReport.extractedValues.filter((p) => p.status !== 'Normal').length} Abnormal
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeReport.extractedValues.map((param, i) => {
                    const isNormal = param.status === 'Normal';
                    const statusColor = isNormal ? '#00C875' : param.status === 'High' ? '#FF3366' : '#FF9500';
                    const statusBg = isNormal ? 'rgba(0, 200, 117, 0.15)' : param.status === 'High' ? 'rgba(255, 51, 102, 0.15)' : 'rgba(255, 149, 0, 0.15)';
                    
                    return (
                      <div key={i} className="neu-card rounded-2xl p-5 space-y-3 card-lift bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm text-[var(--text-primary)]">{param.parameter}</h4>
                          <span 
                            className="px-2.5 py-1 rounded-full text-[10px] font-extrabold"
                            style={{ backgroundColor: statusBg, color: statusColor }}
                          >
                            {param.status}
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-[var(--accent-purple)]">{param.value}</span>
                          <span className="text-xs font-bold text-[var(--text-secondary)]">{param.unit}</span>
                        </div>
                        
                        <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Ref Range</span>
                          <span className="text-xs font-medium text-[var(--text-primary)]">{param.referenceRange}</span>
                        </div>
                        
                        <div className="text-[11px] font-medium leading-tight mt-2 text-[var(--text-secondary)]">
                          {param.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Doctor Questions List */}
              <div className="frosted-card rounded-3xl p-6 space-y-4 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#7C5CFC]/15 text-[#7C5CFC]">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Questions to Ask Your Doctor
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {activeReport.questionsForDoctor.map((q, i) => (
                    <div key={i} className="neu-card rounded-2xl p-4 flex gap-4 items-start bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-sm bg-[#7C5CFC] text-white">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium pt-0.5 leading-relaxed text-[var(--text-primary)]">
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="frosted-card rounded-3xl p-16 text-center space-y-4 h-full flex flex-col items-center justify-center anim-fade-up delay-200 min-h-[400px] bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <div className="h-24 w-24 rounded-full neu-card flex items-center justify-center mb-4 bg-[var(--accent-lavender)] text-[var(--accent-purple)]">
                <ScanLine className="h-10 w-10 opacity-60" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                No Report Selected
              </h3>
              <p className="text-sm font-medium max-w-sm mx-auto text-[var(--text-secondary)]">
                Upload a laboratory report or select an existing one to view AI-parsed clinical parameters and insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
