'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, Crosshair, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function LocationPermissionModal() {
  const { locationPermissionState, setLocationPermissionState, requestUserLocation, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal if location permission has not been decided yet
    if (locationPermissionState === 'not_requested') {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [locationPermissionState]);

  if (!isOpen) return null;

  const handleAllow = () => {
    setIsOpen(false);
    requestUserLocation();
  };

  const handleNotNow = () => {
    setIsOpen(false);
    setLocationPermissionState('deferred');
    showToast('Location access deferred. You can enable it anytime in Settings.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md anim-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 text-left space-y-6">
        
        {/* Header Icon */}
        <div className="flex items-center justify-between">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] shadow-sm">
            <MapPin className="w-7 h-7" />
          </div>
          <button
            onClick={handleNotNow}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#0D1B2A] tracking-tight">
            Allow HealthBridge to access your location?
          </h2>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            Your location can be used for Emergency SOS, nearby hospitals, clinics, pharmacies, and emergency location sharing.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3 text-xs text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
          <span>
            HealthBridge does not continuously track your movement. Location is queried only during active requests or emergency workflows.
          </span>
        </div>

        {/* Action Buttons (No Emojis) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleAllow}
            className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Crosshair className="w-4 h-4" />
            <span>Allow Location</span>
          </button>
          <button
            onClick={handleNotNow}
            className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all text-center"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
