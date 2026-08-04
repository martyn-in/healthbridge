'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  HelpCircle,
  FileCheck,
  Info,
  Edit3,
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
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <FileText className="h-3.5 w-3.5" /> Laboratory OCR Intelligence
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Medical Report Analyzer & OCR
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Upload blood work, lipid panels, or imaging summaries (PDF/JPG/PNG). Parses numerical parameters, highlights out-of-range markers, and formats doctor discussion questions.
          </p>
        </div>

        <button
          onClick={loadDemoReport}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <FileCheck className="h-4 w-4" /> Load Sample Report
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: File Dropzone & List */}
        <div className="space-y-6">
          {/* File Upload Box */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload New Document</h3>
            
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer">
              <Upload className="h-7 w-7 text-teal-600 dark:text-teal-400 mb-2" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Drop PDF, JPG, or PNG here
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
              <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-xl text-xs font-semibold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Parsing document text and evaluating laboratory reference ranges...
              </div>
            )}
          </div>

          {/* Stored Reports List */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Parsed Reports ({reports.length})
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
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500/80 text-teal-900 dark:text-teal-300 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div className="truncate">
                      <div className="truncate font-semibold">{rep.fileName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {rep.labName} • {rep.uploadedAt}
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
                    className="p-1 text-slate-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Parsed Laboratory Parameter Table */}
        <div className="lg:col-span-2 space-y-6">
          {activeReport ? (
            <div className="space-y-6">
              {/* Report Header Card */}
              <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeReport.fileName}
                    </h2>
                    <span className="text-xs text-slate-500">
                      {activeReport.labName} • Analyzed on {activeReport.uploadedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                    >
                      <Download className="h-3.5 w-3.5 inline mr-1" /> Export Summary
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  <span className="font-bold text-slate-900 dark:text-white mr-1.5">Clinical Summary:</span>
                  {activeReport.summary}
                </div>
              </div>

              {/* Parsed Lab Parameters Table */}
              <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Extracted Parameters & Reference Ranges</span>
                  <span className="text-xs font-normal text-slate-500">
                    {activeReport.extractedValues.filter((p) => p.status !== 'Normal').length} flagged out of range
                  </span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5 px-3">Test Parameter</th>
                        <th className="py-2.5 px-3">Observed Value</th>
                        <th className="py-2.5 px-3">Reference Range</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Simple Meaning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {activeReport.extractedValues.map((param, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                            {param.parameter}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                            {param.value} {param.unit}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {param.referenceRange}
                          </td>
                          <td className="py-3 px-3">
                            {param.status === 'Normal' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                                Normal
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800">
                                {param.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
                            {param.explanation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Questions for Your Doctor */}
              <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Formulated Doctor Consultation Questions
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {activeReport.questionsForDoctor.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <span className="font-bold text-teal-600">{i + 1}.</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Editable Raw Document Text */}
              <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Extracted Document OCR Text
                  </span>
                  <button
                    onClick={() => setEditingRawText(!editingRawText)}
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> {editingRawText ? 'Done' : 'Edit OCR Text'}
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
                  <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap">
                    {rawTextValue || activeReport.rawText}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No Report Selected
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload a laboratory report or click "Load Sample Report" to view parsed clinical parameters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
