'use server';

import { verifyAdminSession } from '@/lib/auth/admin-session';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';

async function checkAdmin() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function verifyDoctorAction(targetUserId: Id<'users'>, status: 'approved' | 'rejected') {
  await checkAdmin();
  
  const adminSecret = process.env.CONVEX_ADMIN_SECRET;
  if (!adminSecret) throw new Error('Convex admin secret not configured');

  await fetchMutation(api.admin.verifyDoctor, {
    adminSecret,
    targetUserId,
    status
  });
}

export async function toggleUserStatusAction(targetUserId: Id<'users'>, status: 'active' | 'suspended') {
  await checkAdmin();
  
  const adminSecret = process.env.CONVEX_ADMIN_SECRET;
  if (!adminSecret) throw new Error('Convex admin secret not configured');

  await fetchMutation(api.admin.toggleUserStatus, {
    adminSecret,
    targetUserId,
    status
  });
}
