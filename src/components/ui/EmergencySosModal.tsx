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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-red-200 dark:border-red-900/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white text-center relative">
          <button
            onClick={cancelSos}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-8 ring-white/10 animate-pulse">
            <AlertOctagon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-wide uppercase">
            {t(language, 'emergencySos')}
          </h2>
          <p className="text-xs text-red-100 mt-1">
            Demo Mode Notice: No real emergency services dispatch sent.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isConfirmed ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Confirming emergency activation in...
              </p>
              <div className="text-6xl font-black text-red-600 dark:text-red-400 animate-bounce">
                {countdown}
              </div>
              <button
                onClick={cancelSos}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white font-bold py-3.5 px-4 shadow-lg hover:bg-red-700 transition-colors"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Call 112 / 108</span>
                </a>
                <a
                  href={`tel:${primaryContact?.phone || '112'}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-navy-700 dark:bg-teal-600 text-white font-semibold py-3.5 px-4 shadow hover:bg-navy-800 transition-colors"
                >
                  <PhoneCall className="h-5 w-5" />
                  <span>Call {primaryContact?.name.split(' ')[0] || 'Contact'}</span>
                </a>
              </div>

              {/* Location Card */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-red-500" /> Live GPS Location
                  </span>
                  <button
                    onClick={requestUserLocation}
                    className="text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Refresh GPS
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {userLocation
                    ? `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)} (New Delhi Region)`
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
                  className="inline-flex items-center gap-1.5 text-xs text-teal-700 dark:text-cyan-400 font-semibold hover:underline mt-1"
                >
                  <Share2 className="h-3.5 w-3.5" /> {t(language, 'shareLocation')}
                </button>
              </div>

              {/* Medical Critical Profile */}
              <div className="rounded-xl bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-900/40 space-y-2 text-xs text-red-950 dark:text-red-200">
                <div className="font-bold flex items-center gap-1.5 text-sm text-red-700 dark:text-red-400">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  Emergency Medical Card — {activeProfile.name}
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-800 dark:text-slate-200 pt-1">
                  <div>
                    <span className="font-semibold text-slate-500">Blood Group:</span>{' '}
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {activeProfile.bloodGroup}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Age / Sex:</span>{' '}
                    <span>{activeProfile.age} yrs / {activeProfile.gender}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-500">Allergies:</span>{' '}
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {activeProfile.allergies.join(', ') || 'None Reported'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold text-slate-500">Known Conditions:</span>{' '}
                    <span>{activeProfile.conditions.join(', ') || 'None Reported'}</span>
                  </div>
                </div>
              </div>

              {/* Cancel Action */}
              <button
                onClick={cancelSos}
                className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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
