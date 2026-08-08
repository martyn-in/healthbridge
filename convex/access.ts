import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Generate a cryptographic token for the patient's QR code
export const generatePatientToken = mutation({
  args: { 
    googleSub: v.string(), // We use googleSub to verify the patient calling this
  },
  handler: async (ctx, args) => {
    // 1. Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.googleSub))
      .first();

    if (!user || user.role !== "patient") {
      throw new Error("Unauthorized: Only patients can generate an access token.");
    }

    // 2. Generate a random secure string (in production, use Web Crypto API, but here we can use Math.random/Date for demo, or a robust generator if available)
    // Convex provides a secure crypto implementation for Node/V8
    const token = crypto.randomUUID() + "-" + crypto.randomUUID(); 

    // 3. Set expiry (e.g., 24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 4. Invalidate any existing active tokens for this patient to prevent token hoarding
    const existingTokens = await ctx.db
      .query("patientAccessTokens")
      .withIndex("by_patient", (q) => q.eq("patientId", user._id))
      .filter((q) => q.eq(q.field("revoked"), false))
      .collect();

    for (const t of existingTokens) {
      await ctx.db.patch(t._id, { revoked: true });
    }

    // 5. Insert new token
    const tokenId = await ctx.db.insert("patientAccessTokens", {
      patientId: user._id,
      token: token,
      issuedAt: new Date().toISOString(),
      expiresAt: expiresAt,
      revoked: false,
      accessScope: "full_clinical_profile",
    });

    return token;
  },
});

export const getActiveToken = query({
  args: { googleSub: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.googleSub))
      .first();

    if (!user) return null;

    const activeTokens = await ctx.db
      .query("patientAccessTokens")
      .withIndex("by_patient", (q) => q.eq("patientId", user._id))
      .filter((q) => q.eq(q.field("revoked"), false))
      .collect();

    // Filter out expired ones in memory just to be safe
    const now = new Date().toISOString();
    const valid = activeTokens.filter(t => t.expiresAt > now);

    return valid.length > 0 ? valid[0].token : null;
  }
});

export const revokeToken = mutation({
  args: { googleSub: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.googleSub))
      .first();

    if (!user) throw new Error("Unauthorized");

    const activeTokens = await ctx.db
      .query("patientAccessTokens")
      .withIndex("by_patient", (q) => q.eq("patientId", user._id))
      .filter((q) => q.eq(q.field("revoked"), false))
      .collect();

    for (const t of activeTokens) {
      await ctx.db.patch(t._id, { revoked: true });
    }

    return true;
  }
});

// Used by Doctor to validate a scanned QR code
export const validateQRToken = mutation({
  args: { 
    token: v.string(),
    doctorGoogleSub: v.string(), // We verify the doctor calling this
  },
  handler: async (ctx, args) => {
    // 1. Verify Doctor
    const doctor = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.doctorGoogleSub))
      .first();

    if (!doctor || doctor.role !== "doctor" || doctor.accountStatus !== "active" || doctor.doctorVerificationStatus !== "approved") {
      throw new Error("Unauthorized: Invalid doctor credentials or not fully verified.");
    }

    // 2. Find Token
    const tokenRecord = await ctx.db
      .query("patientAccessTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!tokenRecord) {
      throw new Error("Invalid or expired HealthBridge patient QR.");
    }

    // 3. Validate Token Status
    if (tokenRecord.revoked) {
      throw new Error("Invalid or expired HealthBridge patient QR."); // Revoked
    }

    const now = new Date().toISOString();
    if (now > tokenRecord.expiresAt) {
      throw new Error("Invalid or expired HealthBridge patient QR."); // Expired
    }

    // 4. Find Patient
    const patientUser = await ctx.db.get(tokenRecord.patientId);
    if (!patientUser || patientUser.accountStatus !== "active") {
      throw new Error("Patient account is not active.");
    }

    // 5. Establish Temporary Doctor-Patient Access (60 mins)
    const accessExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    
    // Check if there's already an active access and extend it, or create a new one
    const existingAccess = await ctx.db
      .query("doctorPatientAccess")
      .withIndex("by_doctor_and_patient", (q) => 
        q.eq("doctorId", doctor._id).eq("patientId", patientUser._id)
      )
      .first();

    if (existingAccess && existingAccess.expiresAt > now) {
      // Extend existing
      await ctx.db.patch(existingAccess._id, { expiresAt: accessExpiresAt });
    } else {
      // Create new
      await ctx.db.insert("doctorPatientAccess", {
        doctorId: doctor._id,
        patientId: patientUser._id,
        grantedAt: now,
        expiresAt: accessExpiresAt,
        tokenId: tokenRecord._id,
      });
    }

    // 6. Audit Logging
    await ctx.db.insert("auditLogs", {
      actorId: doctor.googleSub,
      actorRole: "doctor",
      action: "PATIENT_QR_SCANNED",
      targetType: "patient",
      targetId: patientUser._id,
      metadata: { success: true },
      timestamp: now,
    });

    return patientUser._id; // Return the patient ID so the UI can route to /doctor/patient/[id]
  }
});

