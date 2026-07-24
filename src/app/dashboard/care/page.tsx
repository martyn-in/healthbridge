'use client';

import React, { useState } from 'react';
import {
  MapPin,
  PhoneCall,
  Navigation,
  Clock,
  Star,
  Search,
  Filter,
  ShieldAlert,
  Sparkles,
  Map as MapIcon,
  List,
  Building2,
  CheckCircle,
  Accessibility,
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
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const facilities = searchNearbyFacilities(
    userLocation?.lat,
    userLocation?.lng,
    userAddress,
    category,
    searchQuery
  );

  const categories = ['All', 'Hospital', 'Clinic', 'Pharmacy', 'Diagnostic', 'Emergency'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-800 to-navy-900 p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-cyan-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Flagship Workflow #5
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Nearby Healthcare & Emergency Discovery
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Locate 24/7 emergency trauma centers, verified hospitals, neighborhood pharmacies, and diagnostic clinics.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-950/60 border border-teal-500/40 text-xs font-semibold text-cyan-300">
            <MapPin className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span>Real GPS Location: <strong className="text-white">{userAddress}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={requestUserLocation}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Compass className="h-4 w-4 text-cyan-300" /> Refresh Live GPS
          </button>
          <button
            onClick={triggerSos}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 animate-pulse"
          >
            <ShieldAlert className="h-4 w-4" /> Trigger Emergency SOS
          </button>
        </div>
      </div>

      {/* Filter Toolbar & View Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search hospital name, area in ${userAddress}...`}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'Emergency' ? '🚨 24/7 Trauma' : cat}
            </button>
          ))}
        </div>

        {/* Map / List Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-teal-600 shadow' : 'text-slate-500'
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'map' ? 'bg-white dark:bg-slate-900 text-teal-600 shadow' : 'text-slate-500'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" /> Map View
          </button>
        </div>
      </div>

      {/* Main Facilities View */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-card border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      fac.isEmergencyAvailable
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-cyan-300'
                    }`}
                  >
                    {fac.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> {fac.rating}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {fac.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-start gap-1">
                  <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{fac.address}</span>
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <span className="font-bold text-teal-600 dark:text-cyan-400">
                    {fac.distanceKm} km away
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-500" /> {fac.openHours}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs">
                <a
                  href={`tel:${fac.phone}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5" /> Call
                </a>
                <a
                  href={`https://maps.google.com/?q=${fac.latitude},${fac.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-200"
                >
                  <Navigation className="h-3.5 w-3.5" /> Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Polished Interactive Map Mode */
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-[500px] border border-slate-800 shadow-xl flex items-center justify-center">
          {/* Simulated Vector Grid Map Background */}
          <div
            className="absolute inset-0 opacity-40 bg-[radial-gradient(#14B8A6_1px,transparent_1px)]"
            style={{ backgroundSize: '24px 24px' }}
          />

          {/* Map Facility Markers */}
          {facilities.map((fac, idx) => (
            <div
              key={fac.id}
              onClick={() => setSelectedFacility(fac)}
              style={{
                position: 'absolute',
                left: `${20 + (idx * 16) % 70}%`,
                top: `${25 + (idx * 14) % 60}%`,
              }}
              className="cursor-pointer transition-transform hover:scale-110 group z-10"
            >
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg text-xs font-bold text-white border ${
                  fac.isEmergencyAvailable
                    ? 'bg-red-600 border-red-400'
                    : 'bg-navy-900 border-teal-400'
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-cyan-300" />
                <span>{fac.name.split(' ')[0]} ({fac.distanceKm}km)</span>
              </div>
            </div>
          ))}

          {/* Map Overlay info box */}
          {selectedFacility ? (
            <div className="absolute bottom-6 left-6 right-6 max-w-md bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-teal-500 z-20 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-teal-600 uppercase">
                    {selectedFacility.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedFacility.name}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedFacility.address}</p>
                </div>
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-2 text-xs pt-1">
                <a
                  href={`tel:${selectedFacility.phone}`}
                  className="flex-1 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-center"
                >
                  Call {selectedFacility.phone}
                </a>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-4 left-4 bg-slate-900/80 text-white px-3 py-1.5 rounded-xl text-xs backdrop-blur border border-slate-700">
              📍 Real GPS Map: {userAddress}. Click pins to view facility details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
