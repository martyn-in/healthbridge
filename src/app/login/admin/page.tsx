'use client';

import React, { useEffect } from 'react';

export default function AdminLoginRedirect() {
  useEffect(() => {
    // We navigate to the server API route with the 'admin' role intent
    window.location.href = '/api/auth/google/start?role=admin';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5FB]">
      <div className="w-6 h-6 border-2 border-[#4D50A2] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
