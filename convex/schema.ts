import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    googleSub: v.string(),
    email: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal("patient"), v.literal("doctor"), v.literal("admin")),
    doctorVerified: v.optional(v.boolean()),
    doctorVerificationStatus: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    accountStatus: v.union(v.literal("active"), v.literal("suspended")),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_googleSub", ["googleSub"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_doctorVerificationStatus", ["doctorVerificationStatus"]),

  auditLogs: defineTable({
    actorId: v.string(), // The Next.js session ID or Google Sub
    actorRole: v.string(),
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    metadata: v.optional(v.any()),
    timestamp: v.string(),
  }).index("by_timestamp", ["timestamp"])
    .index("by_action", ["action"]),

  doctorVerifications: defineTable({
    userId: v.id("users"),
    registrationNumber: v.string(),
    specialization: v.string(),
    hospitalClinic: v.string(),
    location: v.string(),
    documents: v.optional(v.array(v.string())),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    submittedAt: v.string(),
    reviewedAt: v.optional(v.string()),
    reviewedBy: v.optional(v.string()), // Admin googleSub
    adminReviewReason: v.optional(v.string()),
  }).index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  patients: defineTable({
    userId: v.optional(v.id("users")), // Link to the auth user
    name: v.string(),
    age: v.number(),
    gender: v.string(),
    bloodGroup: v.string(),
    allergies: v.array(v.string()),
    conditions: v.array(v.string()),
    lastVisit: v.string(), // ISO string date
  }).searchIndex("search_name", {
    searchField: "name",
  }).index("by_userId", ["userId"]),

  vitals: defineTable({
    patientId: v.id("patients"),
    heartRate: v.number(),
    spO2: v.number(),
    bpSystolic: v.number(),
    bpDiastolic: v.number(),
    temperature: v.number(),
    date: v.string(),
    source: v.string(),
  }).index("by_patient", ["patientId"]),

  medications: defineTable({
    patientId: v.id("patients"),
    name: v.string(),
    dosage: v.string(),
    frequency: v.string(),
    prescribedDate: v.string(),
    prescribedBy: v.string(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("discontinued")),
  }).index("by_patient", ["patientId"]),

  reports: defineTable({
    patientId: v.id("patients"),
    title: v.string(),
    date: v.string(),
    type: v.string(),
    status: v.union(v.literal("analyzed"), v.literal("pending")),
  }).index("by_patient", ["patientId"]),

  appointments: defineTable({
    patientId: v.id("patients"),
    patientName: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(),
    status: v.union(v.literal("scheduled"), v.literal("completed"), v.literal("cancelled")),
    reason: v.string(),
  }).index("by_date", ["date"])
    .index("by_patient", ["patientId"]),

  patientAccessTokens: defineTable({
    patientId: v.id("users"), // Patient granting access
    token: v.string(), // Cryptographically random secure token
    issuedAt: v.string(), // ISO string
    expiresAt: v.string(), // ISO string
    revoked: v.boolean(),
    accessScope: v.string(), // e.g. "full_clinical_profile"
  }).index("by_token", ["token"]).index("by_patient", ["patientId"]),

  doctorPatientAccess: defineTable({
    doctorId: v.id("users"), // Authorized doctor
    patientId: v.id("users"), // Patient being accessed
    grantedAt: v.string(), // ISO string
    expiresAt: v.string(), // ISO string
    tokenId: v.optional(v.id("patientAccessTokens")), // Which token was used
  }).index("by_doctor_and_patient", ["doctorId", "patientId"]).index("by_doctor", ["doctorId"]),

  clinicalNotes: defineTable({
    patientId: v.id("users"),
    doctorId: v.id("users"),
    note: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_patient", ["patientId"]).index("by_doctor", ["doctorId"]),
});
