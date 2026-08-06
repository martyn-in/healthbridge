'use client';

import React, { useState } from 'react';
import { Syringe, Plus, CheckCircle2, Clock, AlertTriangle, Download, Calendar, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Vaccination } from '@/types';

export default function VaccinationsPage() {
  const { vaccinations, addVaccination, activeProfile, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [vaccineName, setVaccineName] = useState('');
  const [targetDisease, setTargetDisease] = useState('');
  const [doseNumber, setDoseNumber] = useState('Dose 1');
  const [dateGiven, setDateGiven] = useState(new Date().toISOString().split('T')[0]);

  const filteredVaccines = vaccinations.filter(
    (v) => v.profileId === activeProfile.id || v.profileId === 'prof-1'
  );

  const completedCount = filteredVaccines.filter(v => v.status === 'Completed').length;
  const dueCount = filteredVaccines.length - completedCount;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineName.trim()) return;
    addVaccination({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      vaccineName,
      targetDisease: targetDisease || vaccineName,
      doseNumber,
      dateGiven,
      status: 'Completed',
      givenAtFacility: 'Authorized Regional Health Centre',
    });
    setShowAddModal(false);
    setVaccineName('');
  };

  return (
    <div className="space-y-8 anim-fade-up">
      {/* Hero Header */}
      <div className="frosted-card rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0066FF 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner" style={{ background: 'rgba(0, 212, 170, 0.15)' }}>
            <Syringe size={32} style={{ color: '#00D4AA' }} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: '#0D1B2A' }}>
              Immunization Tracker
            </h1>
            <p className="mt-2 text-sm font-medium flex items-center gap-2" style={{ color: '#9BAABF' }}>
              Managing records for 
              <span className="px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.9)', color: '#0066FF' }}>
                {activeProfile.name}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="pill-btn pill-btn-primary relative z-10 anim-slide-left delay-100"
        >
          <Plus className="h-4 w-4" /> Add Vaccine
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 anim-fade-up delay-200">
        <div className="neu-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Total Vaccines</span>
            <Syringe size={20} style={{ color: '#0066FF' }} />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-black" style={{ color: '#0D1B2A' }}>{filteredVaccines.length}</span>
            <svg width="60" height="30" viewBox="0 0 60 30" className="overflow-visible">
              <path d="M0,25 Q10,5 20,20 T40,15 T60,5" fill="none" stroke="#0066FF" strokeWidth="3" strokeLinecap="round" className="sparkline-path" />
            </svg>
          </div>
        </div>
        
        <div className="neu-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Completed</span>
            <CheckCircle2 size={20} style={{ color: '#00C875' }} />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-black" style={{ color: '#0D1B2A' }}>{completedCount}</span>
            <svg width="60" height="30" viewBox="0 0 60 30" className="overflow-visible">
              <path d="M0,25 Q15,20 30,10 T60,5" fill="none" stroke="#00C875" strokeWidth="3" strokeLinecap="round" className="sparkline-path" />
            </svg>
          </div>
        </div>

        <div className="neu-card rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#9BAABF' }}>Next Due</span>
            <Clock size={20} style={{ color: '#FF9500' }} />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-4xl font-black" style={{ color: '#0D1B2A' }}>{dueCount}</span>
            <svg width="60" height="30" viewBox="0 0 60 30" className="overflow-visible">
              <path d="M0,10 Q20,10 30,20 T60,25" fill="none" stroke="#FF9500" strokeWidth="3" strokeLinecap="round" className="sparkline-path" />
            </svg>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="space-y-4 anim-fade-up delay-300">
        <h3 className="text-sm font-extrabold uppercase tracking-widest pl-2" style={{ color: '#9BAABF' }}>
          Vaccination Records
        </h3>

        {filteredVaccines.length === 0 ? (
          <div className="frosted-card rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,102,255,0.1)' }}>
              <Syringe size={40} style={{ color: '#0066FF' }} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#0D1B2A' }}>No records found</h3>
              <p className="text-sm mt-2 max-w-sm" style={{ color: '#9BAABF' }}>
                Keep track of your family's immunizations by adding your first vaccine record.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="pill-btn pill-btn-primary mt-4"
            >
              <Plus className="h-4 w-4" /> Add Vaccine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVaccines.map((vac, index) => (
              <div
                key={vac.id}
                className="frosted-card card-lift rounded-3xl p-6 flex flex-col justify-between space-y-6 anim-fade-up"
                style={{ animationDelay: `${(index % 5 + 3) * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'rgba(0, 212, 170, 0.15)' }}>
                      <Syringe size={22} style={{ color: '#00D4AA' }} />
                    </div>
                    {vac.status === 'Completed' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.9)' }}>
                        <svg width="14" height="14" viewBox="0 0 20 20" className="transform -rotate-90">
                          <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(0, 200, 117, 0.2)" strokeWidth="3" />
                          <circle cx="10" cy="10" r="8" fill="none" stroke="#00C875" strokeWidth="3" strokeDasharray="50" strokeDashoffset="0" />
                        </svg>
                        <span className="text-xs font-extrabold tracking-wide" style={{ color: '#00C875' }}>COMPLETED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.9)' }}>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF9500' }}></div>
                        <span className="text-xs font-extrabold tracking-wide" style={{ color: '#FF9500' }}>DUE</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-extrabold leading-tight" style={{ color: '#0D1B2A' }}>
                      {vac.vaccineName}
                    </h4>
                    <span className="text-sm font-medium mt-1 block" style={{ color: '#9BAABF' }}>
                      {vac.targetDisease}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.9)', color: '#0D1B2A' }}>
                      {vac.doseNumber}
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-md flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.9)', color: '#0D1B2A' }}>
                      <Calendar size={14} style={{ color: '#0066FF' }} />
                      {vac.dateGiven || vac.dueDate}
                    </span>
                  </div>

                  {vac.givenAtFacility && (
                    <div className="flex items-center gap-2 pt-2">
                      <MapPin size={16} style={{ color: '#FF3366' }} />
                      <span className="text-xs font-semibold" style={{ color: '#9BAABF' }}>{vac.givenAtFacility}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t" style={{ borderColor: 'rgba(155, 170, 191, 0.2)' }}>
                  <button
                    onClick={() => showToast('Vaccination certificate downloaded.')}
                    className="pill-btn pill-btn-ghost w-full justify-center group"
                  >
                    <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" /> 
                    Download Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13, 27, 42, 0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-md frosted-card rounded-3xl p-8 shadow-2xl anim-fade-up">
            <h3 className="text-2xl font-extrabold mb-6" style={{ color: '#0D1B2A' }}>Record Vaccination</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D1B2A' }}>
                  Vaccine Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hepatitis B Booster"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#0066FF]/50 font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.8)', color: '#0D1B2A', border: '1px solid rgba(255,255,255,1)', boxShadow: 'inset 2px 2px 5px rgba(166,180,200,0.2)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#0D1B2A' }}>
                  Target Disease (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hepatitis B"
                  value={targetDisease}
                  onChange={(e) => setTargetDisease(e.target.value)}
                  className="w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#0066FF]/50 font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.8)', color: '#0D1B2A', border: '1px solid rgba(255,255,255,1)', boxShadow: 'inset 2px 2px 5px rgba(166,180,200,0.2)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0D1B2A' }}>
                    Dose Number
                  </label>
                  <input
                    type="text"
                    value={doseNumber}
                    onChange={(e) => setDoseNumber(e.target.value)}
                    className="w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#0066FF]/50 font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.8)', color: '#0D1B2A', border: '1px solid rgba(255,255,255,1)', boxShadow: 'inset 2px 2px 5px rgba(166,180,200,0.2)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0D1B2A' }}>
                    Date Given
                  </label>
                  <input
                    type="date"
                    value={dateGiven}
                    onChange={(e) => setDateGiven(e.target.value)}
                    className="w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#0066FF]/50 font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.8)', color: '#0D1B2A', border: '1px solid rgba(255,255,255,1)', boxShadow: 'inset 2px 2px 5px rgba(166,180,200,0.2)' }}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="pill-btn flex-1 justify-center bg-transparent border-2 hover:bg-slate-50 transition-colors"
                  style={{ borderColor: 'rgba(155, 170, 191, 0.4)', color: '#9BAABF' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pill-btn pill-btn-primary flex-1 justify-center"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
