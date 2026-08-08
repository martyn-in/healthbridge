'use client';

import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Lock, Download, RotateCcw, User, Bell, Globe, AlertTriangle, Check, Mail, MapPin, Crosshair, Camera } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const {
    activeProfile,
    updatePrimaryProfile,
    qrSharingEnabled,
    setQrSharingEnabled,
    clearAllDataToFreshState,
    showToast,
    locationPermissionState,
    cameraPermissionState,
    requestUserLocation,
    userLocation,
    userAddress,
  } = useApp();

  const [fullName, setFullName] = useState(activeProfile?.name || '');
  const [email, setEmail] = useState((activeProfile as any)?.email || '');
  const [age, setAge] = useState(activeProfile?.age ? String(activeProfile.age) : '30');
  const [bloodGroup, setBloodGroup] = useState(activeProfile?.bloodGroup || 'O Positive');

  useEffect(() => {
    if (activeProfile) {
      setFullName(activeProfile.name || '');
      setEmail((activeProfile as any)?.email || '');
      if (activeProfile.age) setAge(String(activeProfile.age));
      if (activeProfile.bloodGroup) setBloodGroup(activeProfile.bloodGroup);
    }
  }, [activeProfile]);

  const [notifications, setNotifications] = useState({
    appointments: true,
    labResults: true,
    medicationReminders: false,
  });

  const [language, setLanguage] = useState('English');
  
  const handleSave = () => {
    updatePrimaryProfile({
      name: fullName,
      age: parseInt(age) || 30,
      bloodGroup: bloodGroup,
      email: email,
    } as any);
    showToast('Profile and settings updated successfully!');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 pb-12 anim-fade-up">
      {/* Hero Header */}
      <div className="relative frosted-card rounded-3xl p-8 overflow-hidden border border-white/90">
        <div className="absolute inset-0 bg-slate-900/[0.02] bg-[length:16px_16px] [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl neu-card flex items-center justify-center bg-white/50">
              <SettingsIcon className="h-8 w-8 text-[#9BAABF]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-tight">
                Settings & Preferences
              </h1>
              <p className="text-sm font-medium text-[#9BAABF] mt-2">
                Manage your profile, security, and app preferences
              </p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="pill-btn pill-btn-primary flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-4xl space-y-8">
        
        {/* Profile Section */}
        <div className="frosted-card rounded-3xl p-8 border border-white/90 card-lift transition-all delay-100 anim-slide-right">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
              <User className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1B2A]">Profile Information</h3>
          </div>
          <div className="h-px w-full bg-slate-200/50 mb-6"></div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <div 
                className="h-28 w-28 rounded-full shadow-inner flex items-center justify-center text-3xl font-bold text-white border-4 border-white overflow-hidden shrink-0 select-none"
                style={{ background: 'linear-gradient(135deg, #0066FF, #00C2FF)' }}
              >
                {activeProfile?.avatarUrl ? (
                  <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(fullName || activeProfile?.name || 'User')
                )}
              </div>
              <button onClick={() => showToast('Avatar updated from your signed-in account.')} className="pill-btn pill-btn-ghost text-xs">
                Verified Account
              </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-[#F3F5F8] border-none rounded-xl px-4 py-3 text-[#0D1B2A] font-medium shadow-[inset_2px_2px_5px_rgba(166,180,200,0.45),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#F3F5F8] border-none rounded-xl px-4 py-3 text-[#0D1B2A] font-medium shadow-[inset_2px_2px_5px_rgba(166,180,200,0.45),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider">Age</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  className="w-full bg-[#F3F5F8] border-none rounded-xl px-4 py-3 text-[#0D1B2A] font-medium shadow-[inset_2px_2px_5px_rgba(166,180,200,0.45),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider">Blood Type</label>
                <input 
                  type="text" 
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="e.g. O Positive"
                  className="w-full bg-[#F3F5F8] border-none rounded-xl px-4 py-3 text-[#0D1B2A] font-medium shadow-[inset_2px_2px_5px_rgba(166,180,200,0.45),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="frosted-card rounded-3xl p-8 border border-white/90 card-lift transition-all delay-200 anim-slide-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-amber-50 text-[#FF9500]">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1B2A]">Notifications</h3>
          </div>
          <div className="h-px w-full bg-slate-200/50 mb-6"></div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between neu-card rounded-2xl p-4 bg-white/40">
              <div>
                <p className="font-bold text-[#0D1B2A]">Appointments</p>
                <p className="text-xs font-medium text-[#9BAABF] mt-1">Get reminded about upcoming visits</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, appointments: !notifications.appointments})}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 shadow-inner shrink-0 ${notifications.appointments ? 'bg-[#0066FF]' : 'bg-[#D1D8E0]'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${notifications.appointments ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
            
            <div className="flex items-center justify-between neu-card rounded-2xl p-4 bg-white/40">
              <div>
                <p className="font-bold text-[#0D1B2A]">Lab Results</p>
                <p className="text-xs font-medium text-[#9BAABF] mt-1">Instant alerts when results are ready</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, labResults: !notifications.labResults})}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 shadow-inner shrink-0 ${notifications.labResults ? 'bg-[#0066FF]' : 'bg-[#D1D8E0]'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${notifications.labResults ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>

            <div className="flex items-center justify-between neu-card rounded-2xl p-4 bg-white/40">
              <div>
                <p className="font-bold text-[#0D1B2A]">Medication Reminders</p>
                <p className="text-xs font-medium text-[#9BAABF] mt-1">Daily push notifications for prescriptions</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, medicationReminders: !notifications.medicationReminders})}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 shadow-inner shrink-0 ${notifications.medicationReminders ? 'bg-[#0066FF]' : 'bg-[#D1D8E0]'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${notifications.medicationReminders ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="frosted-card rounded-3xl p-8 border border-white/90 card-lift transition-all delay-300 anim-slide-right">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-50 text-[#7C5CFC]">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1B2A]">Language & Region</h3>
          </div>
          <div className="h-px w-full bg-slate-200/50 mb-6"></div>
          
          <div className="flex flex-wrap gap-4">
            {['English', 'Spanish', 'French', 'German'].map(lang => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all shadow-sm
                  ${language === lang 
                    ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white text-[#0D1B2A] hover:bg-slate-50 border border-slate-100'
                  }`}
              >
                {lang === 'English' ? '🇺🇸 ' : lang === 'Spanish' ? '🇪🇸 ' : lang === 'French' ? '🇫🇷 ' : '🇩🇪 '}{lang}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy & Permissions Section */}
        <div className="frosted-card rounded-3xl p-8 border border-white/90 card-lift transition-all delay-400 anim-slide-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-teal-50 text-[#00D4AA]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0D1B2A]">Privacy & Device Permissions</h3>
              <p className="text-xs font-medium text-[#9BAABF] mt-0.5">Control how HealthBridge uses your location, camera, and emergency medical pass</p>
            </div>
          </div>
          <div className="h-px w-full bg-slate-200/50 mb-6"></div>
          
          <div className="space-y-4">
            {/* Location Status Card */}
            <div className="neu-card rounded-2xl p-5 bg-white/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-[#0066FF] rounded-xl font-bold text-xs shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#0D1B2A]">Location Access</p>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        locationPermissionState === 'allowed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : locationPermissionState === 'denied'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {locationPermissionState === 'allowed'
                          ? 'Location available'
                          : locationPermissionState === 'denied'
                          ? 'Permission denied'
                          : 'Location not requested'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#9BAABF] mt-1">
                      Used for nearby care, hospitals, pharmacies, and Emergency SOS location sharing.
                    </p>
                  </div>
                </div>
                <button
                  onClick={requestUserLocation}
                  className="pill-btn pill-btn-primary text-xs shrink-0 self-start sm:self-center flex items-center gap-1.5"
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>{locationPermissionState === 'allowed' ? 'Refresh GPS' : 'Enable Location'}</span>
                </button>
              </div>
              {userLocation && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{userAddress || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}</span>
                </div>
              )}
            </div>

            {/* Camera Status Card */}
            <div className="neu-card rounded-2xl p-5 bg-white/40 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 bg-violet-50 text-[#7C5CFC] rounded-xl font-bold text-xs shrink-0">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#0D1B2A]">Camera Access</p>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        cameraPermissionState === 'allowed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : cameraPermissionState === 'denied'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {cameraPermissionState === 'allowed'
                          ? 'Camera available'
                          : cameraPermissionState === 'denied'
                          ? 'Permission denied'
                          : 'Not requested'}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#9BAABF] mt-1">
                      Used strictly when explicitly initiating Doctor QR scanner or document uploads.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency QR Health Pass Toggle Card */}
            <div className="flex items-center justify-between neu-card rounded-2xl p-4 bg-white/40">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-teal-50 rounded-xl text-[#00D4AA] hidden sm:block">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-[#0D1B2A]">Emergency QR Pass Authorization</p>
                  <p className="text-xs font-medium text-[#9BAABF] mt-1 max-w-sm">Allow verified clinical doctors to scan signed QR token for emergency medical data.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setQrSharingEnabled(!qrSharingEnabled);
                  showToast(qrSharingEnabled ? 'Emergency QR Access Disabled' : 'Emergency QR Access Enabled');
                }}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 shadow-inner shrink-0 ${qrSharingEnabled ? 'bg-[#0066FF]' : 'bg-[#D1D8E0]'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${qrSharingEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>

            {/* Data Portability */}
            <div className="flex items-center justify-between neu-card rounded-2xl p-4 bg-white/40">
              <div>
                <p className="font-bold text-[#0D1B2A]">Data Portability</p>
                <p className="text-xs font-medium text-[#9BAABF] mt-1">Download a copy of your complete health records.</p>
              </div>
              <button 
                onClick={() => showToast('Exporting complete patient JSON record archive...')}
                className="pill-btn pill-btn-ghost flex items-center gap-2 text-sm shrink-0"
              >
                <Download className="h-4 w-4" /> Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="frosted-card rounded-3xl p-8 border border-red-200 bg-red-50/30 card-lift transition-all delay-500 anim-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-red-100 text-[#FF3366]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-[#FF3366]">Danger Zone</h3>
          </div>
          <div className="h-px w-full bg-red-200/50 mb-6"></div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                clearAllDataToFreshState();
                showToast('App state reset successfully.');
              }}
              className="px-6 py-3 rounded-full text-sm font-bold bg-white text-[#FF3366] border border-red-200 shadow-sm hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Reset App State
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
