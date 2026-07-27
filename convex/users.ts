import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.literal("patient"),
      v.literal("doctor"),
      v.literal("receptionist"),
      v.literal("clinic-admin"),
      v.literal("super-admin")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      role: args.role,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const getUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    return user;
  },
});

export const getPatientProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const updatePatientProfile = mutation({
  args: {
    userId: v.id("users"),
    bloodGroup: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    chronicDiseases: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("patientProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        bloodGroup: args.bloodGroup,
        allergies: args.allergies,
        chronicDiseases: args.chronicDiseases,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("patientProfiles", {
        userId: args.userId,
        bloodGroup: args.bloodGroup,
        allergies: args.allergies,
        chronicDiseases: args.chronicDiseases,
      });
    }
  },
});
