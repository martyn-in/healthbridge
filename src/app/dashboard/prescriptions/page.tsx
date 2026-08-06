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

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="frosted-card rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 anim-fade-up">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-[11px] font-extrabold uppercase mb-2 border border-[#0066FF]/20">
            <ScanLine className="h-3.5 w-3.5" /> Prescription Digitization
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0D1B2A]">
            Prescription & Medication Reader
          </h1>
          <p className="text-xs text-[#9BAABF] mt-1 max-w-xl leading-relaxed font-medium">
            Scan doctor prescriptions to extract medication names, strengths, dosage frequency, and food instructions to automatically generate reminder schedules.
          </p>
        </div>

        <label className="relative z-10 pill-btn pill-btn-primary text-xs shadow-md flex items-center gap-2 shrink-0 cursor-pointer">
          <Upload className="h-4 w-4" /> Upload Prescription
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handlePrescriptionUpload(e.target.files[0])} />
        </label>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner & Controls */}
        <div className="space-y-6">
          {/* Upload / Camera Box */}
          <div className="neu-card rounded-3xl p-6 text-center space-y-4">
            <h3 className="text-sm font-extrabold text-[#0D1B2A]">Scan Prescription Image</h3>

            <div className="flex justify-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-blue-200 rounded-2xl bg-white/60 hover:bg-white transition-colors cursor-pointer card-lift">
                <Camera className="h-6 w-6 text-[#0066FF] mb-1" />
                <span className="text-xs font-extrabold text-[#0D1B2A]">Camera Scan</span>
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

              <label className="flex-1 flex flex-col items-center justify-center p-5 border-2 border-dashed border-blue-200 rounded-2xl bg-white/60 hover:bg-white transition-colors cursor-pointer card-lift">
                <Upload className="h-6 w-6 text-[#9BAABF] mb-1" />
                <span className="text-xs font-extrabold text-[#0D1B2A]">Upload File</span>
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
              <div className="p-3 bg-[#0066FF]/10 rounded-2xl text-xs font-bold text-[#0066FF] border border-[#0066FF]/20">
                Reading prescription text and parsing medication dosages...
              </div>
            )}

            {/* Image Enhancer Toolbar */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-around text-xs text-[#9BAABF] font-bold">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1 hover:text-[#0066FF] transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate 90°
              </button>
              <button
                onClick={() => showToast('Contrast enhanced for clear OCR parsing.')}
                className="flex items-center gap-1 hover:text-[#0066FF] transition-colors"
              >
                <Crop className="h-3.5 w-3.5" /> Auto-Crop
              </button>
            </div>
          </div>

          {/* Stored Prescriptions List */}
          <div className="frosted-card rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#9BAABF]">
              Prescription History ({prescriptions.length})
            </h3>
            <div className="space-y-2">
              {prescriptions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActiveScan(p)}
                  className={`p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                    activeScan?.id === p.id
                      ? 'bg-[#0066FF]/10 border-[#0066FF]/40 text-[#0066FF] font-extrabold shadow-sm'
                      : 'bg-white/60 border-white/80 text-[#0D1B2A] hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-[#0D1B2A]">{p.doctorName}</div>
                  <div className="text-[10px] text-[#9BAABF]">
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
            <div className="frosted-card rounded-3xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
                <div>
                  <h2 className="text-base font-extrabold text-[#0D1B2A]">
                    {activeScan.doctorName}
                  </h2>
                  <p className="text-xs font-medium text-[#9BAABF]">
                    Facility: {activeScan.facilityName} | Date: {activeScan.date}
                  </p>
                </div>

                {activeScan.medicines.length > 0 && (
                  <button
                    onClick={() => {
                      addPrescription(activeScan);
                      router.push('/dashboard/medications');
                    }}
                    className="pill-btn pill-btn-primary text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="h-3.5 w-3.5" /> Sync to Schedule
                  </button>
                )}
              </div>

              {/* No medicines detected warning */}
              {activeScan.medicines.length === 0 && (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 text-center space-y-3">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
                  <h3 className="text-sm font-extrabold text-amber-900">
                    No Prescribed Medicines Found
                  </h3>
                  <p className="text-xs font-medium text-amber-700 max-w-md mx-auto">
                    {activeScan.notes || 'The uploaded document does not contain readable prescription text. Please ensure clear lighting and legible physician handwriting.'}
                  </p>
                </div>
              )}

              {/* Allergy Warning check */}
              {activeScan.medicines.length > 0 && activeProfile.allergies.some((a) =>
                activeScan.medicines.some((m) => m.name.toLowerCase().includes(a.toLowerCase()))
              ) && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>
                    ALLERGY ALERT: Identified medicine matches stored patient allergy profile ({activeProfile.allergies.join(', ')}). Consult prescribing doctor.
                  </span>
                </div>
              )}

              {/* Medicines Extraction Cards */}
              {activeScan.medicines.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#9BAABF]">
                    Parsed Medications ({activeScan.medicines.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeScan.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl neu-card space-y-3 card-lift"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
                              <Pill className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-[#0D1B2A]">
                                {med.name}
                              </h4>
                              <span className="text-[11px] font-bold text-[#0066FF]">
                                {med.dosage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-[#0D1B2A] pt-2 border-t border-slate-200/60">
                          <div>
                            <span className="font-bold text-[#9BAABF] block text-[10px]">Frequency:</span>
                            <span className="font-extrabold">{med.frequency}</span>
                          </div>
                          <div>
                            <span className="font-bold text-[#9BAABF] block text-[10px]">Duration:</span>
                            <span>{med.duration}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="font-bold text-[#9BAABF] block text-[10px]">Instructions:</span>
                            <span>{med.instructions} ({med.beforeAfterFood})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Notes */}
              {activeScan.notes && activeScan.medicines.length > 0 && (
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 text-xs text-[#0D1B2A]">
                  <span className="font-extrabold block mb-1 text-[#0D1B2A]">Doctor Notes:</span>
                  {activeScan.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="frosted-card rounded-3xl p-12 text-center border border-white/80 space-y-3">
              <ScanLine className="h-10 w-10 text-[#9BAABF] mx-auto" />
              <h3 className="text-sm font-extrabold text-[#0D1B2A]">
                No Prescription Selected
              </h3>
              <p className="text-xs font-medium text-[#9BAABF] max-w-sm mx-auto">
                Upload a doctor prescription image to extract medicine names and generate reminder schedules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
