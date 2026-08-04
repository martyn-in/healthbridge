'use client';

import React, { useState } from 'react';
import {
  FolderHeart,
  Plus,
  Search,
  FileText,
  Trash2,
  Download,
  QrCode,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DigitalHealthCardModal } from '@/components/ui/DigitalHealthCardModal';
import { HealthRecord } from '@/types';

export default function HealthRecordsPage() {
  const { activeProfile, healthRecords, addHealthRecord, deleteHealthRecord, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<HealthRecord['category']>('Report');

  const filteredRecords = healthRecords.filter((rec) => {
    const matchesCat = selectedCategory === 'All' || rec.category === selectedCategory;
    const matchesSearch =
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = ['All', 'Report', 'Prescription', 'Vaccine', 'Assessment'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHealthRecord({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      fileSize: '1.1 MB',
      fileType: 'PDF',
      tags: ['User Uploaded', category],
      privacy: 'Emergency Accessible',
      notes: 'Added to health records repository.',
    });
    setShowAddModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-teal-400 text-[11px] font-bold uppercase mb-2 border border-slate-700">
            <FolderHeart className="h-3.5 w-3.5" /> Records Repository
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Digital Health Records Vault
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Encrypted clinical records vault for patient <span className="font-bold text-teal-400">{activeProfile.name}</span>. Generate emergency QR access passes or export health records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
          >
            <QrCode className="h-4 w-4" /> Health Pass QR
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4 text-teal-400" /> Add Record
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title, tag, or document type..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 outline-none"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 text-[10px] font-bold border border-teal-200 dark:border-teal-800">
                  {rec.category}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">{rec.date}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{rec.title}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{rec.notes}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {rec.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400">{rec.fileSize} • {rec.fileType}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => showToast('Record downloaded.')}
                  className="p-1.5 text-slate-500 hover:text-teal-600 rounded"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteHealthRecord(rec.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Health Pass Modal */}
      {isQrModalOpen && (
        <DigitalHealthCardModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-dropdown border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upload Health Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Document Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Health Checkup 2026..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HealthRecord['category'])}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold outline-none"
                >
                  <option value="Report">Laboratory Report</option>
                  <option value="Prescription">Doctor Prescription</option>
                  <option value="Vaccine">Vaccination Record</option>
                  <option value="Assessment">Symptom Assessment</option>
                </select>
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
