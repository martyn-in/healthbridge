import React, { useState } from 'react';

interface AdminAccessModalProps {
  onClose: () => void;
}

export function AdminAccessModal({ onClose }: AdminAccessModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await res.json();
      
      if (data.success) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Invalid access code');
        setCode('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121218]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-[#2F3273]">Administrator Access</h2>
          <p className="text-sm text-slate-500 font-medium">Enter the access code to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={code}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setCode(val);
                setError('');
              }}
              placeholder="••••"
              className="w-32 text-center text-4xl tracking-widest font-extrabold text-[#2F3273] bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 focus:outline-none focus:border-[#4D50A2] transition-colors placeholder:text-slate-300"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-center font-bold text-rose-500 animate-in slide-in-from-bottom-2">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={code.length !== 4 || loading}
              className="w-full py-3.5 bg-[#4D50A2] hover:bg-[#3d4082] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-colors"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
