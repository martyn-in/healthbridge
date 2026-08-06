'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, MapPin, CheckCircle, Video, UserCheck, XCircle, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AppointmentsPage() {
  const { appointments, bookAppointment, cancelAppointment, activeProfile, profiles } = useApp();

  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [specialty, setSpecialty] = useState('General Physician');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:30 AM');
  const [reason, setReason] = useState('');



  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookAppointment({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      doctorName: selectedDoctor,
      specialty,
      hospitalName: hospital,
      date,
      time,
      reason,
      mode: 'In-Person',
    });
    setShowBookModal(false);
  };

  const getInitials = (name: string) => {
    return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday default

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate dates based on weekOffset
  const getDayNumber = (index: number) => {
    const baseDate = new Date();
    const dayOfWeek = baseDate.getDay(); // 0 is Sun
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monDate = new Date(baseDate);
    monDate.setDate(baseDate.getDate() + distanceToMon + (weekOffset * 7) + index);
    return monDate.getDate();
  };

  return (
    <div className="space-y-8 pb-10 anim-fade-up">
      {/* Hero Header */}
      <div className="frosted-card rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF] opacity-5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm mb-4">
              <div style={{ color: '#FF9500' }}>
                <CalendarIcon className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D1B2A]">
                Care Coordination
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0D1B2A]">
                Consultations
              </h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0066FF]/10 text-[#0066FF]">
                {appointments.length} Appointments
              </span>
            </div>
            
            <p className="text-sm text-[#9BAABF] mt-2 max-w-xl leading-relaxed font-medium">
              Schedule follow-ups, telemedicine appointments, and in-person consultations for patient <span className="font-extrabold text-[#0D1B2A]">{activeProfile.name}</span>.
            </p>
          </div>

          <button
            onClick={() => setShowBookModal(true)}
            className="pill-btn pill-btn-primary shadow-lg shadow-[#0066FF]/20 shrink-0 anim-slide-left delay-100"
            style={{ backgroundColor: '#0066FF', color: 'white' }}
          >
            <Plus className="h-4 w-4" /> Book Consultation
          </button>
        </div>
      </div>

      {/* Week strip calendar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar px-1 anim-fade-up delay-200">
        <button 
          onClick={() => setWeekOffset(w => w - 1)}
          className="p-2.5 rounded-full bg-white/60 hover:bg-white text-[#0D1B2A] shadow-sm transition-all shrink-0 border border-white/80 active:scale-95"
          title="Previous week"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3 md:gap-6 flex-1 justify-center">
          {weekDays.map((day, i) => {
            const isSelected = i === selectedDayIndex;
            const dateNum = getDayNumber(i);
            return (
              <div 
                key={day} 
                onClick={() => setSelectedDayIndex(i)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/30 scale-105 font-black' 
                    : 'bg-white/50 text-[#9BAABF] hover:bg-white hover:text-[#0D1B2A] hover:shadow-sm'
                }`}
                style={{ minWidth: '65px' }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{day}</span>
                <span className="text-lg font-extrabold">{dateNum}</span>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => setWeekOffset(w => w + 1)}
          className="p-2.5 rounded-full bg-white/60 hover:bg-white text-[#0D1B2A] shadow-sm transition-all shrink-0 border border-white/80 active:scale-95"
          title="Next week"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Scheduled Appointments Grid */}
      <div className="space-y-6 anim-fade-up delay-300">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#9BAABF]">
          Scheduled Consultations
        </h3>

        {appointments.length === 0 ? (
          <div className="neu-card rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-black/5 flex items-center justify-center mb-4 text-[#9BAABF]">
              <CalendarIcon className="h-8 w-8 opacity-50" />
            </div>
            <h4 className="text-lg font-bold text-[#0D1B2A] mb-2">No Appointments</h4>
            <p className="text-sm text-[#9BAABF] max-w-sm mb-6">
              You don't have any upcoming consultations. Book a new appointment to get started.
            </p>
            <button
              onClick={() => setShowBookModal(true)}
              className="pill-btn pill-btn-primary shadow-sm"
              style={{ backgroundColor: '#0066FF', color: 'white' }}
            >
              Book Consultation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {appointments.map((apt, index) => (
              <div
                key={apt.id}
                className={`neu-card rounded-3xl p-6 card-lift transition-all flex flex-col gap-5 ${
                  apt.status === 'Cancelled' ? 'opacity-60 grayscale-[0.2]' : ''
                }`}
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-white flex items-center justify-center text-lg font-extrabold shadow-md">
                      {getInitials(apt.doctorName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0D1B2A]">
                        {apt.doctorName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0066FF]/10 text-[#0066FF]">
                          {apt.specialty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                      apt.status === 'Upcoming'
                        ? 'bg-[#00C875]/10 text-[#00C875] border-[#00C875]/20'
                        : 'bg-black/5 text-[#9BAABF] border-black/10'
                    }`}
                  >
                    {apt.status === 'Upcoming' && <span className="h-1.5 w-1.5 rounded-full bg-[#00C875] dot-live" />}
                    {apt.status}
                  </span>
                </div>

                <div className="bg-black/5 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-[#9BAABF] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-[#0D1B2A]">{apt.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-[#9BAABF] shrink-0" />
                    <span className="text-sm font-semibold text-[#0D1B2A] bg-white/60 px-2.5 py-1 rounded-lg border border-white">
                      {apt.date} at {apt.time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9BAABF]">Reason for Visit</span>
                  <p className="text-sm font-medium text-[#0D1B2A]">{apt.reason}</p>
                </div>

                {apt.status === 'Upcoming' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="pill-btn pill-btn-ghost hover:bg-[#FF3366]/10 hover:text-[#FF3366] text-[#9BAABF] text-xs transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Cancel Consultation
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md" onClick={() => setShowBookModal(false)} />
          <div className="w-full max-w-lg frosted-card rounded-3xl p-8 shadow-2xl relative z-10 border border-white/80 anim-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-[#0D1B2A]">Book Consultation</h3>
              <button 
                onClick={() => setShowBookModal(false)} 
                className="h-8 w-8 rounded-full bg-black/5 flex items-center justify-center text-[#9BAABF] hover:bg-black/10 hover:text-[#0D1B2A] transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider pl-1">
                  Physician Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-black/5 text-[#0D1B2A] font-bold outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider pl-1">Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white border border-black/5 text-[#0D1B2A] font-bold outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider pl-1">Facility / Hospital</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Health Center"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white border border-black/5 text-[#0D1B2A] font-bold outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider pl-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white border border-black/5 text-[#0D1B2A] font-bold outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider pl-1">Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-3.5 rounded-2xl bg-white border border-black/5 text-[#0D1B2A] font-bold outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all shadow-sm"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#9BAABF] uppercase tracking-wider pl-1">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine follow-up, symptom review..."
                  className="w-full p-3.5 rounded-2xl bg-white border border-black/5 text-[#0D1B2A] font-bold outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all shadow-sm placeholder:text-[#9BAABF]/60"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="flex-1 pill-btn pill-btn-ghost bg-black/5 hover:bg-black/10 text-[#0D1B2A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 pill-btn pill-btn-primary shadow-lg shadow-[#0066FF]/20"
                  style={{ backgroundColor: '#0066FF', color: 'white' }}
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
