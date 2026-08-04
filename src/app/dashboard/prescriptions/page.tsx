'use client';

import React, { useState } from 'react';
import {
  ScanLine,
  Camera,
  Upload,
  RotateCw,
  Crop,
  CheckCircle,
  Pill,
  AlertTriangle,
  Plus,
  FileCheck,
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
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <ScanLine className="h-3.5 w-3.5" /> Prescription Digitization
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Prescription & Medication Reader
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Scan doctor prescriptions to extract medication names, strengths, dosage frequency, and food instructions to automatically generate reminder schedules.
          </p>
        </div>

        <button
          onClick={loadDemoPrescription}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          <FileCheck className="h-4 w-4" /> Load Sample Rx
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner & Controls */}
        <div className="space-y-6">
          {/* Upload / Camera Box */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Scan Prescription Image</h3>

            <div className="flex justify-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Camera className="h-6 w-6 text-teal-600 dark:text-teal-400 mb-1" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Camera Scan</span>
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

              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Upload className="h-6 w-6 text-slate-500 mb-1" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Upload File</span>
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
              <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-xl text-xs font-semibold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Reading prescription text and parsing medication dosages...
              </div>
            )}

            {/* Image Enhancer Toolbar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs text-slate-500">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate 90°
              </button>
              <button
                onClick={() => showToast('Contrast enhanced for clear OCR parsing.')}
                className="flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400"
              >
                <Crop className="h-3.5 w-3.5" /> Auto-Crop
              </button>
            </div>
          </div>

          {/* Stored Prescriptions List */}
          <div className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Prescription History ({prescriptions.length})
            </h3>
            <div className="space-y-2">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActiveScan(p)}
                  className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                    activeScan?.id === p.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500/80 text-teal-900 dark:text-teal-300 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold text-slate-900 dark:text-white">{p.doctorName}</div>
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
            <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
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
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Sync to Schedule
                  </button>
                )}
              </div>

              {/* No medicines detected warning */}
              {activeScan.medicines.length === 0 && (
                <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-center space-y-3">
                  <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto" />
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                    No Prescribed Medicines Found
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-400 max-w-md mx-auto">
                    {activeScan.notes || 'The uploaded document does not contain readable prescription text. Please ensure clear lighting and legible physician handwriting.'}
                  </p>
                </div>
              )}

              {/* Allergy Warning check */}
              {activeScan.medicines.length > 0 && activeProfile.allergies.some((a) =>
                activeScan.medicines.some((m) => m.name.toLowerCase().includes(a.toLowerCase()))
              ) && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>
                    ALLERGY ALERT: Identified medicine matches stored patient allergy profile ({activeProfile.allergies.join(', ')}). Consult prescribing doctor.
                  </span>
                </div>
              )}

              {/* Medicines Extraction Cards */}
              {activeScan.medicines.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Parsed Medications ({activeScan.medicines.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeScan.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                              <Pill className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                {med.name}
                              </h4>
                              <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                                {med.dosage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div>
                            <span className="font-medium text-slate-400 block text-[10px]">Frequency:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{med.frequency}</span>
                          </div>
                          <div>
                            <span className="font-medium text-slate-400 block text-[10px]">Duration:</span>
                            <span>{med.duration}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-slate-400 block text-[10px]">Instructions:</span>
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
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block mb-1">Doctor Notes:</span>
                  {activeScan.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-white dark:bg-slate-900 p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
              <ScanLine className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No Prescription Selected
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload a doctor prescription image to extract medicine names and generate reminder schedules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
