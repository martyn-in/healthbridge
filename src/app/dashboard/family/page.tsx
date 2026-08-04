'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';
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
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-card p-6 text-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="chip chip-teal mb-2 inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Family Workspace
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Family Profile & Dependent Management
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Manage separate medical records, medication timelines, and emergency contacts for parents, spouse, and dependents.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Family Member
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((prof) => (
          <div
            key={prof.id}
            className={`rounded-xl p-6 shadow-sm border transition-all space-y-4 ${
              activeProfile.id === prof.id
                ? 'bg-teal-50/40 dark:bg-teal-950/30 border-teal-500/80 ring-1 ring-teal-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-teal-400 font-bold text-base border border-slate-800">
                  {prof.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {prof.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                      {prof.relationship}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {prof.age} yrs • {prof.gender} • Blood Group:{' '}
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {prof.bloodGroup}
                    </span>
                  </p>
                </div>
              </div>

              {!prof.isPrimary && (
                <button
                  onClick={() => deleteProfile(prof.id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-400 block text-[10px] mb-0.5">Allergies:</span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {prof.allergies.join(', ') || 'None Reported'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-400 block text-[10px] mb-0.5">Known Conditions:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {prof.conditions.join(', ') || 'None Reported'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {activeProfile.id === prof.id ? (
                <span className="px-3 py-1 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active Active Record
                </span>
              ) : (
                <button
                  onClick={() => {
                    setActiveProfile(prof);
                    showToast(`Switched active profile to ${prof.name}`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                >
                  Switch to {prof.name}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-dropdown border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Family Member Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Relationship:</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as FamilyMember['relationship'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age:</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700"
                >
                  Create Member Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
