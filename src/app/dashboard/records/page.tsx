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
    <div className="space-y-8 pb-10">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl frosted-card p-8 border border-white/90 shadow-[6px_6px_16px_rgba(166,180,200,0.45)]">
        <div className="absolute inset-0 bg-[url('/grid-bg.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-3 shadow-sm">
              <FolderHeart className="h-4 w-4" style={{ color: '#7C5CFC' }} />
              <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: '#7C5CFC' }}>Records Repository</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0D1B2A]">
              Health Records Vault
            </h1>
            <p className="text-[13px] text-[#9BAABF] mt-2 max-w-xl font-medium leading-relaxed">
              Encrypted clinical records vault for patient <span className="font-bold text-[#0066FF]">{activeProfile.name}</span>. Generate emergency QR access passes or export health records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="pill-btn flex items-center gap-2 bg-white hover:bg-slate-50 border-2 text-[#0D1B2A]"
              style={{ borderColor: 'rgba(255,255,255,0.9)' }}
            >
              <QrCode className="h-4 w-4" style={{ color: '#0066FF' }} />
              <span className="font-bold text-[13px]">Health Pass QR</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="pill-btn pill-btn-primary flex items-center gap-2 shadow-[0_8px_16px_rgba(0,102,255,0.25)] hover:shadow-[0_4px_12px_rgba(0,102,255,0.15)]"
              style={{ background: '#0066FF' }}
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="font-bold text-[13px] text-white">Add Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="neu-card rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-[#9BAABF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title, tag, or document type..."
            className="w-full pl-11 pr-4 py-3 text-[13px] font-bold rounded-xl bg-transparent text-[#0D1B2A] placeholder:text-[#9BAABF] outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-white text-[#9BAABF] hover:text-[#0D1B2A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="frosted-card rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-2xl neu-card flex items-center justify-center mb-4">
            <FolderHeart className="h-8 w-8 text-[#9BAABF]" />
          </div>
          <h3 className="text-lg font-bold text-[#0D1B2A] mb-1">No Records Found</h3>
          <p className="text-[13px] font-medium text-[#9BAABF] max-w-sm">
            We couldn't find any health records matching your search or filter. Try adjusting your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecords.map((rec, i) => (
            <div
              key={rec.id}
              className={`frosted-card rounded-3xl p-5 flex flex-col justify-between space-y-5 card-lift anim-fade-up delay-${(i % 5 + 1) * 100}`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shadow-sm">
                    <FileText className="h-5 w-5" style={{ color: '#0066FF' }} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/80 border border-emerald-100 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#00C875' }} />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#00C875' }}>Private</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0D1B2A] leading-tight mb-1.5">
                    {rec.title}
                  </h3>
                  <p className="text-[12px] font-bold text-[#9BAABF]">{rec.date}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase bg-[#F3F5F8] text-[#0D1B2A] border border-slate-200/50">
                    {rec.category}
                  </span>
                  {rec.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-100 shadow-sm text-[#9BAABF] text-[10px] font-bold flex items-center gap-1"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-[#9BAABF] bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                  {rec.fileSize} • {rec.fileType}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => showToast('Record downloaded.')}
                    className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#9BAABF] hover:text-[#0066FF] transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteHealthRecord(rec.id)}
                    className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#9BAABF] hover:text-[#FF3366] transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Health Pass Modal */}
      {isQrModalOpen && (
        <DigitalHealthCardModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md">
          <div className="w-full max-w-md frosted-card rounded-3xl p-7 shadow-2xl border-white/80">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-[#0D1B2A]">Upload Health Record</h3>
              <button onClick={() => setShowAddModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm text-[#9BAABF] hover:text-[#0D1B2A] transition-colors font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div>
                <label className="block text-[13px] font-extrabold text-[#0D1B2A] mb-2 uppercase tracking-wide">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Health Checkup 2026..."
                  className="w-full p-4 rounded-2xl bg-white/70 text-[#0D1B2A] border border-white font-bold outline-none shadow-sm placeholder:text-[#9BAABF] focus:border-[#0066FF]/30 focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-[14px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-extrabold text-[#0D1B2A] mb-2 uppercase tracking-wide">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Report', 'Prescription', 'Vaccine', 'Assessment'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c as HealthRecord['category'])}
                      className={`py-3 px-3 rounded-xl text-[13px] font-bold transition-all shadow-sm border ${
                        category === c
                          ? 'bg-[#0066FF] text-white border-[#0066FF]'
                          : 'bg-white text-[#9BAABF] border-transparent hover:text-[#0D1B2A]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-white text-[#0D1B2A] font-extrabold shadow-sm hover:bg-slate-50 transition-colors text-[14px] border border-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl text-white font-extrabold shadow-[0_8px_16px_rgba(0,102,255,0.25)] hover:shadow-[0_4px_12px_rgba(0,102,255,0.15)] transition-all text-[14px] card-lift"
                  style={{ background: '#0066FF' }}
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
