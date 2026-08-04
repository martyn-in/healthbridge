'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  MapPin,
  Share2,
  X,
  AlertOctagon,
  User,
  Heart,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export const EmergencySosModal: React.FC = () => {
  const {
    isSosActive,
    cancelSos,
    language,
    activeProfile,
    emergencyContacts,
    userLocation,
    requestUserLocation,
  } = useApp();

  const [countdown, setCountdown] = useState<number>(3);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isSosActive && !isConfirmed) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsConfirmed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsConfirmed(false);
    }
    return () => clearInterval(timer);
  }, [isSosActive]);

  if (!isSosActive) return null;

  const primaryContact = emergencyContacts.find((c) => c.isPrimary) || emergencyContacts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-modal border border-red-200 dark:border-red-900/40 animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 p-6 text-white text-center relative">
          <button
            onClick={cancelSos}
            className="absolute top-4 right-4 rounded-xl bg-white/10 p-1.5 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-8 ring-white/5 animate-pulse">
            <AlertOctagon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-wide uppercase">
            {t(language, 'emergencySos')}
          </h2>
          <p className="text-xs text-red-100 mt-1 font-medium">
            Critical Emergency Trauma & Medical Responder Protocol
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!isConfirmed ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Confirming emergency activation in...
              </p>
              <div className="text-6xl font-black text-red-600 dark:text-red-500 animate-bounce">
                {countdown}
              </div>
              <button
                onClick={cancelSos}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors border border-slate-200 dark:border-slate-700"
              >
                {t(language, 'emergencyCancel')}
              </button>
            </div>
          ) : (
            <>
              {/* Emergency Call Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-650 hover:bg-red-700 text-white font-bold py-3.5 px-4 shadow-lg transition-colors text-xs active:scale-[0.98]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Emergency (112)</span>
                </a>
                <a
                  href={`tel:${primaryContact?.phone || '112'}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold py-3.5 px-4 shadow border border-slate-700 transition-colors text-xs active:scale-[0.98]"
                >
                  <PhoneCall className="h-4 w-4 text-teal-400" />
                  <span>Call {primaryContact?.name.split(' ')[0] || 'Contact'}</span>
                </a>
              </div>

              {/* Location Card */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-750 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-500" /> Live GPS Location
                  </span>
                  <button
                    onClick={requestUserLocation}
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Refresh GPS
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {userLocation
                    ? `Latitude: ${userLocation.lat.toFixed(6)}, Longitude: ${userLocation.lng.toFixed(6)}`
                    : 'Location Access Pending'}
                </p>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'EMERGENCY SOS - HealthBridge AI',
                        text: `Emergency SOS for ${activeProfile.name}! Location: https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}`,
                      });
                    } else {
                      alert(`Location link copied: https://maps.google.com/?q=${userLocation?.lat},${userLocation?.lng}`);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  <Share2 className="h-3 w-3" /> {t(language, 'shareLocation')}
                </button>
              </div>

              {/* Medical Critical Profile */}
              <div className="rounded-xl bg-red-50/50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900/40 space-y-2.5 text-xs">
                <div className="font-extrabold flex items-center gap-1.5 text-red-800 dark:text-red-400">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  Emergency Medical Card — {activeProfile.name}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="font-medium text-slate-400 block text-[10px]">Blood Group:</span>
                    <span className="font-extrabold text-red-600 dark:text-red-400 text-sm">
                      {activeProfile.bloodGroup}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-400 block text-[10px]">Age / Sex:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeProfile.age} yrs / {activeProfile.gender}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-slate-400 block text-[10px]">Allergies:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                      {activeProfile.allergies.join(', ') || 'None Reported'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-slate-400 block text-[10px]">Known Conditions:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeProfile.conditions.join(', ') || 'None Reported'}</span>
                  </div>
                </div>
              </div>

              {/* Cancel Action */}
              <button
                onClick={cancelSos}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors border border-slate-200 dark:border-slate-700"
              >
                {t(language, 'emergencyCancel')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
