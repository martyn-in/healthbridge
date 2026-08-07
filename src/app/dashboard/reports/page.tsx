'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  HelpCircle,
  FileCheck,
  ScanLine,
  Bot,
  Activity,
  CloudLightning,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { processFileOCR, parseReportFromText } from '@/services/ocrService';
import { MedicalReport } from '@/types';

export default function ReportsPage() {
  const { activeProfile, reports, addReport, deleteReport, showToast } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReport, setActiveReport] = useState<MedicalReport | null>(reports[0] || null);
  const [editingRawText, setEditingRawText] = useState(false);
  const [rawTextValue, setRawTextValue] = useState(reports[0]?.rawText || '');

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const ocrResult = await processFileOCR(file);
      const report = parseReportFromText(activeProfile.id, file.name, ocrResult);
      addReport(report);
      setActiveReport(report);
      setRawTextValue(report.rawText);
      showToast('Medical report analyzed successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error processing report.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Top Banner - Hero Header */}
      <div className="frosted-card rounded-3xl p-8 relative overflow-hidden anim-fade-up">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div 
              className="p-4 rounded-2xl neu-card flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.8)' }}
            >
              <ScanLine className="h-8 w-8" style={{ color: '#7C5CFC' }} />
            </div>
            <div className="space-y-2">
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm"
                style={{ background: 'rgba(124, 92, 252, 0.1)', color: '#7C5CFC' }}
              >
                <Activity className="h-3.5 w-3.5" /> AI-Powered OCR
              </div>
              <h1 className="text-3xl font-black" style={{ color: '#0D1B2A' }}>
                Lab Report Analyzer
              </h1>
              <p className="text-sm font-semibold max-w-xl leading-relaxed text-[var(--text-secondary)]">
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
            className="frosted-card rounded-3xl p-8 text-center space-y-5 transition-all anim-slide-right delay-100"
            style={{ 
              border: '2px dashed rgba(0,102,255,0.25)', 
              background: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            <label className="flex flex-col items-center justify-center cursor-pointer group">
              <div 
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: 'rgba(0,102,255,0.1)', color: '#0066FF' }}
              >
                <CloudLightning className="h-8 w-8" />
              </div>
              <span className="text-base font-bold mb-1" style={{ color: '#0D1B2A' }}>
                Drag & Drop Report
              </span>
              <span className="text-xs font-medium mb-5" style={{ color: '#9BAABF' }}>
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
              <div className="neu-card rounded-2xl p-4 mt-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className="text-xs font-bold" style={{ color: '#0066FF' }}>Processing Document...</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">Extracting</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700 animate-pulse">Parsing</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Report History */}
          <div className="frosted-card rounded-3xl p-6 space-y-4 anim-slide-right delay-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>
                Report History ({reports.length})
              </h3>
            </div>

            <div className="space-y-3">
              {reports.map((rep, idx) => (
                <div
                  key={rep.id}
                  onClick={() => {
                    setActiveReport(rep);
                    setRawTextValue(rep.rawText);
                  }}
                  className={`neu-card rounded-2xl p-4 cursor-pointer transition-all card-lift flex flex-col gap-3 ${
                    activeReport?.id === rep.id ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                  style={{ background: activeReport?.id === rep.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(124, 92, 252, 0.1)', color: '#7C5CFC' }}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold truncate" style={{ color: '#0D1B2A' }}>
                          {rep.fileName}
                        </div>
                        <div className="text-[11px] font-medium mt-0.5" style={{ color: '#9BAABF' }}>
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
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      style={{ color: '#FF3366' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {rep.summary && (
                    <div className="text-[11px] font-medium line-clamp-2 pl-13" style={{ color: '#9BAABF', marginLeft: '52px' }}>
                      {rep.summary.substring(0, 80)}...
                    </div>
                  )}
                </div>
              ))}
              
              {reports.length === 0 && (
                <div className="text-center py-6 text-sm font-medium" style={{ color: '#9BAABF' }}>
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
              <div className="frosted-card rounded-3xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Bot className="w-32 h-32" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50">
                        <Bot className="h-5 w-5" style={{ color: '#0066FF' }} />
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: '#0D1B2A' }}>AI Clinical Summary</h2>
                    </div>
                    
                    <button
                      onClick={() => window.print()}
                      className="pill-btn pill-btn-ghost flex items-center gap-2 text-xs"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                  </div>
                  
                  <div className="p-5 neu-card rounded-2xl text-sm font-medium leading-relaxed" style={{ color: '#0D1B2A' }}>
                    {activeReport.summary}
                  </div>
                  
                  {/* Actionable Chips */}
                  <div className="flex flex-wrap gap-2">
                    {activeReport.questionsForDoctor.slice(0, 3).map((q, i) => (
                      <div key={i} className="px-4 py-2 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.9)', color: '#0066FF', border: '1px solid rgba(0,102,255,0.1)' }}>
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
                  <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>
                    Extracted Biomarkers
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="dot-crimson w-2 h-2 rounded-full inline-block"></span>
                    <span style={{ color: '#9BAABF' }}>
                      {activeReport.extractedValues.filter((p) => p.status !== 'Normal').length} Abnormal
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeReport.extractedValues.map((param, i) => {
                    const isNormal = param.status === 'Normal';
                    const statusColor = isNormal ? '#00C875' : param.status === 'High' ? '#FF3366' : '#FF9500';
                    const statusBg = isNormal ? 'rgba(0, 200, 117, 0.1)' : param.status === 'High' ? 'rgba(255, 51, 102, 0.1)' : 'rgba(255, 149, 0, 0.1)';
                    
                    return (
                      <div key={i} className="neu-card rounded-2xl p-5 space-y-3 card-lift bg-white/60">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm" style={{ color: '#0D1B2A' }}>{param.parameter}</h4>
                          <span 
                            className="px-2.5 py-1 rounded-full text-[10px] font-extrabold"
                            style={{ backgroundColor: statusBg, color: statusColor }}
                          >
                            {param.status}
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black" style={{ color: '#0066FF' }}>{param.value}</span>
                          <span className="text-xs font-bold" style={{ color: '#9BAABF' }}>{param.unit}</span>
                        </div>
                        
                        <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Ref Range</span>
                          <span className="text-xs font-medium" style={{ color: '#0D1B2A' }}>{param.referenceRange}</span>
                        </div>
                        
                        <div className="text-[11px] font-medium leading-tight mt-2" style={{ color: '#9BAABF' }}>
                          {param.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Doctor Questions List */}
              <div className="frosted-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl" style={{ background: 'rgba(124, 92, 252, 0.1)' }}>
                    <HelpCircle className="h-5 w-5" style={{ color: '#7C5CFC' }} />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: '#0D1B2A' }}>
                    Questions to Ask Your Doctor
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {activeReport.questionsForDoctor.map((q, i) => (
                    <div key={i} className="neu-card rounded-2xl p-4 flex gap-4 items-start bg-white/40">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-sm" style={{ background: '#7C5CFC', color: 'white' }}>
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium pt-0.5 leading-relaxed" style={{ color: '#0D1B2A' }}>
                        {q}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="frosted-card rounded-3xl p-16 text-center space-y-4 h-full flex flex-col items-center justify-center anim-fade-up delay-200 min-h-[400px]">
              <div className="h-24 w-24 rounded-full neu-card flex items-center justify-center mb-4">
                <ScanLine className="h-10 w-10 opacity-20" />
              </div>
              <h3 className="text-xl font-bold" style={{ color: '#0D1B2A' }}>
                No Report Selected
              </h3>
              <p className="text-sm font-medium max-w-sm mx-auto" style={{ color: '#9BAABF' }}>
                Upload a laboratory report or select an existing one to view AI-parsed clinical parameters and insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
