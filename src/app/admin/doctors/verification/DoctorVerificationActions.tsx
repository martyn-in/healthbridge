'use client';

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DoctorVerificationActions({ targetUserId, actorId }: { targetUserId: Id<"users">, actorId: string }) {
  const verifyDoctor = useMutation(api.admin.verifyDoctor);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected') {
      if (!window.confirm("Are you sure you want to reject this doctor?")) return;
    } else {
      if (!window.confirm("Are you sure you want to APPROVE this doctor? They will gain access to clinical data.")) return;
    }

    setLoading(true);
    try {
      await verifyDoctor({ actorId, targetUserId, status });
      alert(`Doctor application ${status}.`);
      router.refresh();
    } catch (err: any) {
      alert("Action failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => handleAction('approved')}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
      >
        <CheckCircle2 className="w-5 h-5" />
        Approve
      </button>
      <button
        onClick={() => handleAction('rejected')}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
      >
        <XCircle className="w-5 h-5" />
        Reject
      </button>
    </>
  );
}
