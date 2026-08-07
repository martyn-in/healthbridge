'use client';

import React from 'react';
import { ClerkProvider, useUser } from '@clerk/nextjs';
import { useApp } from '@/context/AppContext';

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Inner component that syncs Clerk authenticated user state into AppContext
 */
export function ClerkUserSync() {
  if (!clerkPubKey) return null;
  return <ClerkUserSyncInner />;
}

function ClerkUserSyncInner() {
  try {
    const { user, isLoaded, isSignedIn } = useUser();
    const { updatePrimaryProfile, activeProfile } = useApp();

    React.useEffect(() => {
      if (isLoaded && isSignedIn && user) {
        const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Patient User';
        const email = user.primaryEmailAddress?.emailAddress || '';
        const photo = user.imageUrl || '';

        if (activeProfile.name !== fullName || (activeProfile as any).email !== email) {
          updatePrimaryProfile({
            name: fullName,
            email: email,
            avatarUrl: photo,
          } as any);
        }
      }
    }, [isLoaded, isSignedIn, user]);
  } catch (err) {
    // If used outside ClerkProvider, ignore safely
  }

  return null;
}

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  if (clerkPubKey) {
    return <ClerkProvider publishableKey={clerkPubKey}>{children}</ClerkProvider>;
  }

  return <>{children}</>;
}

