'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Download,
  Trash2,
  Edit3,
  HelpCircle,
  ShieldCheck,
  FileCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { processFileOCR, parseReportFromText } from '@/services/ocrService';
import { MedicalReport } from '@/types';

export default function ReportsPage() {
  const { activeProfile, reports, addReport, deleteReport, showToast } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReport, setActiveReport] = useState<MedicalReport | null>(reports[0] || null);
  const [editingRawText, setEditingRawText] = useState(false);
  const [rawTextValue, setRawTextValue] = useState('');

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

  const loadDemoReport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const demo = reports[0];
      if (demo) {
        setActiveReport(demo);
        setRawTextValue(demo.rawText);
      }
      setIsProcessing(false);
      showToast('Loaded demo laboratory blood report.');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-800 to-navy-900 p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-cyan-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Flagship Workflow #2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Medical Report Analyzer
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Upload blood reports, lab work, or imaging summaries (PDF/JPG/PNG). Extracts parameters, highlights abnormal values, and explains complex medical terms in simple language.
          </p>
        </div>

        <button
          onClick={loadDemoReport}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <FileCheck className="h-4 w-4" /> Load Demo Lab Report
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload Dropzone & Report List */}
        <div className="space-y-6">
          {/* File Upload Box */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload New Report</h3>
            
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-teal-300 dark:border-teal-800 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-teal-600 dark:text-cyan-400 mb-2 animate-bounce" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Click or Drop PDF, JPG, PNG
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Maximum file size: 10 MB</span>
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
              <div className="p-3 bg-teal-100 dark:bg-teal-950/60 rounded-xl text-xs font-semibold text-teal-800 dark:text-teal-300 animate-pulse flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Extracting OCR text and parsing clinical ranges...</span>
              </div>
            )}
          </div>

          {/* Stored Reports List */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Analyzed Reports ({reports.length})
            </h3>

            <div className="space-y-2">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => {
                    setActiveReport(rep);
                    setRawTextValue(rep.rawText);
                  }}
                  className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                    activeReport?.id === rep.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-cyan-300 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="h-4 w-4 text-teal-600 shrink-0" />
                    <div className="truncate">
                      <div className="truncate">{rep.fileName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {rep.labName} • {rep.uploadedAt}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReport(rep.id);
                      if (activeReport?.id === rep.id) setActiveReport(null);
                    }}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Report Analysis Details */}
        <div className="lg:col-span-2 space-y-6">
          {activeReport ? (
            <div className="space-y-6">
              {/* Report Title & Metadata Header */}
              <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                      OCR Confidence: {Math.round(activeReport.ocrConfidence * 100)}%
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeReport.fileName}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Laboratory: {activeReport.labName} | Tested on: {activeReport.testDate}
                    </p>
                  </div>

                  <button
                    onClick={() => showToast('Report summary downloaded as PDF.')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                  >
                    <Download className="h-4 w-4" /> Download Summary
                  </button>
                </div>

                {/* Plain-Language Summary Box */}
                <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 space-y-1">
                  <span className="text-xs font-bold text-teal-900 dark:text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-teal-600" /> AI Plain-Language Summary:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {activeReport.summary}
                  </p>
                </div>

                {/* Extracted Lab Test Parameter Table */}
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                    Extracted Lab Test Values vs Reference Ranges
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">Parameter Name</th>
                          <th className="p-3">Result Value</th>
                          <th className="p-3">Reference Limit</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Simple Meaning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeReport.extractedValues.map((val, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-slate-900 dark:text-white">
                              {val.parameter}
                            </td>
                            <td className="p-3 font-bold text-slate-900 dark:text-white">
                              {val.value} {val.unit}
                            </td>
                            <td className="p-3 text-slate-500">{val.referenceRange}</td>
                            <td className="p-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  val.status === 'High'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : val.status === 'Low'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                }`}
                              >
                                {val.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                              {val.explanation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Questions for Doctor */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-teal-600" /> Recommended Questions for Your Doctor:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeReport.questionsForDoctor.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Editable Raw OCR Text Section */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">
                      Extracted Raw Document Text (OCR)
                    </span>
                    <button
                      onClick={() => setEditingRawText(!editingRawText)}
                      className="text-xs font-semibold text-teal-600 dark:text-cyan-400 flex items-center gap-1"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> {editingRawText ? 'Done' : 'Edit Text'}
                    </button>
                  </div>

                  {editingRawText ? (
                    <textarea
                      rows={6}
                      value={rawTextValue}
                      onChange={(e) => setRawTextValue(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 outline-none"
                    />
                  ) : (
                    <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap">
                      {rawTextValue || activeReport.rawText}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-12 text-center shadow-card border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No Report Selected
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload a lab report file or click "Load Demo Lab Report" to view extracted insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
