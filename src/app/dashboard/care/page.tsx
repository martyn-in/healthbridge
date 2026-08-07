'use client';
import React, { useState } from 'react';
import {
  MapPin,
  PhoneCall,
  Navigation,
  Clock,
  Star,
  Search,
  ShieldAlert,
  Map as MapIcon,
  List,
  Building2,
  Compass,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { searchNearbyFacilities } from '@/services/mapService';
import { Facility } from '@/types';

export default function CareDiscoveryPage() {
  const { userLocation, userAddress, requestUserLocation, triggerSos } = useApp();

  const [category, setCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const facilities = searchNearbyFacilities(
    userLocation?.lat,
    userLocation?.lng,
    userAddress,
    category,
    searchQuery
  );

  const categories = ['All', 'Hospital', 'Clinic', 'Pharmacy', 'Diagnostic', 'Emergency'];
  
  const hasEmergency = facilities.some(f => f.isEmergencyAvailable);

  const getTypeColor = (type: string, isEmergency: boolean) => {
    if (isEmergency) return { bg: '#FFF0F3', text: '#FF3366', border: 'rgba(255,51,102,0.2)' };
    if (type === 'Hospital') return { bg: '#F0F6FF', text: '#0066FF', border: 'rgba(0,102,255,0.2)' };
    if (type === 'Clinic') return { bg: '#F0FDF8', text: '#00D4AA', border: 'rgba(0,212,170,0.2)' };
    if (type === 'Pharmacy') return { bg: '#FFF8F0', text: '#FF9500', border: 'rgba(255,149,0,0.2)' };
    return { bg: '#F3F5F8', text: '#7C5CFC', border: 'rgba(124,92,252,0.2)' };
  };

  return (
    <div className="space-y-6 relative">
      {hasEmergency && (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-[#FF3366]/30 shadow-[0_4px_16px_rgba(255,51,102,0.15)] anim-fade-up">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3366] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF3366]"></span>
            </span>
            <span className="text-sm font-bold text-[#FF3366]">Nearby Emergency Facilities Available</span>
          </div>
          <button onClick={() => setCategory('Emergency')} className="text-xs font-bold px-3 py-1 rounded-full bg-[#FF3366]/10 text-[#FF3366] hover:bg-[#FF3366]/20 transition-colors">
            View ERs
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="frosted-card rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 anim-fade-up">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#00C2FF] flex items-center justify-center text-white shadow-md">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/60 border border-white text-xs font-semibold text-[#0066FF] flex items-center gap-1.5 shadow-sm backdrop-blur-md">
              <Compass className="h-3.5 w-3.5" />
              {userAddress}
            </span>
          </div>
          
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0D1B2A]">
            Nearby Healthcare
          </h1>
          <p className="text-sm text-[#9BAABF] mt-1 max-w-xl leading-relaxed font-medium">
            Find 24/7 emergency trauma centers, verified hospitals, neighborhood pharmacies, and diagnostic laboratories.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={requestUserLocation}
            className="pill-btn pill-btn-ghost text-xs flex items-center gap-1.5 bg-white/50 border border-white"
          >
            <Compass className="h-4 w-4" style={{ color: '#0066FF' }} /> Refresh GPS
          </button>
          <button
            onClick={triggerSos}
            className="pill-btn text-xs text-white shadow-md flex items-center gap-1.5"
            style={{ background: '#FF3366', boxShadow: '0 4px 12px rgba(255,51,102,0.3)' }}
          >
            <ShieldAlert className="h-4 w-4" /> SOS
          </button>
        </div>
      </div>

      {/* Filter Toolbar & View Toggle */}
      <div className="frosted-card rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm anim-fade-up delay-100">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#9BAABF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search hospital name, area near ${userAddress}...`}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl bg-white/50 border border-white/60 text-[#0D1B2A] placeholder-[#9BAABF] focus:bg-white outline-none transition-all focus:border-[#0066FF]/30 focus:shadow-[0_0_0_2px_rgba(0,102,255,0.1)]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-[#0066FF] text-white shadow-md'
                  : 'bg-white/40 text-[#9BAABF] hover:bg-white/80 hover:text-[#0D1B2A]'
              }`}
            >
              {cat === 'Emergency' ? '24/7 ER' : cat}
            </button>
          ))}
        </div>

        {/* Map / List Toggle */}
        <div className="flex items-center bg-slate-200/50 p-1 rounded-xl shrink-0 backdrop-blur-sm border border-white/40">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-white text-[#0066FF] shadow-sm' : 'text-[#9BAABF] hover:text-[#0D1B2A]'
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'map' ? 'bg-white text-[#0066FF] shadow-sm' : 'text-[#9BAABF] hover:text-[#0D1B2A]'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" /> Map
          </button>
        </div>
      </div>

      {/* Main Facilities View */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => {
            const colors = getTypeColor(fac.type, fac.isEmergencyAvailable);
            const delay = Math.min(100 + idx * 100, 700);
            
            return (
              <div
                key={fac.id}
                className={`neu-card card-lift p-5 rounded-3xl flex flex-col justify-between space-y-4 anim-fade-up delay-${delay}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1"
                      style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                    >
                      {fac.isEmergencyAvailable && <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.text }} />}
                      {fac.type}
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white text-[10px] font-mono font-bold text-[#0D1B2A] shadow-sm flex items-center gap-1">
                      <Navigation className="h-3 w-3" style={{ color: '#0066FF' }}/>
                      {fac.distanceKm} km
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#0D1B2A] flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50">
                      <Building2 className="h-4 w-4" style={{ color: '#0066FF' }} />
                    </div>
                    {fac.name}
                  </h3>

                  <p className="text-xs font-medium text-[#9BAABF] line-clamp-2 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70" />
                    {fac.address}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-semibold pt-1">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50" style={{ color: '#FF9500' }}>
                      <Star className="h-3.5 w-3.5 fill-current" /> {fac.rating}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-[#0D1B2A]">
                      <Clock className="h-3.5 w-3.5 text-[#9BAABF]" /> {fac.openHours}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#9BAABF]/10">
                  <a
                    href={`tel:${fac.phone}`}
                    className="flex-1 pill-btn pill-btn-ghost text-xs flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="h-3.5 w-3.5" style={{ color: '#00D4AA' }} /> Call
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(fac.name + ' ' + fac.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 pill-btn pill-btn-primary text-xs flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Navigate
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Map Preview View */
        <div className="frosted-card rounded-3xl p-8 text-center space-y-6 anim-fade-up">
          <div className="max-w-md mx-auto space-y-3 relative z-10">
            <div className="h-16 w-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center shadow-inner border border-blue-100/50">
               <Compass className="h-8 w-8" style={{ color: '#0066FF' }} />
            </div>
            <h3 className="text-lg font-extrabold text-[#0D1B2A]">Geographic Map View</h3>
            <p className="text-sm font-medium text-[#9BAABF] leading-relaxed">
              Showing {facilities.length} healthcare facilities within 10 km radius of <span className="font-bold" style={{ color: '#0066FF' }}>{userAddress}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left pt-6 border-t border-[#9BAABF]/10 relative z-10">
            {facilities.slice(0, 6).map((fac) => {
               const colors = getTypeColor(fac.type, fac.isEmergencyAvailable);
               return (
                <div key={fac.id} className="p-4 rounded-2xl bg-white/60 border border-white shadow-sm hover:shadow-md transition-shadow text-xs space-y-2 backdrop-blur-md">
                  <div className="font-extrabold text-[#0D1B2A] flex items-center justify-between">
                    <span className="truncate pr-2">{fac.name}</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-50 shrink-0" style={{ color: '#0066FF' }}>{fac.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ backgroundColor: colors.bg, color: colors.text }}>{fac.type}</span>
                    <span className="font-medium text-[#9BAABF]">{fac.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
