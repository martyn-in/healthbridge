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

  return (
    <div className="space-y-6 relative">
      {hasEmergency && (
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[#FF3366]/30 shadow-md anim-fade-up">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3366] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF3366]"></span>
            </span>
            <span className="text-sm font-bold text-[#FF3366]">Nearby Emergency Facilities Available</span>
          </div>
          <button onClick={() => setCategory('Emergency')} className="text-xs font-bold px-3 py-1 rounded-full bg-[#FF3366]/15 text-[#FF3366] hover:bg-[#FF3366]/25 transition-colors">
            View ERs
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="frosted-card rounded-3xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 anim-fade-up bg-[var(--bg-card)] border border-[var(--border-subtle)]">
        <div className="relative z-10 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-[#6E56CF] flex items-center justify-center text-white shadow-md">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--accent-lavender)] border border-[var(--border-subtle)] text-xs font-semibold text-[#6E56CF] flex items-center gap-1.5 shadow-sm">
              <Compass className="h-3.5 w-3.5" />
              {userAddress}
            </span>
          </div>
          
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Nearby Healthcare
          </h1>
          <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">
            Discover verified hospitals, urgent care clinics, and pharmacies near your location.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto">
          <button
            onClick={requestUserLocation}
            className="pill-btn pill-btn-ghost text-xs flex-1 sm:flex-initial justify-center"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Update Location</span>
          </button>
          
          <button
            onClick={triggerSos}
            className="pill-btn text-white text-xs font-extrabold flex-1 sm:flex-initial justify-center bg-rose-600 hover:bg-rose-700"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>SOS Emergency</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 anim-fade-up delay-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, doctors, specialties..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[#6E56CF]"
          />
        </div>

        {/* View Mode & Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-[#6E56CF] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#6E56CF] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--border-subtle)] hidden md:block" />

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border border-[var(--border-subtle)] ${
                category === cat
                  ? 'bg-[#6E56CF] text-white shadow-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 anim-fade-up delay-200">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="frosted-card rounded-3xl p-5 space-y-4 flex flex-col justify-between transition-all card-lift bg-[var(--bg-card)] border border-[var(--border-subtle)]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1.5 bg-[#6E56CF]/15 text-[#6E56CF]"
                    >
                      {fac.type}
                    </span>
                    <h3 className="font-extrabold text-base leading-snug text-[var(--text-primary)]">
                      {fac.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    <span>{fac.rating}</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-[var(--text-secondary)] flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)] mt-0.5" />
                  <span>{fac.address}</span>
                </p>

                <div className="flex items-center gap-3 text-[11px] font-semibold text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1 text-[#6E56CF]">
                    <Navigation className="h-3 w-3" />
                    {fac.distanceKm} km away
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-500">
                    <Clock className="h-3 w-3" />
                    {fac.openHours}
                  </span>
                </div>

                {fac.specialties && fac.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {fac.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <a
                  href={`tel:${fac.phone}`}
                  className="pill-btn pill-btn-ghost flex-1 justify-center text-xs py-2"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fac.name + ' ' + fac.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-btn pill-btn-primary flex-1 justify-center text-xs py-2"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          ))}

          {facilities.length === 0 && (
            <div className="col-span-full py-16 text-center frosted-card rounded-3xl space-y-3 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <Building2 className="h-12 w-12 text-[var(--text-secondary)] mx-auto opacity-40" />
              <h4 className="text-lg font-bold text-[var(--text-primary)]">No Facilities Found</h4>
              <p className="text-xs font-medium text-[var(--text-secondary)] max-w-sm mx-auto">
                Try expanding your search query or selecting "All" categories to view nearby clinics.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Map View Simulation */
        <div className="frosted-card rounded-3xl p-6 h-[500px] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)]">
          <MapIcon className="h-16 w-16 text-[#6E56CF] opacity-60 animate-bounce" />
          <h3 className="text-xl font-extrabold text-[var(--text-primary)]">Interactive Map View Active</h3>
          <p className="text-xs font-medium text-[var(--text-secondary)] max-w-md">
            Showing {facilities.length} healthcare locations anchored around {userAddress}.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {facilities.slice(0, 4).map((f) => (
              <span key={f.id} className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent-lavender)] text-[#6E56CF]">
                📍 {f.name} ({f.distanceKm} km)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
