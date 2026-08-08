import { query } from "./_generated/server";
import { v } from "convex/values";

export const getByDate = query({
  args: { date: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.date) {
      const date = args.date;
      return await ctx.db
        .query("appointments")
        .withIndex("by_date", (q) => q.eq("date", date))
        .collect();
    }
    return await ctx.db.query("appointments").order("desc").collect();
  },
});
