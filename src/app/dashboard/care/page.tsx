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
          
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Nearby Healthcare
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xl leading-relaxed font-semibold">
            Find 24/7 emergency trauma centers, verified hospitals, neighborhood pharmacies, and diagnostic laboratories.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={requestUserLocation}
            className="btn-rect btn-rect-glass text-xs"
          >
            <Compass className="h-4 w-4 text-indigo-500" /> Refresh GPS
          </button>
          <button
            onClick={triggerSos}
            className="sos-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs font-extrabold uppercase tracking-wider"
            style={{ background: '#EF4444' }}
          >
            <ShieldAlert className="h-4 w-4" /> SOS
          </button>
        </div>
      </div>

      {/* Filter Toolbar & View Toggle */}
      <div className="glass-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm anim-fade-up delay-100">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search hospital name, area near ${userAddress}...`}
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl glass-subcard text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                category === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'glass-subcard text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat === 'Emergency' ? '24/7 ER' : cat}
            </button>
          ))}
        </div>

        {/* Map / List Toggle */}
        <div className="flex items-center glass-subcard p-1 rounded-xl shrink-0 border border-white/20">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'map' ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                className={`glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 anim-fade-up delay-${delay}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span
                      className="px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1"
                      style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                    >
                      {fac.isEmergencyAvailable && <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.text }} />}
                      {fac.type}
                    </span>

                    <span className="px-2.5 py-1 rounded-lg glass-subcard text-[10px] font-mono font-bold text-[var(--text-primary)] shadow-sm flex items-center gap-1">
                      <Navigation className="h-3 w-3 text-indigo-500"/>
                      {fac.distanceKm} km
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Building2 className="h-4 w-4" />
                    </div>
                    {fac.name}
                  </h3>

                  <p className="text-xs font-semibold text-[var(--text-secondary)] line-clamp-2 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-indigo-400" />
                    {fac.address}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-semibold pt-1">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" /> {fac.rating}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-subcard text-[var(--text-primary)] font-bold">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" /> {fac.openHours}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <a
                    href={`tel:${fac.phone}`}
                    className="flex-1 btn-rect btn-rect-glass text-xs justify-center"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-emerald-500" /> Call
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(fac.name + ' ' + fac.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-rect btn-rect-primary text-xs justify-center"
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
        <div className="glass-panel p-8 text-center space-y-6 anim-fade-up rounded-2xl">
          <div className="max-w-md mx-auto space-y-3 relative z-10">
            <div className="h-16 w-16 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
               <Compass className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Geographic Map View</h3>
            <p className="text-sm font-semibold text-[var(--text-secondary)] leading-relaxed">
              Showing {facilities.length} healthcare facilities within 10 km radius of <span className="font-bold text-indigo-400">{userAddress}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left pt-6 border-t border-white/10 relative z-10">
            {facilities.slice(0, 6).map((fac) => {
               const colors = getTypeColor(fac.type, fac.isEmergencyAvailable);
               return (
                <div key={fac.id} className="p-4 rounded-xl glass-subcard text-xs space-y-2">
                  <div className="font-extrabold text-[var(--text-primary)] flex items-center justify-between">
                    <span className="truncate pr-2">{fac.name}</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 shrink-0">{fac.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ backgroundColor: colors.bg, color: colors.text }}>{fac.type}</span>
                    <span className="font-semibold text-[var(--text-secondary)]">{fac.phone}</span>
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
