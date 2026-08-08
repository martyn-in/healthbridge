import { mutation } from "./_generated/server";

export const wipeMockData = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all patients (which are mock since real users go to 'users' table)
    const patients = await ctx.db.query("patients").collect();
    for (const p of patients) {
      await ctx.db.delete(p._id);
    }
    
    const vitals = await ctx.db.query("vitals").collect();
    for (const v of vitals) {
      await ctx.db.delete(v._id);
    }

    const meds = await ctx.db.query("medications").collect();
    for (const m of meds) {
      await ctx.db.delete(m._id);
    }

    const reports = await ctx.db.query("reports").collect();
    for (const r of reports) {
      await ctx.db.delete(r._id);
    }

    const apts = await ctx.db.query("appointments").collect();
    for (const a of apts) {
      await ctx.db.delete(a._id);
    }

    return "Mock data wiped successfully!";
  }
});
