'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Droplets, Moon, Footprints, Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function WellnessPage() {
  const { wellness, updateWellness, showToast } = useApp();

  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timerCount, setTimerCount] = useState(4);

  useEffect(() => {
    let interval: any;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setTimerCount((prev) => {
          if (prev <= 1) {
            if (breathingPhase === 'Inhale') {
              setBreathingPhase('Hold');
              return 7;
            } else if (breathingPhase === 'Hold') {
              setBreathingPhase('Exhale');
              return 8;
            } else {
              setBreathingPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  const addWater = () => {
    const newVol = Math.min(3000, wellness.waterIntakeMl + 250);
    updateWellness({ waterIntakeMl: newVol });
    showToast('Added +250ml water intake');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-teal-800 to-navy-900 p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Daily Wellness & Mindfulness
          </h1>
          <p className="text-sm text-slate-200 mt-1 max-w-xl">
            Supportive, non-medical wellness tools for hydration tracking, sleep hygiene, and guided breathing exercises.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hydration Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Hydration Tracker</h3>
            </div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {wellness.waterIntakeMl} / {wellness.waterGoalMl} ml
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (wellness.waterIntakeMl / wellness.waterGoalMl) * 100)}%` }}
            />
          </div>

          <button
            onClick={addWater}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow transition-colors"
          >
            + Add Glass of Water (250 ml)
          </button>
        </div>

        {/* Sleep Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Moon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sleep Check-in</h3>
          </div>

          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {wellness.sleepHours} <span className="text-sm font-normal text-slate-500">hours recorded</span>
          </div>
          <p className="text-xs text-slate-500">Target: 7.0 - 8.5 hours of uninterrupted restful sleep.</p>
        </div>

        {/* Guided Breathing Timer */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-card border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Wind className="h-5 w-5 text-teal-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Guided 4-7-8 Breathing</h3>
          </div>

          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-black shadow-lg animate-pulse">
            <div>
              <div className="text-2xl">{timerCount}s</div>
              <div className="text-[10px] uppercase tracking-wider">{breathingPhase}</div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700 flex items-center gap-1"
            >
              {isBreathingActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isBreathingActive ? 'Pause' : 'Start Timer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
