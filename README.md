# Carewell AI – Homeopathic Consultation Suite

Carewell AI is a high-performance clinical management platform designed specifically for classical homeopathic practice. It streamlines the consultation workflow by leveraging Google Gemini AI to transform raw patient observations into structured, professional medical notes.

## 🌟 Core Purpose

Classical homeopathy relies on capturing a vast array of symptoms, modalities, and mental states. Translating these complex, often unstructured details into clinical notes is time-consuming. Carewell AI bridges this gap, allowing doctors to focus on the patient while the AI handles the synthesis of symptoms, physical generals, and mental states into professional assessment summaries.

## ✨ Key Features

- **AI Note Generation**: Intelligent synthesis of symptoms, modalities, and mental states into structured medical reports (Chief Complaint, Assessment, and Advice).
- **Intelligent Caching**: Database-level SHA-256 caching for LLM responses to ensure zero-latency for recurring cases and reduced API costs.
- **Dynamic Dashboard**: Real-time clinical analytics including patient growth, consultation volume, and appointment metrics.
- **Mobile-First Design**: A premium, responsive interface featuring a glassmorphic sidebar and mobile-optimized card views for clinic rounds.
- **Patient Management**: Complete onboarding system with flexible clinical history tracking.
- **History Summarization**: AI-driven summaries of past consultations to quickly grasp a patient's progress over time.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) & [Zustand](https://docs.pmnd.rs/zustand/)
- **Styling**: Tailwind CSS with Modern Design Tokens
- **Validation**: Zod + React Hook Form
- **Icons**: Lucide React

### Backend
- **Core**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **AI Engine**: Google Gemini AI (`gemini-2.5-flash`)
- **Security**: SHA-256 Request Hashing, Helmet.js, CORS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance (Atlas or Local)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carewell-ai-notes-app
   ```

2. **Environment Setup**

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_api_key
   ```

   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Deployment**
   For instructions on how to deploy this application for free on Vercel and Render, please refer to the [Deployment Guide](./DEPLOYMENT_GUIDE.md).

## 🛡 Security & Privacy
Carewell AI is built with privacy in mind. All clinical records are stored with unique internal identifiers, and LLM interactions are limited to clinical synthesis without requiring PII (Personally Identifiable Information) in the prompt construction where possible.

---
© 2026 Carewell Homeo Clinic. All rights reserved.
