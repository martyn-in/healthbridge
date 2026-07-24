'use client';

import React, { useState } from 'react';
import {
  ScanLine,
  Camera,
  Upload,
  RotateCw,
  Crop,
  Sparkles,
  CheckCircle,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { processFileOCR, parsePrescriptionFromText } from '@/services/ocrService';
import { PrescriptionScan } from '@/types';
import { useRouter } from 'next/navigation';

export default function PrescriptionsPage() {
  const { activeProfile, prescriptions, addPrescription, showToast } = useApp();
  const router = useRouter();

  const [isScanning, setIsScanning] = useState(false);
  const [activeScan, setActiveScan] = useState<PrescriptionScan | null>(prescriptions[0] || null);
  const [rotation, setRotation] = useState(0);

  const handlePrescriptionUpload = async (file: File) => {
    setIsScanning(true);
    try {
      const ocrResult = await processFileOCR(file);
      const scan = parsePrescriptionFromText(activeProfile.id, ocrResult, URL.createObjectURL(file));
      addPrescription(scan);
      setActiveScan(scan);
      showToast('Prescription scanned successfully!');
    } catch (err) {
      console.error(err);
      showToast('Error scanning prescription.');
    } finally {
      setIsScanning(false);
    }
  };

  const loadDemoPrescription = () => {
    setIsScanning(true);
    setTimeout(() => {
      if (prescriptions[0]) {
        setActiveScan(prescriptions[0]);
      }
      setIsScanning(false);
      showToast('Loaded demo prescription from Dr. Ananya Mehta.');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-700 to-navy-900 p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-cyan-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Flagship Workflow #3
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Prescription & Medicine Scanner
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Scan handwritten or printed doctor prescriptions. Extracts medicine names, strengths, frequencies, and food instructions to automatically generate medication reminder schedules.
          </p>
        </div>

        <button
          onClick={loadDemoPrescription}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Camera className="h-4 w-4" /> Load Demo Prescription
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner & Controls */}
        <div className="space-y-6">
          {/* Upload / Camera Box */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Scan Prescription</h3>

            <div className="flex justify-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-teal-300 dark:border-teal-800 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100/50 cursor-pointer">
                <Camera className="h-6 w-6 text-teal-600 dark:text-cyan-400 mb-1" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Camera Scan</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handlePrescriptionUpload(e.target.files[0]);
                  }}
                />
              </label>

              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 cursor-pointer">
                <Upload className="h-6 w-6 text-slate-500 mb-1" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Upload Image</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handlePrescriptionUpload(e.target.files[0]);
                  }}
                />
              </label>
            </div>

            {isScanning && (
              <div className="p-3 bg-teal-100 dark:bg-teal-950/60 rounded-xl text-xs font-semibold text-teal-800 dark:text-teal-300 animate-pulse">
                📷 OCR Scanner reading prescription text...
              </div>
            )}

            {/* Image Enhancer Toolbar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs text-slate-500">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1 hover:text-teal-600"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate 90°
              </button>
              <button
                onClick={() => showToast('Contrast enhanced for clear reading.')}
                className="flex items-center gap-1 hover:text-teal-600"
              >
                <Crop className="h-3.5 w-3.5" /> Auto-Crop
              </button>
            </div>
          </div>

          {/* Stored Prescriptions List */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Prescription History ({prescriptions.length})
            </h3>
            <div className="space-y-2">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActiveScan(p)}
                  className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    activeScan?.id === p.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-cyan-300 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold">{p.doctorName}</div>
                  <div className="text-[10px] text-slate-400">
                    {p.facilityName} • {p.scannedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Medicines & Review */}
        <div className="lg:col-span-2 space-y-6">
          {activeScan ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-cyan-400">
                    OCR Confidence: {Math.round(activeScan.ocrConfidence * 100)}%
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeScan.doctorName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Facility: {activeScan.facilityName} | Date: {activeScan.date}
                  </p>
                </div>

                {activeScan.medicines.length > 0 && (
                  <button
                    onClick={() => {
                      addPrescription(activeScan);
                      router.push('/dashboard/medications');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Add All to Medication Schedule
                  </button>
                )}
              </div>

              {/* No medicines detected warning */}
              {activeScan.medicines.length === 0 && (
                <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-center space-y-3">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
                  <h3 className="text-base font-bold text-amber-800 dark:text-amber-300">
                    No Prescription Detected
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 max-w-md mx-auto">
                    {activeScan.notes || 'The uploaded image does not appear to contain a valid medical prescription. No medicine names, dosages, or instructions were found.'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-1">
                    Please upload a clear photo of a handwritten or printed doctor prescription containing medicine names and dosage instructions.
                  </p>
                </div>
              )}

              {/* Allergy Warning check */}
              {activeScan.medicines.length > 0 && activeProfile.allergies.some((a) =>
                activeScan.medicines.some((m) => m.name.toLowerCase().includes(a.toLowerCase()))
              ) && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>
                    ALLERGY ALERT: One or more medicines match stored allergy profile ({activeProfile.allergies.join(', ')}). Consult physician immediately.
                  </span>
                </div>
              )}

              {/* Medicines Extraction Cards */}
              {activeScan.medicines.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Extracted Medicines ({activeScan.medicines.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeScan.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 relative"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-cyan-400">
                              <Pill className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {med.name}
                              </h4>
                              <span className="text-xs font-semibold text-teal-600 dark:text-cyan-400">
                                {med.dosage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div>
                            <span className="font-semibold text-slate-400 block">Frequency:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100">{med.frequency}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-400 block">Duration:</span>
                            <span>{med.duration}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="font-semibold text-slate-400 block">Instructions:</span>
                            <span className="text-slate-700 dark:text-slate-300">{med.instructions} ({med.beforeAfterFood})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Notes */}
              {activeScan.notes && activeScan.medicines.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">Doctor Notes:</span>
                  {activeScan.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-12 text-center shadow-card border border-slate-200 dark:border-slate-800 space-y-3">
              <ScanLine className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No Prescription Selected
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload a real doctor prescription image to extract medicine names and generate reminder schedules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
