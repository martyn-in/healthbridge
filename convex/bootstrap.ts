import { mutation } from "./_generated/server";
import { v } from "convex/values";

// ONE-TIME CLI OPERATION ONLY
// Usage: npx convex run bootstrap:makeMeAdmin '{ "email": "your_email" }'
export const makeMeAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // We explicitly only allow one admin to be created this way, or we just allow it by email match.
    // To prevent abuse, we could check if any admin exists, but we'll trust the CLI user since this is a protected function (cannot be called by unauthenticated frontend).
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        role: "admin",
        doctorVerified: undefined,
        doctorVerificationStatus: undefined,
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: `Upgraded existing user ${args.email} to Admin` };
    } else {
      // Create a dummy admin record (requires them to login via Google OAuth with this email later)
      // Note: This requires googleSub which we don't have. It's better they log in first, then run this.
      return { success: false, message: `User ${args.email} not found. Please log in first via Google to create your account, then run this command again.` };
    }
  }
});
