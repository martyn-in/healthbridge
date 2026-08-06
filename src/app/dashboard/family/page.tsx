'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, CheckCircle2, User, Activity, Droplets } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { FamilyMember } from '@/types';

export default function FamilyPage() {
  const { profiles, activeProfile, setActiveProfile, addProfile, deleteProfile, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('Child');
  const [age, setAge] = useState<number>(10);
  const [gender, setGender] = useState<FamilyMember['gender']>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProfile({
      name,
      relationship,
      age,
      gender,
      bloodGroup,
      allergies: allergiesText ? allergiesText.split(',').map((s) => s.trim()) : [],
      conditions: conditionsText ? conditionsText.split(',').map((s) => s.trim()) : [],
    });
    setShowAddModal(false);
    setName('');
    setAllergiesText('');
    setConditionsText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="frosted-card rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-40" 
          style={{ backgroundImage: 'radial-gradient(#0066FF20 2px, transparent 2px)', backgroundSize: '24px 24px' }} 
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-2 rounded-xl" style={{ backgroundColor: '#00D4AA20', color: '#00D4AA' }}>
              <Users className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold tracking-wider uppercase text-[#0066FF]">Family Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-tight">
            Family Health Hub
          </h1>
          <p className="text-sm text-[#9BAABF] mt-2 max-w-xl font-medium leading-relaxed">
            Manage separate medical records, medication timelines, and emergency contacts for parents, spouse, and dependents.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="pill-btn pill-btn-primary shadow-lg flex items-center gap-2 relative z-10 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Add Member
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((prof, index) => {
          const isPrimary = prof.isPrimary;
          const isActive = activeProfile.id === prof.id;

          let gradient = 'linear-gradient(135deg, #0066FF, #00C2FF)';
          let chipColor = '#0066FF';
          let chipBg = '#0066FF15';
          
          if (prof.relationship === 'Spouse') {
             gradient = 'linear-gradient(135deg, #FF3366, #FF9500)';
             chipColor = '#FF3366';
             chipBg = '#FF336615';
          } else if (prof.relationship === 'Parent') {
             gradient = 'linear-gradient(135deg, #FF9500, #FBBF24)';
             chipColor = '#FF9500';
             chipBg = '#FF950015';
          } else if (prof.relationship === 'Child') {
             gradient = 'linear-gradient(135deg, #0066FF, #00D4AA)';
             chipColor = '#0066FF';
             chipBg = '#0066FF15';
          } else {
             gradient = 'linear-gradient(135deg, #7C5CFC, #00C2FF)';
             chipColor = '#7C5CFC';
             chipBg = '#7C5CFC15';
          }

          return (
            <div 
              key={prof.id}
              className={`neu-card card-lift rounded-3xl p-6 relative flex flex-col justify-between anim-fade-up delay-${((index % 5) + 1) * 100}`}
              style={{ 
                border: isActive ? '2px solid #0066FF' : '2px solid transparent',
              }}
            >
              {isPrimary && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5 w-full"
                  style={{ background: 'linear-gradient(to right, #0066FF, #7C5CFC)' }}
                />
              )}

              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div 
                    className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-md shrink-0" 
                    style={{ background: gradient }}
                  >
                    {prof.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="text-xl font-extrabold text-[#0D1B2A]">{prof.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide" style={{ backgroundColor: chipBg, color: chipColor }}>
                        {prof.relationship}
                      </span>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-3 text-sm font-semibold text-[#9BAABF]">
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {prof.age} yrs</span>
                      <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> {prof.gender}</span>
                      <span className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-[#FF3366]" /> {prof.bloodGroup}</span>
                    </div>
                  </div>
                </div>

                {!isPrimary && (
                  <button
                    onClick={() => deleteProfile(prof.id)}
                    className="h-9 w-9 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-[#FF3366] hover:border-[#FF3366] hover:bg-red-50 transition-all shadow-sm shrink-0 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-[#9BAABF] tracking-wider">Allergies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {prof.allergies.length > 0 ? prof.allergies.map((a, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: '#FF950020', color: '#FF9500' }}>
                        {a}
                      </span>
                    )) : <span className="text-xs font-semibold text-[#9BAABF]">None</span>}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white/50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-[#9BAABF] tracking-wider">Conditions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {prof.conditions.length > 0 ? prof.conditions.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                        {c}
                      </span>
                    )) : <span className="text-xs font-semibold text-[#9BAABF]">None</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                {isActive ? (
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full" style={{ backgroundColor: '#00C87515', color: '#00C875' }}>
                    <div className="h-2 w-2 rounded-full bg-[#00C875] dot-live" />
                    <span className="text-xs font-bold tracking-wide">Active Record</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveProfile(prof);
                      showToast(`Switched active profile to ${prof.name}`);
                    }}
                    className="pill-btn pill-btn-ghost text-xs py-1.5 px-5"
                  >
                    Switch to {prof.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
          <div className="frosted-card rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl border border-white/60">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold text-[#0D1B2A]">Add Family Member</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-[#9BAABF] uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-[#0D1B2A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  placeholder="e.g. Family Member Name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#9BAABF] uppercase tracking-wider mb-2">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as FamilyMember['relationship'])}
                    className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-[#0D1B2A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9BAABF] uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-[#0D1B2A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#9BAABF] uppercase tracking-wider mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as FamilyMember['gender'])}
                    className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-[#0D1B2A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9BAABF] uppercase tracking-wider mb-2">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-[#0D1B2A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9BAABF] uppercase tracking-wider mb-2">Allergies (comma separated)</label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-[#0D1B2A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  placeholder="e.g. Peanuts, Penicillin"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#9BAABF] uppercase tracking-wider mb-2">Conditions (comma separated)</label>
                <input
                  type="text"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 text-[#0D1B2A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                  placeholder="e.g. Asthma, Hypertension"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 pill-btn bg-slate-100 text-[#0D1B2A] hover:bg-slate-200 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 pill-btn pill-btn-primary py-3"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
