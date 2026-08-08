'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Camera, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

export default function DoctorScanPage() {
  const router = useRouter();
  const [scanState, setScanState] = useState<'ready' | 'scanning' | 'verifying' | 'granted' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState('');
  const [doctorGoogleSub, setDoctorGoogleSub] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const validateToken = useMutation(api.access.validateQRToken);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
         if (data.user?.googleSub) {
           setDoctorGoogleSub(data.user.googleSub);
         }
      })
      .catch(console.error);
      
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    setScanState('scanning');
    setErrorMessage('');
    
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (scannerRef.current && scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          handleScanSuccess(decodedText);
        },
        () => { /* ignore */ }
      );
    } catch (err) {
      setScanState('error');
      setErrorMessage("Camera access denied or unavailable.");
    }
  };

  const handleScanSuccess = async (text: string) => {
    setScanState('verifying');
    try {
      let payload;
      try {
        payload = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid QR code format.");
      }

      if (payload.type !== 'healthbridge_patient_access' || !payload.token) {
        throw new Error("Invalid QR code format.");
      }
      
      if (!doctorGoogleSub) throw new Error("Doctor session not found.");

      const patientId = await validateToken({
        token: payload.token,
        doctorGoogleSub: doctorGoogleSub
      });
      
      setScanState('granted');
      setTimeout(() => {
        router.push(`/doctor/patient/${patientId}`);
      }, 1000);
      
    } catch (err: any) {
      setScanState('error');
      setErrorMessage(err.message || "Invalid or expired HealthBridge patient QR.");
    }
  };

  const cancelScan = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(console.error);
    }
    setScanState('ready');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
          Scan Patient QR Code
        </h1>
        <p className="text-sm font-semibold text-[var(--text-secondary)] mt-2">
          Request temporary clinical access to a patient's medical records by scanning their HealthBridge ID.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
        {scanState === 'ready' && (
          <div className="relative z-10 w-full max-w-sm mx-auto aspect-square border-4 border-dashed border-[#4D50A2]/30 rounded-3xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
            <QrCode className="w-16 h-16 text-[#4D50A2] mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Scanner Ready</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1 mb-6 px-8">
              Position the patient's QR code within the frame to request access.
            </p>
            <button 
              onClick={startScanner}
              disabled={!doctorGoogleSub}
              className="px-6 py-3 bg-[#4D50A2] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#3B3E8C] transition-colors shadow-md shadow-[#4D50A2]/20 disabled:opacity-50"
            >
              <Camera className="w-5 h-5" />
              Enable Camera
            </button>
          </div>
        )}

        {scanState === 'scanning' && (
          <div className="w-full max-w-sm mx-auto">
            <div id="reader" className="rounded-3xl overflow-hidden border-4 border-[#4D50A2]/50 shadow-lg" />
            <button 
              onClick={cancelScan}
              className="mt-6 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel Scanning
            </button>
          </div>
        )}

        {scanState === 'verifying' && (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#4D50A2] animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Verifying Patient...</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1">Establishing secure connection.</p>
          </div>
        )}

        {scanState === 'granted' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
               <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Access Granted</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1">Opening clinical profile...</p>
          </div>
        )}

        {scanState === 'error' && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
               <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-rose-800">Scan Failed</h3>
            <p className="text-sm font-semibold text-rose-600/80 mt-1 mb-6 max-w-xs">{errorMessage}</p>
            <button 
              onClick={() => setScanState('ready')}
              className="px-6 py-3 bg-[#4D50A2] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#3B3E8C] transition-colors shadow-md"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center">
         <Link href="/doctor" className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
            Return to Dashboard
         </Link>
      </div>
    </div>
  );
}
