# Carewell AI - API Documentation

This document outlines the REST API endpoints for the Carewell Homeopathic AI platform.

## Base URL
`http://<your-domain>/api`

## Authentication
Most endpoints require a Bearer Token in the `Authorization` header.
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication & Clinic Management (`/auth`)

### Register Clinic
*   **Endpoint:** `POST /auth/register`
*   **Access:** Public (Strictly one-time setup)
*   **Body:** `{ clinicName, clinicAddress, doctorPhone, doctorLicense, credential, profileImage }`
*   **Description:** Registers a new clinic and its primary administrator using Google OAuth.

### Login
*   **Endpoint:** `POST /auth/login`
*   **Access:** Public
*   **Body:** `{ credential }` (Google ID Token)
*   **Description:** Authenticates a user and returns a JWT.

### Get Current User
*   **Endpoint:** `GET /auth/me`
*   **Access:** Private
*   **Description:** Returns the profile of the currently logged-in user.

### Invite Member
*   **Endpoint:** `POST /auth/invite`
*   **Access:** Private (Primary Admin only)
*   **Body:** `{ email, role }` (Role: 'doctor' or 'staff')
*   **Description:** Sends a secure invitation email to join the clinic.

### Accept Invitation
*   **Endpoint:** `POST /auth/accept-invite`
*   **Access:** Public
*   **Body:** `{ credential, inviteToken, doctorPhone, doctorLicense }`
*   **Description:** Finalizes membership for an invited user.

### Toggle AI Features
*   **Endpoint:** `PUT /auth/toggle-ai`
*   **Access:** Private (Primary Admin only)
*   **Body:** `{ aiEnabled: boolean }`
*   **Description:** Enables/disables AI tools for all practitioners in the clinic.

---

## 2. Patient Management (`/patients`)

### Register Patient
*   **Endpoint:** `POST /patients`
*   **Access:** Private
*   **Body:** `{ name, age, gender, phone, email, address, medicalConditions }`
*   **Description:** Registers a new patient into the clinic registry.

### Get All Patients
*   **Endpoint:** `GET /patients`
*   **Access:** Private
*   **Description:** Fetches all patients associated with the current clinic.

### Get Patient by ID
*   **Endpoint:** `GET /patients/:id`
*   **Access:** Private
*   **Description:** Fetches a single patient's details.

---

## 3. Acute Consultations (`/consultations`)

### Create Consultation
*   **Endpoint:** `POST /consultations`
*   **Access:** Private
*   **Body:** `{ patientId, chiefComplaint, examination, assessment, plan, prescription, etc. }`

### Update Consultation
*   **Endpoint:** `PUT /consultations/:id`
*   **Access:** Private

### Get All Consultations for a Patient
*   **Endpoint:** `GET /consultations/:patientId`
*   **Access:** Private

---

## 4. Chronic Case Management (`/chronicCases`)

### Create Chronic Case
*   **Endpoint:** `POST /chronicCases`
*   **Access:** Private
*   **Description:** Initializes a 12-section homeopathic chronic case record.

### Update Chronic Case
*   **Endpoint:** `PUT /chronicCases/:id`
*   **Access:** Private
*   **Description:** Updates specific sections (Mental Profile, Physical Features, etc.) of a chronic case.

### Add Follow-up
*   **Endpoint:** `POST /chronicCases/:id/followup`
*   **Access:** Private
*   **Body:** `{ date, symptoms, improvementScale, observation, prescription }`

---

## 5. AI Services (`/ai`)

### Generate Consultation Notes
*   **Endpoint:** `POST /ai/generate-notes`
*   **Access:** Private
*   **Body:** `{ transcription or rawNotes }`
*   **Description:** Uses Gemini AI to synthesize raw clinical input into structured SOAP/Homeopathic notes.

### Analyze Chronic Case
*   **Endpoint:** `POST /ai/analyze-chronic-case`
*   **Access:** Private
*   **Body:** `{ caseId }`
*   **Description:** Performs a deep multi-sectional analysis of a chronic case to provide homeopathic insights and repertorial suggestions.

### Summarize Patient History
*   **Endpoint:** `POST /ai/summarize-history`
*   **Access:** Private
*   **Body:** `{ patientId }`
*   **Description:** Generates a concise clinical summary of a patient's entire history.

---

## 6. Media & Uploads (`/upload`)

### Upload Profile/Clinic Images
*   **Endpoint:** `POST /upload`
*   **Access:** Private
*   **Body:** `FormData` (with 'image' field)
*   **Description:** Uploads images to Cloudinary and returns the secure URL.
