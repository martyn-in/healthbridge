'use client';

import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, RefreshCw, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function DigitalIdPage() {
  const [googleSub, setGoogleSub] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app we'd get this from a secure hook or context.
    // We fetch me from the local API endpoint that returns the verified token.
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
         if (data.payload?.sub) {
           setGoogleSub(data.payload.sub);
         }
      })
      .catch(console.error);
  }, []);

  const activeToken = useQuery(api.access.getActiveToken, googleSub ? { googleSub } : "skip");
  const generateToken = useMutation(api.access.generatePatientToken);
  const revokeToken = useMutation(api.access.revokeToken);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleGenerate = async () => {
    if (!googleSub) return;
    setIsGenerating(true);
    try {
      await generateToken({ googleSub });
    } catch (error) {
      console.error(error);
      alert("Failed to generate Digital Health Pass");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevoke = async () => {
    if (!googleSub) return;
    setIsRevoking(true);
    try {
      await revokeToken({ googleSub });
    } catch (error) {
      console.error(error);
      alert("Failed to revoke Digital Health Pass");
    } finally {
      setIsRevoking(false);
    }
  };

  const tokenPayload = activeToken ? JSON.stringify({
    type: 'healthbridge_patient_access',
    token: activeToken
  }) : '';

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
          Digital Health Pass
        </h1>
        <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
          Securely share your clinical profile with authorized HealthBridge doctors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 mb-2">My QR Code</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
            Show this QR code to a verified doctor to grant them temporary access to your medical records.
          </p>

          <div className="bg-white p-6 rounded-3xl border-4 border-[#2F3273] inline-block shadow-lg relative">
            {activeToken ? (
              <QRCodeSVG 
                value={tokenPayload} 
                size={220} 
                level="Q" 
                fgColor="#2F3273"
              />
            ) : (
              <div className="w-[220px] h-[220px] bg-slate-50 flex items-center justify-center rounded-xl">
                 <div className="text-slate-400 text-sm font-bold text-center">
                    No active token.<br/>Generate one below.
                 </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            {activeToken ? (
              <>
                <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  Refresh
                </button>
                <button 
                  onClick={handleRevoke}
                  disabled={isRevoking}
                  className="flex-1 py-3 px-4 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                >
                  {isRevoking ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                  Revoke
                </button>
              </>
            ) : (
              <button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !googleSub}
                  className="w-full py-3.5 px-4 bg-[#2F3273] text-white font-bold rounded-xl hover:bg-[#1f2150] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  Generate Pass
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#2F3273] text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5" /> How it works
             </h3>
             <ul className="space-y-3 text-sm text-indigo-100/90 font-medium list-disc list-inside">
               <li>The QR code contains a cryptographically secure token, not your medical data.</li>
               <li>Only verified HealthBridge doctors can scan and use this pass.</li>
               <li>Scanning establishes a temporary, 60-minute access session.</li>
               <li>You can revoke access at any time using the Revoke button.</li>
             </ul>
          </div>

          <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 shadow-sm flex items-start gap-4">
             <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
             <div>
               <h3 className="text-sm font-bold text-rose-800 mb-1">Privacy Warning</h3>
               <p className="text-xs font-semibold text-rose-600/80 leading-relaxed">
                 Never share a screenshot of your active QR code online or with unverified individuals. While access is time-limited and role-restricted, protecting your token ensures maximum privacy.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
