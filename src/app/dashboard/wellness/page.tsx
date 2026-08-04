'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Droplets, Moon, Wind, Play, Pause } from 'lucide-react';
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
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <HeartPulse className="h-3.5 w-3.5" /> Supportive Care & Vitals
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Daily Wellness & Mindfulness
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Supportive, non-clinical wellness tools for hydration tracking, sleep hygiene, and guided breathing exercises.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hydration Card */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Droplets className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hydration Tracker</h3>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">
              {wellness.waterIntakeMl} / {wellness.waterGoalMl} ml
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (wellness.waterIntakeMl / wellness.waterGoalMl) * 100)}%` }}
            />
          </div>

          <button
            onClick={addWater}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            + Add Glass of Water (250 ml)
          </button>
        </div>

        {/* Sleep Card */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Moon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sleep Hygiene</h3>
          </div>

          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {wellness.sleepHours} <span className="text-xs font-normal text-slate-500">hours logged</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">Target: 7.0 - 8.5 hours of uninterrupted restful sleep.</p>
        </div>

        {/* Guided Breathing Timer */}
        <div className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Wind className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Guided 4-7-8 Breathing</h3>
          </div>

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-teal-400 font-extrabold border border-slate-800 shadow-sm">
            <div>
              <div className="text-xl">{timerCount}s</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">{breathingPhase}</div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700 flex items-center gap-1.5 transition-colors"
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
