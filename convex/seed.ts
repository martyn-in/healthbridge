import { mutation } from "./_generated/server";

export const populate = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists to prevent double-seeding
    const existingPatients = await ctx.db.query("patients").collect();
    if (existingPatients.length > 0) {
      return { success: false, message: "Database already seeded." };
    }

    // Insert Patient 1
    const p1Id = await ctx.db.insert("patients", {
      name: "Sarah Jenkins",
      age: 42,
      gender: "Female",
      bloodGroup: "O+",
      allergies: ["Penicillin"],
      conditions: ["Hypertension", "Mild Asthma"],
      lastVisit: "2026-07-15T10:00:00Z",
    });

    await ctx.db.insert("vitals", {
      patientId: p1Id,
      heartRate: 72,
      spO2: 98,
      bpSystolic: 128,
      bpDiastolic: 82,
      temperature: 98.4,
      date: "2026-08-01T08:30:00Z",
      source: "Clinic Triage",
    });

    await ctx.db.insert("medications", {
      patientId: p1Id,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribedDate: "2026-01-10T00:00:00Z",
      prescribedBy: "Dr. Mehta",
      status: "active",
    });

    await ctx.db.insert("medications", {
      patientId: p1Id,
      name: "Albuterol Inhaler",
      dosage: "90mcg/actuation",
      frequency: "As needed for wheezing",
      prescribedDate: "2025-11-05T00:00:00Z",
      prescribedBy: "Dr. Mehta",
      status: "active",
    });

    await ctx.db.insert("reports", {
      patientId: p1Id,
      title: "Comprehensive Metabolic Panel",
      date: "2026-07-10T00:00:00Z",
      type: "Blood Test",
      status: "analyzed",
    });

    await ctx.db.insert("appointments", {
      patientId: p1Id,
      patientName: "Sarah Jenkins",
      date: new Date().toISOString().split("T")[0],
      time: "10:30 AM",
      type: "Follow-up",
      status: "scheduled",
      reason: "Blood pressure check and medication review",
    });


    // Insert Patient 2
    const p2Id = await ctx.db.insert("patients", {
      name: "Michael Chen",
      age: 58,
      gender: "Male",
      bloodGroup: "A-",
      allergies: [],
      conditions: ["Type 2 Diabetes"],
      lastVisit: "2026-08-02T14:30:00Z",
    });

    await ctx.db.insert("vitals", {
      patientId: p2Id,
      heartRate: 68,
      spO2: 99,
      bpSystolic: 118,
      bpDiastolic: 76,
      temperature: 98.6,
      date: "2026-08-02T14:00:00Z",
      source: "Clinic Triage",
    });

    await ctx.db.insert("medications", {
      patientId: p2Id,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily with meals",
      prescribedDate: "2026-02-15T00:00:00Z",
      prescribedBy: "Dr. Mehta",
      status: "active",
    });

    await ctx.db.insert("reports", {
      patientId: p2Id,
      title: "HbA1c & Lipid Profile",
      date: "2026-08-01T00:00:00Z",
      type: "Blood Test",
      status: "analyzed",
    });

    await ctx.db.insert("appointments", {
      patientId: p2Id,
      patientName: "Michael Chen",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      time: "09:00 AM",
      type: "Follow-up",
      status: "scheduled",
      reason: "Diabetes management review",
    });

    // Insert Patient 3
    const p3Id = await ctx.db.insert("patients", {
      name: "Elena Rodriguez",
      age: 29,
      gender: "Female",
      bloodGroup: "B+",
      allergies: ["Sulfa drugs", "Latex"],
      conditions: [],
      lastVisit: "2025-12-05T09:15:00Z",
    });

    await ctx.db.insert("appointments", {
      patientId: p3Id,
      patientName: "Elena Rodriguez",
      date: new Date().toISOString().split("T")[0],
      time: "01:15 PM",
      type: "Routine Physical",
      status: "scheduled",
      reason: "Annual check-up",
    });

    return { success: true, message: "Database seeded successfully." };
  },
});
