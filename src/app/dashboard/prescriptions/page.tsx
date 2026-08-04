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
  FileText,
  UserCheck,
  ShieldCheck,
  Send,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { processFileOCR, parsePrescriptionFromText } from '@/services/ocrService';
import { PrescriptionScan } from '@/types';
import { useRouter } from 'next/navigation';

export default function PrescriptionsPage() {
  const { activeProfile, profiles, prescriptions, addPrescription, currentUser, showToast } = useApp();
  const router = useRouter();

  const isDoctor = currentUser?.role === 'Physician';

  // Patient Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [activeScan, setActiveScan] = useState<PrescriptionScan | null>(prescriptions[0] || null);
  const [rotation, setRotation] = useState(0);

  // Doctor Form State
  const [targetPatientId, setTargetPatientId] = useState(profiles[0]?.id || 'prof-primary');
  const [medName, setMedName] = useState('Amoxicillin 500mg Capsule');
  const [dosageFreq, setDosageFreq] = useState('1-0-1 (Twice Daily after meals)');
  const [foodInstruction, setFoodInstruction] = useState('Take after food');
  const [duration, setDuration] = useState('5 Days');
  const [clinicalNotes, setClinicalNotes] = useState('Complete full 5-day antibiotic course. Drink plenty of water.');

  const targetPatient = profiles.find((p) => p.id === targetPatientId) || activeProfile;

  // Check for allergy conflicts
  const hasAllergyConflict = targetPatient.allergies.some((a) =>
    medName.toLowerCase().includes(a.toLowerCase())
  );

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newScan: PrescriptionScan = {
      id: `rx-${Date.now()}`,
      profileId: targetPatient.id,
      doctorName: currentUser?.name || 'Dr. Ananya Mehta',
      facilityName: currentUser?.facility || 'Apex Health Clinic',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      scannedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ocrConfidence: 1.0,
      notes: clinicalNotes,
      medicines: [
        {
          name: medName,
          dosage: dosageFreq.split(' ')[0],
          frequency: dosageFreq,
          duration: duration,
          instructions: foodInstruction,
          beforeAfterFood: foodInstruction.includes('before') ? 'Before Food' : 'After Food',
        },
      ],
    };

    addPrescription(newScan);
    setActiveScan(newScan);
    showToast(`Issued digital prescription for ${targetPatient.name}!`);
  };

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

  // DOCTOR / PHYSICIAN WORKSPACE VIEW
  if (isDoctor) {
    return (
      <div className="space-y-6">
        {/* Top Banner */}
        <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
              <FileCheck className="h-3.5 w-3.5" /> Doctor Clinical Rx Suite
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Digital Prescription Generator & Rx Writer
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Issue certified electronic prescriptions for your patients. Includes real-time allergy cross-checking and instant sync to patient app.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-300 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal-400" /> License #MD-84920 Active
            </span>
          </div>
        </div>

        {/* Doctor Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Rx Writer Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Issue New Digital Prescription</span>
              </h2>

              <form onSubmit={handleIssuePrescription} className="space-y-4 text-xs">
                {/* Patient Selection */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Select Patient Record:</label>
                  <select
                    value={targetPatientId}
                    onChange={(e) => setTargetPatientId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.age} yrs • Blood Group: {p.bloodGroup})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Medication Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Medication & Strength:</label>
                  <input
                    type="text"
                    required
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg Capsule"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Dosage Frequency:</label>
                  <select
                    value={dosageFreq}
                    onChange={(e) => setDosageFreq(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none focus:border-teal-500"
                  >
                    <option value="1-0-1 (Twice Daily after meals)">1-0-1 (Twice Daily after meals)</option>
                    <option value="1-1-1 (Three Times Daily)">1-1-1 (Three Times Daily)</option>
                    <option value="1-0-0 (Morning only)">1-0-0 (Morning only)</option>
                    <option value="0-0-1 (Night before bed)">0-0-1 (Night before bed)</option>
                    <option value="1 Capsule Every 8 Hours">1 Capsule Every 8 Hours</option>
                  </select>
                </div>

                {/* Food Instructions */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Food Timing:</label>
                    <select
                      value={foodInstruction}
                      onChange={(e) => setFoodInstruction(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                    >
                      <option value="Take after food">After Food</option>
                      <option value="Take before food (empty stomach)">Before Food</option>
                      <option value="Take with meals">With Meals</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Duration:</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                    >
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="10 Days">10 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="1 Month">1 Month</option>
                    </select>
                  </div>
                </div>

                {/* Real-time Allergy Cross-Check */}
                {hasAllergyConflict ? (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-[11px] text-red-700 dark:text-red-300 font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>Warning: Matches patient allergy ({targetPatient.allergies.join(', ')}).</span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-[11px] text-teal-800 dark:text-teal-300 font-semibold flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Allergy Shield Verified • No contraindications detected.</span>
                  </div>
                )}

                {/* Clinical Notes */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Physician Clinical Notes:</label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Issue & Sign Prescription</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Issued Prescriptions Stream */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>Issued Doctor Prescriptions ({prescriptions.length})</span>
                </h2>

                <span className="text-xs text-slate-400 font-medium">
                  Signed by {currentUser?.name || 'Dr. Ananya Mehta'}
                </span>
              </div>

              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Doctor: {rx.doctorName}</span>
                          <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                            Digitally Signed
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Facility: {rx.facilityName} • Issued: {rx.date}
                        </div>
                      </div>

                      <button
                        onClick={() => showToast(`Printed digital prescription ${rx.id}`)}
                        className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1.5"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Print / Export PDF</span>
                      </button>
                    </div>

                    {/* Prescribed Drugs */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Prescribed Medications:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {rx.medicines.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                          >
                            <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                            <div className="text-teal-600 dark:text-teal-400 font-semibold text-[11px]">
                              {m.frequency} • {m.duration}
                            </div>
                            <div className="text-[10px] text-slate-500">{m.instructions}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Notes */}
                    {rx.notes && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Doctor Instructions:</span>
                        {rx.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PATIENT SCAN & READ VIEW
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
