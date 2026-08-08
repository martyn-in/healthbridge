'use client';

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserActions({ userId, currentStatus, isSelf, actorId }: { userId: Id<"users">, currentStatus: string, isSelf: boolean, actorId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleStatus = useMutation(api.admin.toggleUserStatus);
  const router = useRouter();

  if (isSelf) {
    return <span className="text-xs font-bold text-slate-400">You</span>;
  }

  const handleToggle = async () => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    if (newStatus === 'suspended') {
      if (!window.confirm("Are you sure you want to suspend this user? They will lose access to all portals immediately.")) {
        return;
      }
    }

    try {
      await toggleStatus({ actorId, targetUserId: userId, status: newStatus });
      alert(`User account has been ${newStatus}.`);
      router.refresh();
    } catch (err: any) {
      alert("Action failed: " + err.message);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden text-left py-1">
            <button 
              onClick={() => { setIsOpen(false); handleToggle(); }}
              className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium hover:bg-slate-50 transition-colors ${currentStatus === 'active' ? 'text-rose-600' : 'text-emerald-600'}`}
            >
              {currentStatus === 'active' ? (
                <><Ban className="w-4 h-4" /> Suspend Account</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Restore Account</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
