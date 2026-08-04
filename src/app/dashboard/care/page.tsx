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

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="chip chip-teal mb-2 inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> Care & Emergency Locator
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Nearby Healthcare & Hospital Discovery
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Find 24/7 emergency trauma centers, verified hospitals, neighborhood pharmacies, and diagnostic laboratories.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-teal-400">
            <Compass className="h-3.5 w-3.5 shrink-0" />
            <span>Current Location: <strong className="text-white">{userAddress}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={requestUserLocation}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Compass className="h-4 w-4 text-teal-400" /> Refresh GPS
          </button>
          <button
            onClick={triggerSos}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="h-4 w-4" /> Trigger SOS Protocol
          </button>
        </div>
      </div>

      {/* Filter Toolbar & View Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search hospital name, area near ${userAddress}...`}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none"
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
              {cat === 'Emergency' ? '24/7 ER Trauma' : cat}
            </button>
          ))}
        </div>

        {/* Map / List Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'map' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" /> Map
          </button>
        </div>
      </div>

      {/* Main Facilities View */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      fac.isEmergencyAvailable
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'
                        : 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    {fac.type}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                    {fac.distanceKm} km
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>{fac.name}</span>
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {fac.address}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {fac.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3.5 w-3.5" /> {fac.openHours}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${fac.phone}`}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> Call
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(fac.name + ' ' + fac.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="h-3.5 w-3.5" /> Navigate
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Map Preview View */
        <div className="rounded-xl bg-slate-900 p-6 text-white text-center space-y-4 border border-slate-800">
          <div className="max-w-md mx-auto space-y-2">
            <Compass className="h-10 w-10 text-teal-400 mx-auto" />
            <h3 className="text-base font-bold">Interactive Geographic Map View</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Showing {facilities.length} healthcare facilities within 10 km radius of <span className="font-bold text-teal-400">{userAddress}</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left pt-4">
            {facilities.slice(0, 6).map((fac) => (
              <div key={fac.id} className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{fac.name}</span>
                  <span className="text-teal-400 font-mono text-[10px]">{fac.distanceKm} km</span>
                </div>
                <div className="text-[11px] text-slate-400">{fac.type} • {fac.phone}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
