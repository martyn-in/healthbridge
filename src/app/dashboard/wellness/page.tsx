'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Droplets, Moon, Wind, Play, Pause, Plus, Minus, Activity, Flame, Trophy, TrendingUp, Brain, Footprints, ChevronRight } from 'lucide-react';
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

  // Steps dummy state
  const [steps, setSteps] = useState(6450);
  const addSteps = () => setSteps(s => Math.min(20000, s + 500));
  const removeSteps = () => setSteps(s => Math.max(0, s - 500));

  // Mindfulness dummy state
  const [mindfulness, setMindfulness] = useState(15);
  const addMindfulness = () => setMindfulness(m => Math.min(120, m + 5));
  const removeMindfulness = () => setMindfulness(m => Math.max(0, m - 5));

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // SVG Metric Ring Component
  const MetricRing = ({ value, max, color, icon: Icon, title, unit, onAdd, onMinus, delay }: any) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`neu-card rounded-3xl p-6 flex flex-col items-center justify-between h-full card-lift anim-fade-up ${delay}`}>
        <div className="w-full flex justify-between items-center mb-4">
          <h3 className="text-sm font-extrabold text-[#0D1B2A]">{title}</h3>
          <div className="p-2 rounded-2xl" style={{ backgroundColor: `${color}15` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
        
        <div className="relative flex items-center justify-center mb-6 mt-2">
          <svg width="120" height="120" className="transform -rotate-90 drop-shadow-sm">
            <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
            <circle
              cx="60" cy="60" r={radius} fill="transparent" stroke={color} strokeWidth="12"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#0D1B2A] tracking-tighter">{value}</span>
            <span className="text-[10px] font-bold text-[#9BAABF] uppercase">{unit}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full justify-between items-center mt-auto pt-2">
          <button onClick={onMinus} className="pill-btn pill-btn-ghost p-2.5 rounded-full !w-auto shadow-sm" style={{ color }}>
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex flex-col justify-center items-center px-1">
            <span className="text-[10px] font-extrabold text-[#9BAABF] uppercase tracking-wider">Target</span>
            <span className="text-xs font-bold text-[#0D1B2A]">{max} {unit}</span>
          </div>
          <button onClick={onAdd} className="pill-btn pill-btn-ghost p-2.5 rounded-full !w-auto shadow-sm" style={{ color }}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Hero header */}
      <div className="frosted-card rounded-3xl p-8 relative overflow-hidden anim-fade-up border-0 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center" style={{ boxShadow: '0 8px 24px rgba(0, 200, 117, 0.2)' }}>
              <HeartPulse className="h-8 w-8" style={{ color: '#00C875' }} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#9BAABF] mb-1">{todayDate}</div>
              <h1 className="text-3xl font-black text-[#0D1B2A] tracking-tight">Wellness & Goals</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <Flame className="h-5 w-5" style={{ color: '#FF9500' }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#9BAABF] uppercase leading-none">Current Streak</span>
                <span className="text-sm font-black text-[#0D1B2A] leading-none mt-1">12 Days</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <Trophy className="h-5 w-5" style={{ color: '#7C5CFC' }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#9BAABF] uppercase leading-none">Best Streak</span>
                <span className="text-sm font-black text-[#0D1B2A] leading-none mt-1">24 Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: 2x2 Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MetricRing 
            title="Sleep Hygiene" value={wellness.sleepHours} max={8} color="#7C5CFC" 
            icon={Moon} unit="hrs" onAdd={addSleep} onMinus={removeSleep} delay="delay-100"
          />
          <MetricRing 
            title="Daily Steps" value={steps} max={10000} color="#0066FF" 
            icon={Footprints} unit="steps" onAdd={addSteps} onMinus={removeSteps} delay="delay-200"
          />
          <MetricRing 
            title="Hydration" value={wellness.waterIntakeMl} max={wellness.waterGoalMl || 2000} color="#00C2FF" 
            icon={Droplets} unit="ml" onAdd={addWater} onMinus={removeWater} delay="delay-300"
          />
          <MetricRing 
            title="Mindfulness" value={mindfulness} max={30} color="#00D4AA" 
            icon={Brain} unit="mins" onAdd={addMindfulness} onMinus={removeMindfulness} delay="delay-400"
          />
        </div>

        {/* Right Column: Sparkline, Stats & Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 3. Weekly Activity Sparkline */}
          <div className="frosted-card rounded-3xl p-6 anim-slide-left delay-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-extrabold text-[#0D1B2A] flex items-center gap-2">
                <Activity className="h-4 w-4" style={{ color: '#0066FF' }} /> Weekly Activity
              </h3>
              <span className="text-xs font-bold text-[#0066FF] bg-[#0066FF] bg-opacity-10 px-2.5 py-1 rounded-full">+14% vs last week</span>
            </div>
            
            <div className="h-32 w-full flex items-end justify-between gap-2 relative">
              {/* Sparkline SVG */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d="M0,80 Q40,40 80,60 T160,30 T240,70 T320,20" className="sparkline-path" fill="none" stroke="#0066FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0,80 Q40,40 80,60 T160,30 T240,70 T320,20 L320,120 L0,120 Z" fill="url(#blue-grad)" opacity="0.1" />
                <defs>
                  <linearGradient id="blue-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0066FF" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Bars just for visual structure behind sparkline */}
              {[40, 60, 45, 80, 50, 90, 75].map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2 z-10 w-full">
                  <div className="w-full bg-slate-100 rounded-t-lg h-24 relative overflow-hidden group">
                     <div className="absolute bottom-0 w-full bg-[#0066FF] opacity-10 group-hover:opacity-20 transition-opacity rounded-t-lg" style={{ height: `${val}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-[#9BAABF]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guided Breathing Mini-Card (Keeping logic intact) */}
          <div className="neu-card rounded-3xl p-6 anim-slide-left delay-200">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-extrabold text-[#0D1B2A] flex items-center gap-2">
                 <Wind className="h-4 w-4" style={{ color: '#00D4AA' }} /> 4-7-8 Breathing
               </h3>
               <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${isBreathingActive ? 'bg-[#00D4AA] text-white' : 'bg-slate-100 text-[#9BAABF]'}`}>
                 {isBreathingActive ? breathingPhase : 'Ready'}
               </div>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-white shadow-sm border-2 border-slate-50 flex items-center justify-center relative overflow-hidden">
                    {isBreathingActive && (
                      <div className="absolute inset-0 bg-[#00D4AA] opacity-20 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
                    )}
                    <span className="text-lg font-black text-[#0D1B2A] z-10">{timerCount}s</span>
                  </div>
                  <p className="text-xs text-[#9BAABF] font-medium max-w-[120px]">Relieve stress and reset your focus.</p>
                </div>
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className="pill-btn pill-btn-primary bg-[#00D4AA] hover:bg-[#00C875] border-none shadow-lg shadow-teal-500/30"
                >
                  {isBreathingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
             </div>
          </div>

          {/* 4. Recommendation Cards */}
          <div className="space-y-3 anim-slide-left delay-300">
            <h3 className="text-sm font-extrabold text-[#0D1B2A] mb-3 ml-2">Suggested for You</h3>
            
            <div 
              onClick={() => showToast('Tip: Turning off screens 30m before bed increases REM sleep by up to 18%.')} 
              className="frosted-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/80 transition-colors group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#0066FF] flex items-center justify-center text-white shadow-sm shrink-0">
                <Moon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#0D1B2A]">Improve Sleep Quality</h4>
                <p className="text-xs text-[#9BAABF] line-clamp-1">Try winding down 30m earlier tonight.</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#7C5CFC] group-hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div 
              onClick={() => showToast('Goal update: A 15-minute walk will complete your daily step goal!')} 
              className="frosted-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-white/80 transition-colors group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF9500] to-[#FF3366] flex items-center justify-center text-white shadow-sm shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#0D1B2A]">Increase Daily Steps</h4>
                <p className="text-xs text-[#9BAABF] line-clamp-1">You are 3,550 steps away from goal.</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#FF9500] group-hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
