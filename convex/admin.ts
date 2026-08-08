import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Helper to enforce admin authorization
function requireAdmin(adminSecret?: string) {
  if (adminSecret !== process.env.CONVEX_ADMIN_SECRET) {
    throw new Error("Unauthorized: Admin access required");
  }
}

// Log audit action
async function logAudit(ctx: any, action: string, targetType: string, targetId?: string, metadata?: any) {
  await ctx.db.insert("auditLogs", {
    actorId: "admin",
    actorRole: "admin",
    action,
    targetType,
    targetId,
    metadata,
    timestamp: new Date().toISOString()
  });
}

export const getOverview = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);

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
  args: { adminSecret: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    return await ctx.db.query("users").order("desc").take(500);
  }
});

export const getAuditLogs = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    return await ctx.db.query("auditLogs").order("desc").take(100);
  }
});

export const verifyDoctor = mutation({
  args: { adminSecret: v.string(), targetUserId: v.id("users"), status: v.union(v.literal("approved"), v.literal("rejected")) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const targetUser = await ctx.db.get(args.targetUserId);

    if (!targetUser) throw new Error("User not found");
    if (targetUser.role !== "doctor") throw new Error("User is not a doctor");

    await ctx.db.patch(args.targetUserId, {
      doctorVerified: args.status === "approved",
      doctorVerificationStatus: args.status,
      updatedAt: new Date().toISOString()
    });

    await logAudit(ctx, args.status === "approved" ? "DOCTOR_APPROVED" : "DOCTOR_REJECTED", "user", args.targetUserId, { status: args.status });

    return { success: true };
  }
});

export const toggleUserStatus = mutation({
  args: { adminSecret: v.string(), targetUserId: v.id("users"), status: v.union(v.literal("active"), v.literal("suspended")) },
  handler: async (ctx, args) => {
    requireAdmin(args.adminSecret);
    const targetUser = await ctx.db.get(args.targetUserId);

    if (!targetUser) throw new Error("User not found");
    if (targetUser.role === "admin" && args.status === "suspended") {
      throw new Error("Cannot suspend an admin");
    }

    await ctx.db.patch(args.targetUserId, {
      accountStatus: args.status,
      updatedAt: new Date().toISOString()
    });

    await logAudit(ctx, args.status === "suspended" ? "USER_SUSPENDED" : "USER_ACTIVATED", "user", args.targetUserId, { status: args.status });

    return { success: true };
  }
});