// Securely fetch a patient's clinical profile ONLY if the doctor has active access
export const getAuthorizedPatientProfile = query({
  args: {
    patientId: v.id("users"),
    doctorGoogleSub: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Verify Doctor
    const doctor = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.doctorGoogleSub))
      .first();

    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Unauthorized: Invalid doctor.");
    }

    // 2. Check Active Access
    const now = new Date().toISOString();
    const access = await ctx.db
      .query("doctorPatientAccess")
      .withIndex("by_doctor_and_patient", (q) => 
        q.eq("doctorId", doctor._id).eq("patientId", args.patientId)
      )
      .first();

    if (!access || access.expiresAt < now) {
      throw new Error("Access Denied: No active access session or session expired.");
    }

    // 3. Get Patient Data
    const user = await ctx.db.get(args.patientId);
    if (!user) throw new Error("Patient not found");

    const patientProfile = await ctx.db
      .query("patients")
      .withIndex("by_userId", (q) => q.eq("userId", args.patientId))
      .first();

    // If profile doesn't exist yet, we still return basic info
    const profile = patientProfile || {
      name: user.name,
      age: 0,
      gender: "Not specified",
      bloodGroup: "Unknown",
      allergies: [],
      conditions: [],
      lastVisit: now,
    };

    // 4. Fetch related data using patientProfile._id if it exists, else empty
    let vitals = [];
    let medications = [];
    let reports = [];
    let appointments = [];
    let clinicalNotes = [];

    if (patientProfile) {
      vitals = await ctx.db
        .query("vitals")
        .withIndex("by_patient", (q) => q.eq("patientId", patientProfile._id))
        .order("desc")
        .take(10);
        
      medications = await ctx.db
        .query("medications")
        .withIndex("by_patient", (q) => q.eq("patientId", patientProfile._id))
        .collect();

      reports = await ctx.db
        .query("reports")
        .withIndex("by_patient", (q) => q.eq("patientId", patientProfile._id))
        .order("desc")
        .collect();

      appointments = await ctx.db
        .query("appointments")
        .withIndex("by_patient", (q) => q.eq("patientId", patientProfile._id))
        .order("desc")
        .collect();
    }

    clinicalNotes = await ctx.db
      .query("clinicalNotes")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .order("desc")
      .collect();

    return {
      _id: args.patientId, // Users table ID
      patientProfileId: patientProfile?._id,
      name: profile.name,
      age: profile.age,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      allergies: profile.allergies,
      conditions: profile.conditions,
      vitals,
      medications,
      reports,
      appointments,
      clinicalNotes,
      accessExpiresAt: access.expiresAt,
    };
  }
});

export const addClinicalNote = mutation({
  args: {
    patientId: v.id("users"),
    doctorGoogleSub: v.string(),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Verify Doctor
    const doctor = await ctx.db
      .query("users")
      .withIndex("by_googleSub", (q) => q.eq("googleSub", args.doctorGoogleSub))
      .first();

    if (!doctor || doctor.role !== "doctor") {
      throw new Error("Unauthorized: Invalid doctor.");
    }

    // 2. Check Active Access
    const now = new Date().toISOString();
    const access = await ctx.db
      .query("doctorPatientAccess")
      .withIndex("by_doctor_and_patient", (q) => 
        q.eq("doctorId", doctor._id).eq("patientId", args.patientId)
      )
      .first();

    if (!access || access.expiresAt < now) {
      throw new Error("Access Denied: No active access session or session expired.");
    }

    // 3. Add Note
    await ctx.db.insert("clinicalNotes", {
      patientId: args.patientId,
      doctorId: doctor._id,
      note: args.note,
      createdAt: now,
      updatedAt: now,
    });

    // 4. Audit Logging
    await ctx.db.insert("auditLogs", {
      actorId: doctor.googleSub,
      actorRole: "doctor",
      action: "CLINICAL_NOTE_CREATED",
      targetType: "patient",
      targetId: args.patientId,
      timestamp: now,
    });

    return true;
  }
});
