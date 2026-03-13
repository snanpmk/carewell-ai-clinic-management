# Collaborative Clinic Documentation Workflow

This documentation outlines the collaborative clinical workflow of the CareWell Homeopathic AI platform, detailing how different users interact within a shared clinic environment.

---

## 1. System Architecture & Personas
The platform operates on a **Clinic-as-a-Silo** model. All data (Patients, Cases, Consultations) is scoped to a specific Clinic ID. Collaboration is managed through three distinct user roles:

| Role | Persona | Key Responsibilities |
| :--- | :--- | :--- |
| **Primary Administrator** | Clinic Owner / Lead Doctor | Clinic registration, AI feature toggling, team invitations, member removal. |
| **Associate Practitioner** | Doctor / Homoeopath | Patient consultations, detailed chronic case taking, AI-assisted analysis. |
| **Support Staff** | Receptionist / Assistant | Patient registration (Onboarding), administrative intake, scheduling. |

---

## 2. Phase 1: Clinic Initialization (Primary Admin Only)
The workflow begins with a one-time registration of the clinic instance.
1.  **Registration:** The Primary Doctor registers the clinic using Google OAuth.
2.  **Configuration:** Via the **Settings & Team** page, the Admin can:
    *   **Toggle AI Clinical Assistance:** Enable or disable smart symptom analysis and automated history summarization for the entire clinic.
    *   **Clinic Profile:** Update clinic address and contact details.

---

## 3. Phase 2: Team Collaboration & Invitations
Collaboration is enabled by the Primary Admin through a secure invitation system:
1.  **Sending Invitations:** From the Settings page, the Admin invites members by email, assigning them a role (`Associate Doctor` or `Reception / Staff`).
2.  **Accepting Invitations:** The invitee receives a secure JWT-based link via email and joins the clinic by signing in with Google.
3.  **Unified Database:** Once joined, all members have access to the **same patient pool** and **clinical history**, filtered strictly by their `clinicId`.

---

## 4. Phase 3: Patient Lifecycle & Ingress
### Step 1: Patient Registration (The Onboarding Module)
*   **Action:** Staff or Doctors use the `Patient Onboarding` page to register new patients.
*   **Data:** Captures demographics (Name, Age, Gender), contact info, and a high-level medical history overview.
*   **Next Step:** Upon "Onboard & Initialize," the system automatically redirects the user to the consultation interface.

### Step 2: Clinical Consultations
#### A. Acute Consultation (Rapid Workflow)
*   Used for regular follow-ups or acute conditions.
*   **AI Feature:** Generates automated Chief Complaint, Assessment, and Advice notes based on practitioner input.

#### B. Chronic Case Builder (Deep Homeopathic Analysis)
A structured, **12-Step Wizard** used for complex constitutional cases:
1.  **Administration:** Legal and clinical meta-data.
2.  **Initial Presentation:** Narrative of the patient's state.
3.  **Presenting Complaints:** Systematic HPI (History of Presenting Illness).
4.  **Medical/Personal History:** Past illnesses and life-events.
5.  **Mental Profile (Life Space):** Detailed psychological investigation.
6.  **Physical Features & Examination:** Constitutional and clinical exams.
7.  **AI Analysis:** (If enabled) Synthesizes all 12 sections into clinical insights.
8.  **Treatment Plan:** Final diagnosis and homeopathic prescription.

---

## 5. Phase 4: Data Governance & Privacy
*   **Role-Based UI:** The UI dynamically adjusts. For example, the "Toggle AI" switch and "Invite Team" panel are hidden from non-admin users.
*   **Privacy Mode:** A global toggle allows practitioners to blur sensitive patient identifiers (Names/Phones) in common areas like the Dashboard or Patients List for GDPR/HIPAA-style compliance during collaborative reviews.
*   **Clinic Security:** Every API request is intercepted by a `protect` middleware that injects the `clinicId` into the query, ensuring no data leaks between different clinic instances.

---

## 6. Summary Flowchart
1.  **Admin** registers Clinic → **Enables AI**.
2.  **Admin** invites **Associate Doctor** and **Receptionist**.
3.  **Receptionist** registers a new **Patient** via Onboarding.
4.  **Associate Doctor** opens the **Chronic Case Builder** to conduct a detailed 12-step evaluation.
5.  **AI Engine** (if enabled) provides synthesis across the shared clinical record.
6.  **Admin** reviews clinical metrics or manages team access as needed.
