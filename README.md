# HealthBridge AI

### “Understand your health. Act with confidence.”

**HealthBridge AI** is a unified healthcare assistance platform that empowers users to understand symptoms and medical documents, manage family medications and health records, locate nearby healthcare facilities, and access emergency assistance.

---

## 🌟 Flagship Workflows

1. **AI Guided Symptom Checker** (`/dashboard/symptoms`)
   - Interactive multi-step clinical assessment with body area selection, severity scaling, duration, and adaptive follow-up questions.
   - Deterministic red-flag safety safeguards for chest pain, stroke, and respiratory distress.
   - Urgency classification (`Self-Care`, `Clinician Consultation`, `Urgent Emergency`).

2. **Medical Report Analyzer** (`/dashboard/reports`)
   - Upload PDF, JPG, or PNG lab reports with OCR text extraction.
   - Highlight values outside reference ranges (e.g. LDL Cholesterol 142 mg/dL, Fasting Glucose 118 mg/dL).
   - Plain-language medical summaries and custom questions for your doctor.

3. **Prescription & Medicine Scanner** (`/dashboard/prescriptions`)
   - Scan handwritten or printed doctor prescriptions.
   - Extract medicine names, strengths, timing, and food instructions into digital schedule.

4. **Medication Reminders & Adherence** (`/dashboard/medications`)
   - Today's medication timeline, log taken/skipped doses, adherence percentage tracking, and refill alerts.

5. **Emergency SOS & Nearby Care Discovery** (`/dashboard/care`)
   - Persistent Emergency SOS with live GPS location sharing, 1-tap 112/108 calls, and emergency health card.
   - Interactive map and list view for Hospitals, Clinics, Pharmacies, Diagnostic Centers, and 24/7 Trauma centers.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom medical design system tokens
- **Icons**: Lucide Icons
- **OCR Engine**: Tesseract.js (Client-side & Fallback parser)
- **QR Generator**: `qrcode.react` (Digital Health Pass QR Code)
- **Internationalization**: Translation-ready architecture supporting English, Hindi, and Telugu.
- **State & Data**: AppContext store pre-seeded with Judge Demo Mode data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/healthbridge-ai.git
cd healthbridge-ai

# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to test the application.

---

## ⚖️ AI Medical Safety Principles

- HealthBridge AI provides educational guidance only and does not replace a licensed physician.
- Medical safety warning banner is displayed across all clinical workflows.
- High-risk symptoms automatically trigger urgent emergency warnings and never get downgraded by AI.
