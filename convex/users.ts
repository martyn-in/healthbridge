import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    googleSub: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    roleIntent: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Check if user exists by googleSub
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.googleSub))
      .first();

    if (existingUser) {
      // Return existing role and verification status (ignore intent)
      return {
        id: existingUser._id,
        role: existingUser.role,
        doctorVerified: existingUser.doctorVerified,
        accountStatus: existingUser.accountStatus,
      };
    }

    // 2. User does not exist, create them
    const newRole = args.roleIntent === "doctor" ? "doctor" : "patient";
    // NOTE: admin role can NEVER be created via this sync function. It must be bootstrapped.

    const newUserId = await ctx.db.insert("users", {
      googleSub: args.googleSub,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      role: newRole,
      doctorVerified: newRole === "doctor" ? false : undefined,
      doctorVerificationStatus: newRole === "doctor" ? "pending" : undefined,
      accountStatus: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const newUser = await ctx.db.get(newUserId);

    if (newRole === "patient") {
      await ctx.db.insert("patients", {
        userId: newUserId,
        name: args.name,
        age: 0, // Placeholder, can be updated later
        gender: "Not specified",
        bloodGroup: "Unknown",
        allergies: [],
        conditions: [],
        lastVisit: new Date().toISOString(),
      });
    }

    return {
      id: newUser!._id,
      role: newUser!.role,
      doctorVerified: newUser!.doctorVerified,
      accountStatus: newUser!.accountStatus,
    };
  },
});
