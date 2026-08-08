'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, ShieldCheck, Lock, AlertCircle, Scan, ArrowRight, CheckCircle2, User, KeyRound } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface DoctorQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientVerified?: (patientData: any) => void;
}

export function DoctorQrScannerModal({ isOpen, onClose, onPatientVerified }: DoctorQrScannerModalProps) {
  const { setCameraPermissionState, showToast } = useApp();

  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifiedPatient, setVerifiedPatient] = useState<any | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera tracks explicitly
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop error:', e);
        }
      });
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Cleanup camera stream on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setErrorMsg('');
      setVerifiedPatient(null);
      setManualCode('');
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Intentionally start camera scanner when doctor clicks Start Scanner
  const startCameraScanner = async () => {
    setErrorMsg('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsScanning(true);
      setCameraPermissionState('allowed');
      showToast('Camera active. Point at Patient Health Pass QR Code.');
    } catch (err: any) {
      console.error('Camera access denied or failed:', err);
      setCameraPermissionState('denied');
      setErrorMsg('Camera access denied or unavailable. Use manual Pass Code entry below.');
      stopCameraStream();
    }
  };

  // Verify token with backend
  const verifyTokenWithBackend = async (tokenInput: string) => {
    if (!tokenInput.trim()) {
      setErrorMsg('Please scan a QR token or enter a valid Pass Code.');
      return;
    }

    setVerifying(true);
    setErrorMsg('');

    // Stop camera stream immediately upon token capture
    stopCameraStream();

    try {
      const res = await fetch('/api/qr/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenInput.trim(),
          doctorRole: 'doctor',
          doctorId: 'doc-ver-101',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVerifiedPatient(data.authorizedData.patient);
        if (onPatientVerified) {
          onPatientVerified(data.authorizedData.patient);
        }
        showToast('Patient Health Pass verified successfully!');
      } else {
        setErrorMsg(data.error || 'Failed to verify Patient Health Pass token.');
      }
    } catch (err) {
      setErrorMsg('Network error verifying Health Pass code.');
    } finally {
      setVerifying(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyTokenWithBackend(manualCode);
  };

  // Simulated QR detection for demo scanning
  const handleSimulatedQrDetected = () => {
    const sampleToken = 'hb_pass_token_prof-primary_alex_johnson';
    verifyTokenWithBackend(sampleToken);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md anim-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
              <Scan className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0D1B2A] tracking-tight">
                Scan Patient Health Pass
              </h2>
              <p className="text-xs font-semibold text-teal-700">
                Verified Doctor Workspace • Role Authorized
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verified Patient Result View */}
        {verifiedPatient ? (
          <div className="space-y-5 anim-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-sm">Authorized Patient Access Session Established</p>
                <p className="text-xs text-emerald-700 font-medium">Temporary clinical access granted per patient privacy policy.</p>
              </div>
            </div>

            <div className="frosted-card rounded-2xl p-5 border border-slate-200 space-y-3 bg-slate-50/50">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#0D1B2A] text-lg">{verifiedPatient.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {verifiedPatient.age} yrs • {verifiedPatient.gender}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-black text-xs border border-red-200">
                  Blood Group: {verifiedPatient.bloodGroup}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Known Allergies</span>
                  <span className="font-bold text-slate-800">{verifiedPatient.allergies.join(', ') || 'None'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="font-bold text-slate-400 block uppercase text-[10px]">Emergency Contact</span>
                  <span className="font-bold text-slate-800">{verifiedPatient.emergencyContact.name} ({verifiedPatient.emergencyContact.phone})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                <span className="font-bold text-slate-400 block uppercase text-[10px]">Active Medications</span>
                <span className="font-semibold text-slate-700">{verifiedPatient.currentMedications.join(', ')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setVerifiedPatient(null);
                startCameraScanner();
              }}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all text-center"
            >
              Scan Another Patient QR
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Camera Viewport Area */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 aspect-video flex flex-col items-center justify-center text-center p-4">
              {isScanning ? (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-teal-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-dashed border-teal-300 rounded-xl animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <button
                      onClick={handleSimulatedQrDetected}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 text-white font-bold text-xs shadow-md hover:bg-teal-600 transition-all"
                    >
                      Simulate Capture QR
                    </button>
                    <button
                      onClick={stopCameraStream}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-700 transition-all"
                    >
                      Stop Camera
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 p-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-teal-400 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium max-w-xs">
                    Camera access is inactive. Click below to start the camera scanner explicitly.
                  </p>
                  <button
                    onClick={startCameraScanner}
                    className="py-3 px-6 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Start Scanner</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Manual Token Code Entry Fallback */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
                <KeyRound className="w-4 h-4 text-teal-600" />
                <span>Manual Health Pass Code Entry</span>
              </div>
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. hb_pass_token_prof-primary..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={verifying}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shrink-0 flex items-center gap-1"
                >
                  {verifying ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
