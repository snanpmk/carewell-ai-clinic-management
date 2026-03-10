import { z } from "zod";

export const demographicsSchema = z.object({
  patient: z.string().min(1, "Please select a patient"),
  demographics: z.object({
    name: z.string().min(1, "Name is required"),
    age: z.preprocess((val) => (val === "" ? 0 : Number(val)), z.number().min(0, "Age must be a positive number")),
    sex: z.string().min(1, "Sex is required"),
    religion: z.string().optional(),
    occupation: z.string().optional(),
    address: z.string().optional(),
  }),
});

export type DemographicsFormData = z.infer<typeof demographicsSchema>;

export const initialPresentationSchema = z.object({
  initialPresentation: z.object({
    patientNarration: z.string().optional(),
    physicianObservation: z.string().optional(),
    physicianInterpretation: z.string().optional(),
  }),
  historyOfPresentIllness: z.object({
    progression: z.string().optional(),
  }),
});

export type InitialPresentationFormData = z.infer<typeof initialPresentationSchema>;

export const mentalProfileSchema = z.object({
  lifeSpaceInvestigation: z.object({
    traits: z.string().optional(),
    emotionalUpsets: z.string().optional(),
    cognitiveFunctions: z.string().optional(),
  }),
});

export type MentalProfileFormData = z.infer<typeof mentalProfileSchema>;

export const physicalsSchema = z.object({
  physicalFeatures: z.object({
    generalAppearance: z.object({
      build: z.string().optional(),
      stature: z.string().optional(),
      complexion: z.string().optional(),
      health: z.string().optional(),
      ageAppearance: z.string().optional(),
      gait: z.string().optional(),
      cleanliness: z.string().optional(),
      swelling: z.string().optional(),
    }).optional(),
    functionalGenerals: z.object({
      appetite: z.string().optional(),
      stool: z.string().optional(),
      thirst: z.string().optional(),
      urine: z.string().optional(),
      sweat: z.string().optional(),
      sleep: z.string().optional(),
      dreams: z.string().optional(),
    }).optional(),
  }).optional(),
});

export type PhysicalsFormData = z.infer<typeof physicalsSchema>;

export const specialHistorySchema = z.object({
  previousIllnessHistory: z.array(
    z.object({
      age: z.string().optional(),
      illnessEvent: z.string().optional(),
      treatment: z.string().optional(),
      remarks: z.string().optional(),
    })
  ).optional(),
  familyHistory: z.object({
    notes: z.string().optional(),
  }).optional(),
});

export type SpecialHistoryFormData = z.infer<typeof specialHistorySchema>;

export const treatmentSchema = z.object({
  management: z.object({
    treatmentPlan: z.string().optional(),
    firstPrescription: z.object({
      medicine: z.string().min(1, "Medicine is required"),
      potency: z.string().min(1, "Potency is required"),
      dose: z.string().min(1, "Dose is required"),
    }),
  }),
});

export type TreatmentFormData = z.infer<typeof treatmentSchema>;
