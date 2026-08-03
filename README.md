# HealthBridge AI

> "Understand your health. Act with confidence."

HealthBridge AI is a unified healthcare platform engineered to bridge the gap between complex medical information and patient decision-making. It enables users to evaluate symptoms, interpret lab documents, digitize prescriptions, track family medication schedules, locate emergency facilities, and dispatch immediate assistance when urgent care is required.

---

## Core System Workflows

### 1. AI-Guided Symptom Evaluation (`/dashboard/symptoms`)
- Multi-step clinical intake covering body system selection, symptom duration, severity scoring, and adaptive follow-up inquiries.
- Built-in clinical safety rules for critical indicators like chest pain, stroke signs, and acute respiratory distress. High-risk presentations cannot be downgraded by automated logic.
- Triage stratification across three distinct levels: Self-Care Guidance, Clinician Consultation, and Immediate Emergency Referral.

### 2. Medical Report Analysis (`/dashboard/reports`)
- Ingestion of lab reports in PDF, JPG, and PNG formats with client-side OCR parsing.
- Automated extraction and visual highlighting of out-of-range biomarkers (such as LDL Cholesterol at 142 mg/dL or Fasting Glucose at 118 mg/dL).
- Plain-language clinical summaries alongside structured questions for patients to bring to their next appointment.

### 3. Prescription & Medication Scanner (`/dashboard/prescriptions`)
- Optical recognition for printed and handwritten prescriptions.
- Extracts medication names, dosages, administration schedules, and food-related instructions directly into a digital tracking timeline.

### 4. Medication Management & Adherence (`/dashboard/medications`)
- Daily timeline for scheduled doses, complete with logging for taken or skipped medications, adherence rate metrics, and automated refill alerts.

### 5. Emergency SOS & Regional Facility Discovery (`/dashboard/care`)
- Persistent emergency trigger providing live GPS coordinate sharing, one-tap dialing for national emergency numbers (112 / 108), and an accessible emergency health profile.
- Mapping and directory services covering local hospitals, outpatient clinics, 24/7 pharmacies, diagnostic centers, and acute trauma units.

---

## Architecture & Technology Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Language**: TypeScript (Strict Mode enabled)
- **Styling**: Tailwind CSS configured with a custom clinical design token system
- **Vector Icons**: Lucide React
- **Document Processing**: Tesseract.js for client-side text extraction with fallback parsing logic
- **Pass Generation**: `qrcode.react` for generating emergency digital health pass QR codes
- **Localization**: Multi-language translation layer supporting English, Hindi, and Telugu
- **State Architecture**: Centralized AppContext store initialized with sample patient profiles for testing

---

## Getting Started

### Requirements
- Node.js version 18.x or higher
- npm version 9.x or higher

### Local Setup

```bash
# Clone the repository
git clone https://github.com/your-username/healthbridge-ai.git
cd healthbridge-ai

# Install dependencies
npm install

# Start the local development server
npm run dev
```

After starting the server, open [http://localhost:3000](http://localhost:3000) in your browser to access the environment.

---

## Safety & Governance Standards

- HealthBridge AI operates exclusively as an educational and operational aid. It does not provide medical diagnoses or replace licensed clinical judgment.
- Safety warnings and medical disclaimers are embedded across all patient-facing interfaces.
- Red-flag symptom checks enforce mandatory emergency recommendations that cannot be overridden by automated triage routines.
