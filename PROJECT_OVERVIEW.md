# Carewell AI: Intelligent Homeopathic Clinical Assistant

## 📌 Project Overview
Carewell AI is a specialized Electronic Health Record (EHR) and clinical decision-support system designed for classical homeopathic practitioners. It transforms the traditionally time-consuming case-taking process into a streamlined digital workflow, using AI as a clinical scribe and analytical partner.

## 🎯 Project Aim
The primary goal is to reduce the "documentation burden" on doctors, allowing them to focus more on patient interaction. By automating structured data entry and providing analytical insights (Repertorization and Miasmatic Analysis), the system helps doctors reach the **Simillimum** (the matching remedy) faster and more accurately.

## 🩺 Services for the Homeopathic Doctor
*   **The AI Scribe (Acute Consultation):** Converts fragmented, shorthand clinical notes into formal medical records following the **LSMA framework** (Location, Sensation, Modality, Accompaniment).
*   **Chronic Case Builder:** A guided 7-step wizard (Demographics, Initial Presentation, Life Space/Mentals, Physical Generals, Special History, AI Analysis, Management) that ensures comprehensive case-taking.
*   **Analytical Drafting:** Automatically synthesizes case data to suggest **Classical Repertory Rubrics** and **Miasmatic Expressions** (Psora, Sycosis, Syphilis) with clinical justifications.
*   **Clinical Trajectory:** Provides an instant, AI-generated 3-sentence summary of a patient’s entire medical history the moment their profile is opened.
*   **Non-Prescriptive Logic:** The AI acts strictly as an assistant. It suggests "Differential Considerations" for the doctor to study, ensuring the physician maintains full clinical authority.

## ✅ Validity & Clinical Trust
The foundation of this project is built on academic and professional standards:
*   **Case Studies:** Referenced frameworks from the **Govt. of Kerala Homeopathic Medical College**, a world-renowned authority in the field.
*   **Expert Consultation:** Developed in collaboration with a practicing Homeopathic Doctor to ensure the workflow matches real-world clinical needs.
*   **Human-in-the-Loop:** Every AI-generated note is placed in an editable field. No data is finalized without the doctor’s explicit review and approval, eliminating the risk of AI hallucinations.
*   **Standardized Terminology:** Prompts are tuned to use classical homeopathic language (PQRS symptoms, Miasmatic layers, etc.).

## 🚀 Scaling & Future Scope
*   **Data Privacy:** Future updates include PII (Personally Identifiable Information) masking and AES-256 bit encryption for medical records.
*   **Materia Medica Integration:** Connecting suggestions directly to classical texts like Boericke and Kent for immediate reference.
*   **Multi-Clinic Support:** Expanding the architecture to support organizational hierarchies and multiple practitioners.

## 💻 Developer Portfolio Highlights
This project demonstrates several high-level software engineering skills:
1.  **Domain-Driven Design:** Translating complex medical frameworks (LSMA/Homeopathy) into technical requirements.
2.  **Complex State Management:** Handling a deeply nested 7-step wizard using `react-hook-form` and `zod`.
3.  **Resilient AI Integration:** Implementing a robust JSON recovery layer to handle non-deterministic LLM responses and markdown cleaning.
4.  **Full-Stack Architecture:** A clean Node.js/Express backend with linked MongoDB schemas and a performant Next.js frontend.
5.  **Professional UX:** Optimizing for high-density data entry by reducing white space and ensuring natural, non-nested scrolling.

---
*Developed as a real-world solution for clinical documentation fatigue.*
