'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Droplets, Moon, Wind, Play, Pause, Plus, Minus, Activity, Flame, Trophy, Brain, Footprints, ChevronRight } from 'lucide-react';
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

  const removeWater = () => {
    const newVol = Math.max(0, wellness.waterIntakeMl - 250);
    updateWellness({ waterIntakeMl: newVol });
  };

  const addSleep = () => {
    updateWellness({ sleepHours: Math.min(24, wellness.sleepHours + 0.5) });
  };

  const removeSleep = () => {
    updateWellness({ sleepHours: Math.max(0, wellness.sleepHours - 0.5) });
  };

  const [steps, setSteps] = useState(6450);
  const addSteps = () => setSteps(s => Math.min(20000, s + 500));
  const removeSteps = () => setSteps(s => Math.max(0, s - 500));

  const [mindfulness, setMindfulness] = useState(15);
  const addMindfulness = () => setMindfulness(m => Math.min(120, m + 5));
  const removeMindfulness = () => setMindfulness(m => Math.max(0, m - 5));

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // SVG Metric Ring Component
  const MetricRing = ({ value, max, color, icon: Icon, title, unit, onAdd, onMinus }: any) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="bg-white dark:bg-[#1E204A] rounded-3xl p-6 flex flex-col items-center justify-between h-full border border-[#2F3273]/15 dark:border-white/15 shadow-sm">
        <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-sm font-extrabold text-[#2F3273] dark:text-white">{title}</h3>
          <div className="p-2 rounded-2xl bg-[#F4F5FB] dark:bg-[#2F3273]">
            <Icon className="h-5 w-5 text-[#4D50A2] dark:text-[#F9DF77]" />
          </div>
        </div>
        
        <div className="relative flex items-center justify-center mb-6 mt-2">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#F4F5FB" strokeWidth="12" />
            <circle
              cx="60" cy="60" r={radius} fill="transparent" stroke={color} strokeWidth="12"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#2F3273] dark:text-white tracking-tighter">{value}</span>
            <span className="text-[10px] font-extrabold text-[#4D50A2] dark:text-[#CBD0FB] uppercase">{unit}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full justify-between items-center mt-auto pt-2">
          <button onClick={onMinus} className="w-9 h-9 rounded-full bg-[#F4F5FB] dark:bg-[#2F3273] hover:bg-[#4D50A2] hover:text-white flex items-center justify-center text-[#4D50A2] dark:text-[#F9DF77] transition-colors">
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex flex-col justify-center items-center px-1">
            <span className="text-[10px] font-extrabold text-[#4D50A2] dark:text-[#CBD0FB] uppercase tracking-wider">Target</span>
            <span className="text-xs font-bold text-[#2F3273] dark:text-white">{max} {unit}</span>
          </div>
          <button onClick={onAdd} className="w-9 h-9 rounded-full bg-[#4D50A2] text-white hover:bg-[#2F3273] flex items-center justify-center transition-colors font-bold">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10 font-sans selection:bg-[#4D50A2] selection:text-white">
      {/* Hero header */}
      <div className="bg-[#2F3273] text-white rounded-3xl p-7 border border-[#4D50A2]/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-[#4D50A2] flex items-center justify-center text-[#F9DF77]">
              <HeartPulse className="h-7 w-7" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#CBD0FB] mb-0.5">{todayDate}</div>
              <h1 className="text-3xl font-black text-white tracking-tight">Wellness & Goals</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1E204A] px-4 py-2.5 rounded-2xl border border-[#4D50A2]/40">
              <Flame className="h-5 w-5 text-[#F9DF77]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#CBD0FB] uppercase leading-none">Current Streak</span>
                <span className="text-sm font-extrabold text-white leading-none mt-1">12 Days</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#1E204A] px-4 py-2.5 rounded-2xl border border-[#4D50A2]/40">
              <Trophy className="h-5 w-5 text-[#F9DF77]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#CBD0FB] uppercase leading-none">Best Streak</span>
                <span className="text-sm font-extrabold text-white leading-none mt-1">24 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 2x2 Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricRing 
            title="Sleep Hygiene" value={wellness.sleepHours} max={8} color="#4D50A2" 
            icon={Moon} unit="hrs" onAdd={addSleep} onMinus={removeSleep}
          />
          <MetricRing 
            title="Daily Steps" value={steps} max={10000} color="#4D50A2" 
            icon={Footprints} unit="steps" onAdd={addSteps} onMinus={removeSteps}
          />
          <MetricRing 
            title="Hydration" value={wellness.waterIntakeMl} max={wellness.waterGoalMl || 2500} color="#F9DF77" 
            icon={Droplets} unit="ml" onAdd={addWater} onMinus={removeWater}
          />
          <MetricRing 
            title="Mindfulness" value={mindfulness} max={30} color="#4D50A2" 
            icon={Brain} unit="mins" onAdd={addMindfulness} onMinus={removeMindfulness}
          />
        </div>

        {/* Right Column: Sparkline, Stats & Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Weekly Activity */}
          <div className="bg-white dark:bg-[#1E204A] rounded-3xl p-6 border border-[#2F3273]/15 dark:border-white/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#2F3273] dark:text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#4D50A2]" /> Weekly Activity
              </h3>
              <span className="text-xs font-black text-[#2F3273] bg-[#F9DF77] px-3 py-1 rounded-full">+14% vs last week</span>
            </div>
            
            <div className="h-28 w-full flex items-end justify-between gap-2 relative pt-4">
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M0,70 Q40,30 80,50 T160,25 T240,60 T320,15" fill="none" stroke="#4D50A2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0,70 Q40,30 80,50 T160,25 T240,60 T320,15 L320,100 L0,100 Z" fill="#4D50A2" opacity="0.08" />
              </svg>
              
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1 z-10 w-full">
                  <div className="w-full bg-[#F4F5FB] dark:bg-[#2F3273] rounded-t-lg h-16 opacity-40"></div>
                  <span className="text-[10px] font-extrabold text-[#4D50A2] dark:text-[#CBD0FB]">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-7-8 Breathing Exercise */}
          <div className="bg-white dark:bg-[#1E204A] rounded-3xl p-6 border border-[#2F3273]/15 dark:border-white/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#2F3273] dark:text-white flex items-center gap-2">
                <Wind className="h-4 w-4 text-[#4D50A2]" /> 4-7-8 Breathing
              </h3>
              <span className="text-[10px] font-black uppercase text-[#2F3273] bg-[#F9DF77] px-2 py-0.5 rounded-full">
                {isBreathingActive ? breathingPhase : 'Ready'}
              </span>
            </div>

            <div className="flex items-center justify-between bg-[#F4F5FB] dark:bg-[#2F3273] p-4 rounded-2xl border border-[#2F3273]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#4D50A2] text-[#F9DF77] font-black text-lg flex items-center justify-center">
                  {timerCount}s
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2F3273] dark:text-white">
                    {isBreathingActive ? `${breathingPhase} deeply...` : 'Relieve stress and reset focus'}
                  </div>
                  <div className="text-[10px] text-[#4D50A2] dark:text-[#CBD0FB]">Clinical vagus nerve relaxation technique</div>
                </div>
              </div>

              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className="w-10 h-10 rounded-full bg-[#4D50A2] text-white flex items-center justify-center shadow-sm hover:scale-105 transition-all"
              >
                {isBreathingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Suggested Recommendations */}
          <div className="bg-white dark:bg-[#1E204A] rounded-3xl p-6 border border-[#2F3273]/15 dark:border-white/15 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-[#2F3273] dark:text-white">Suggested for You</h3>
            
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F5FB] dark:bg-[#2F3273] border border-[#2F3273]/10 hover:border-[#4D50A2] transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#4D50A2] text-[#F9DF77] flex items-center justify-center">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#2F3273] dark:text-white">Improve Sleep Quality</div>
                  <div className="text-[10px] text-[#4D50A2] dark:text-[#CBD0FB]">Try winding down 30m earlier tonight</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#4D50A2]" />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F5FB] dark:bg-[#2F3273] border border-[#2F3273]/10 hover:border-[#4D50A2] transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#4D50A2] text-[#F9DF77] flex items-center justify-center">
                  <Footprints className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#2F3273] dark:text-white">Increase Daily Steps</div>
                  <div className="text-[10px] text-[#4D50A2] dark:text-[#CBD0FB]">You are 3,550 steps away from your goal</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#4D50A2]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
