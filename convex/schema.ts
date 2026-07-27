import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    role: v.union(
      v.literal("patient"),
      v.literal("doctor"),
      v.literal("receptionist"),
      v.literal("clinic-admin"),
      v.literal("super-admin")
    ),
    email: v.string(),
    phone: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.string(),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  patientProfiles: defineTable({
    userId: v.id("users"),
    bloodGroup: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    chronicDiseases: v.optional(v.array(v.string())),
    emergencyContacts: v.optional(v.array(v.object({
      name: v.string(),
      phone: v.string(),
      relation: v.string()
    }))),
    insuranceDetails: v.optional(v.object({
      provider: v.string(),
      policyNumber: v.string()
    })),
  }).index("by_userId", ["userId"]),

  doctorProfiles: defineTable({
    userId: v.id("users"),
    department: v.string(),
    specialization: v.string(),
    fee: v.number(),
    experienceYears: v.number(),
    about: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  appointments: defineTable({
    patientId: v.id("users"),
    doctorId: v.id("users"),
    clinicId: v.optional(v.string()), // Can link to a clinics table later
    datetime: v.number(), // Unix timestamp
    status: v.union(
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("rescheduled")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("refunded")
    ),
  })
  .index("by_patient", ["patientId"])
  .index("by_doctor", ["doctorId"])
  .index("by_datetime", ["datetime"]),

  medicalRecords: defineTable({
    patientId: v.id("users"),
    doctorId: v.optional(v.id("users")),
    type: v.union(
      v.literal("prescription"),
      v.literal("lab_report"),
      v.literal("scan"),
      v.literal("clinical_note")
    ),
    fileUrl: v.string(),
    aiSummary: v.optional(v.string()),
    ocrExtractedData: v.optional(v.any()), // JSON representation of extracted data
    createdAt: v.number(),
  }).index("by_patient", ["patientId"]),
});
