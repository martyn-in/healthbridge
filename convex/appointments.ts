import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPatientAppointments = query({
  args: { patientId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();
  },
});

export const getDoctorAppointments = query({
  args: { doctorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .order("desc")
      .collect();
  },
});

export const bookAppointment = mutation({
  args: {
    patientId: v.id("users"),
    doctorId: v.id("users"),
    datetime: v.number(),
  },
  handler: async (ctx, args) => {
    // Basic double-booking check for doctor
    const existing = await ctx.db
      .query("appointments")
      .withIndex("by_doctor", (q) => q.eq("doctorId", args.doctorId))
      .filter((q) => q.eq(q.field("datetime"), args.datetime))
      .first();

    if (existing && existing.status !== "cancelled") {
      throw new Error("Doctor is already booked at this time");
    }

    return await ctx.db.insert("appointments", {
      patientId: args.patientId,
      doctorId: args.doctorId,
      datetime: args.datetime,
      status: "scheduled",
      paymentStatus: "pending",
    });
  },
});

export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, { status: args.status });
  },
});
