const mongoose = require("mongoose");

const CycleTableSchema = new mongoose.Schema({
  duration: String,
  quantity: String,
  clots: String,
  colour: String,
  odour: String,
  stains: String,
  frequency: String,
});

const MenstrualSymptomsSchema = new mongoose.Schema({
  before: String,
  beginning: String,
  during: String,
  after: String,
});

const VaginalDischargeSchema = new mongoose.Schema({
  type: String,
  onset: String,
  colour: String,
  acidity: String,
  modalities: String,
  accompaniments: String,
  cause: String,
});

const PregnancyTableSchema = new mongoose.Schema({
  year: String,
  pregnancyPeriod: String,
  complications: String,
  labour: String,
  delivery: String,
  puerperium: String,
  sex: String,
  weight: String,
  condition: String,
  viability: String,
  causeOfDeath: String,
});

const FollowUpSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  symptomChanges: String,
  interference: String,
  prescription: String,
});

const RepertorizationSchema = new mongoose.Schema({
  symptom: String,
  rubric: String,
  explanation: String,
});

const ChronicCaseSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    // 1. Case Header
    header: {
      opNumber: String,
      unit: String,
      date: { type: Date, default: Date.now },
      caseTakenBy: String,
      clinic: String,
    },
    demographics: {
      name: String,
      age: Number,
      sex: String,
      religion: String,
      occupation: String,
      spouseName: String,
      spouseOccupation: String,
      address: String,
      phone: String,
    },
    summaryDiagnosis: {
      diseaseDiagnosis: String,
      homeopathicDiagnosis: String,
      result: String, // Cured / Relieved / Referred / Otherwise / Expired
    },

    // 2. Initial Presentation
    initialPresentation: {
      patientNarration: String,
      physicianInterpretation: String,
      physicianObservation: String,
    },

    // 3. Presenting Complaints
    presentingComplaints: [
      {
        complaintType: String, // Chief / Associated
        location: String,
        sensation: String,
        modalities: String,
        accompaniments: String,
      },
    ],

    // 4. History of Present Illness
    historyOfPresentIllness: {
      onset: String,
      cause: String,
      progression: String,
      frequency: String,
      previousTreatments: String,
    },

    // 5. Previous Illness History
    previousIllnessHistory: [
      {
        age: String,
        illnessEvent: String,
        treatment: String,
        remarks: String,
      },
    ],

    // 6. Family History
    familyHistory: {
      relations: [String],
      diseases: [String],
      notes: String,
    },

    // 7. Personal History
    personalHistory: {
      placeOfBirth: String,
      religion: String,
      caste: String,
      education: String,
      training: String,
      economicStatus: String,
      socialStatus: String,
      nutritionalStatus: String,
      maritalStatus: String,
      yearsOfMarriage: String,
      dwelling: String,
      occupation: String,
      natureOfWork: String,
      familyType: String,
      developmentMilestones: {
        fontanelleClosure: String,
        headHolding: String,
        crawling: String,
        teething: String,
        sitting: String,
        standing: String,
        walking: String,
        talking: String,
      },
      maternalPregnancyHistory: String,
      habits: {
        diet: String,
        addictions: String,
        sleep: String,
        activities: String,
      },
      domesticRelations: String,
      sexualRelations: String,
    },

    // 8. Life Space Investigation
    lifeSpaceInvestigation: {
      traits: String,
      emotionalUpsets: String,
      reactionPatterns: [
        {
          situation: String,
          aversion: String,
          desire: String,
          aggravation: String,
          amelioration: String,
        },
      ],
      cognitiveFunctions: String,
    },

    // 9. Physical Features
    physicalFeatures: {
      generalAppearance: {
        build: String,
        stature: String,
        complexion: String,
        health: String,
        ageAppearance: String,
        gait: String,
        cleanliness: String,
        swelling: String,
      },
      regionalExamination: String,
      functionalGenerals: {
        appetite: String,
        stool: String,
        thirst: String,
        urine: String,
        sex: String,
        sweat: String,
        sleep: String,
        breath: String,
        dreams: String,
        discharges: String,
      },
    },

    // 10. Modalities
    modalities: [
      {
        factor: String,
        intolerance: String,
        aggravation: String,
        amelioration: String,
      },
    ],

    // 11. Constitution
    constitution: {
      physicalMakeup: String,
      temperament: String,
      thermalState: String,
      sideAffinity: String,
      tendencies: [String],
    },

    // 12. Physical Examination
    physicalExamination: {
      generalExamination: [String],
      vitals: {
        height: String,
        weight: String,
        bmi: String,
        pulse: String,
        respiration: String,
        temperature: String,
        bp: String,
      },
      systemicExamination: String,
    },

    // 13. Menstrual History
    menstrualHistory: {
      lmp: String,
      amenorrhea: String,
      cycleTable: [CycleTableSchema],
      menstrualSymptoms: MenstrualSymptomsSchema,
      menopause: {
        pre: String,
        during: String,
        post: String,
      },
      vaginalDischarge: [VaginalDischargeSchema],
    },

    // 14. Obstetrical History
    obstetricalHistory: {
      summary: {
        gravida: String,
        para: String,
        abortions: String,
        livingChildren: String,
      },
      pregnancyTable: [PregnancyTableSchema],
      contraception: {
        temporary: String,
        permanent: String,
      },
      presentPregnancy: {
        lmp: String,
        dateOfConception: String,
        edc: String,
        morningSickness: String,
        bleedingPV: String,
      },
    },

    // 15. Disease Analysis
    diseaseAnalysis: {
      provisionalDiagnosis: String,
      differentialDiagnosis: String,
      symptomAnalysis: {
        common: String,
        characteristic: String,
      },
      laboratoryFindings: String,
    },

    // 16. Homeopathic Diagnosis
    homeopathicDiagnosis: {
      totalityOfSymptoms: String,
      miasmaticExpression: String,
      differentialConsiderations: String,
      repertorization: [RepertorizationSchema],
      finalDiagnosis: {
        disease: String,
        classification: String,
        miasmDominance: String,
        homeopathicDiagnosis: String,
      },
    },

    // 17. Management & Treatment
    management: {
      treatmentPlan: String,
      supportiveMeasures: String,
      restrictions: {
        disease: String,
        medicinal: String,
      },
      firstPrescription: {
        medicine: String,
        potency: String,
        dose: String,
      },
    },

    // 18. Follow-up
    followUps: [FollowUpSchema],

    status: {
      type: String,
      enum: ["Draft", "Completed"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChronicCase", ChronicCaseSchema);
