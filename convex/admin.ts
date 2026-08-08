import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper to enforce admin authorization
async function requireAdmin(ctx: any, actorId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_googleSub", (q: any) => q.eq("googleSub", actorId))
    .first();
    
  if (!user || user.role !== "admin" || user.accountStatus !== "active") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

// Log audit action
async function logAudit(ctx: any, actorId: string, actorRole: string, action: string, targetType: string, targetId?: string, metadata?: any) {
  await ctx.db.insert("auditLogs", {
    actorId,
    actorRole,
    action,
    targetType,
    targetId,
    metadata,
    timestamp: new Date().toISOString()
  });
}

export const getOverview = query({
  args: { actorId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.actorId);

    const users = await ctx.db.query("users").collect();
    const patientsCount = users.filter((u: any) => u.role === "patient").length;
    const doctorsCount = users.filter((u: any) => u.role === "doctor").length;
    const pendingDoctors = users.filter((u: any) => u.role === "doctor" && u.doctorVerificationStatus === "pending").length;
    const activeAccounts = users.filter((u: any) => u.accountStatus === "active").length;

    const appointments = await ctx.db.query("appointments").collect();
    const reports = await ctx.db.query("reports").collect();

    return {
      totalUsers: users.length,
      patientsCount,
      doctorsCount,
      pendingDoctors,
      activeAccounts,
      totalAppointments: appointments.length,
      totalReports: reports.length,
    };
  }
});

export const getUsers = query({
  args: { actorId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.actorId);
    return await ctx.db.query("users").order("desc").take(500);
  }
});

export const getAuditLogs = query({
  args: { actorId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.actorId);
    return await ctx.db.query("auditLogs").order("desc").take(100);
  }
});

export const verifyDoctor = mutation({
  args: { actorId: v.string(), targetUserId: v.id("users"), status: v.union(v.literal("approved"), v.literal("rejected")) },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx, args.actorId);
    const targetUser = await ctx.db.get(args.targetUserId);

    if (!targetUser) throw new Error("User not found");
    if (targetUser.role !== "doctor") throw new Error("User is not a doctor");

    await ctx.db.patch(args.targetUserId, {
      doctorVerified: args.status === "approved",
      doctorVerificationStatus: args.status,
      updatedAt: new Date().toISOString()
    });

    await logAudit(ctx, args.actorId, adminUser.role, args.status === "approved" ? "DOCTOR_APPROVED" : "DOCTOR_REJECTED", "user", args.targetUserId, { status: args.status });

    return { success: true };
  }
});

export const toggleUserStatus = mutation({
  args: { actorId: v.string(), targetUserId: v.id("users"), status: v.union(v.literal("active"), v.literal("suspended")) },
  handler: async (ctx, args) => {
    const adminUser = await requireAdmin(ctx, args.actorId);
    const targetUser = await ctx.db.get(args.targetUserId);

    if (!targetUser) throw new Error("User not found");
    if (targetUser.role === "admin" && args.status === "suspended") {
      throw new Error("Cannot suspend an admin");
    }

    await ctx.db.patch(args.targetUserId, {
      accountStatus: args.status,
      updatedAt: new Date().toISOString()
    });

    await logAudit(ctx, args.actorId, adminUser.role, args.status === "suspended" ? "USER_SUSPENDED" : "USER_ACTIVATED", "user", args.targetUserId, { status: args.status });

    return { success: true };
  }
});
