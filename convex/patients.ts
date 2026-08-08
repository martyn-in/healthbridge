import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("patients").order("desc").take(100);
  },
});

export const getById = query({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    const patient = await ctx.db.get(args.id);
    if (!patient) return null;

    // Fetch related records
    const vitals = await ctx.db
      .query("vitals")
      .withIndex("by_patient", (q) => q.eq("patientId", args.id))
      .order("desc")
      .collect();

    const medications = await ctx.db
      .query("medications")
      .withIndex("by_patient", (q) => q.eq("patientId", args.id))
      .collect();

    const reports = await ctx.db
      .query("reports")
      .withIndex("by_patient", (q) => q.eq("patientId", args.id))
      .order("desc")
      .collect();

    return {
      ...patient,
      vitals,
      medications,
      reports,
    };
  },
});
