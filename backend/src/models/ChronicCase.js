const mongoose = require("mongoose");

const DynamicRowSchema = new mongoose.Schema({
  key: String,
  value: String,
  label: String,
});

const ChronicCaseSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Completed"],
      default: "Draft",
    },

    // 1. FRONT PAGE / HEADER
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
      caste: String,
      education: String,
      training: String,
      occupation: String,
      spouseName: String,
      spouseOccupation: String,
      address: String,
      phone: String,
      economicStatus: String,
      socialStatus: String,
      nutritionalStatus: String,
      maritalStatus: String,
      yearsOfMarriage: String,
      dwellings: String,
      customs: String,
      politicalStatus: String,
    },
    summaryDiagnosis: {
      diseaseDiagnosis: String,
      homeopathicDiagnosis: String,
      result: {
        type: String,
        enum: ["Cured", "Relieved", "Referred", "Otherwise", "Expired", ""],
      },
    },

    // 2. INITIAL PRESENTATION
    initialPresentation: {
      patientNarration: String, // Ipsisima Verba
      physicianInterpretation: String,
      physicianObservation: String,
    },

    // 3. PRESENTING COMPLAINTS (Granular Location/Sensation/Modalities/Accompaniments)
    presentingComplaints: [
      {
        complaintType: { type: String, enum: ["Chief", "Associated"] },
        location: {
          system: String,
          organ: String,
          tissue: String,
          areas: String,
          direction: String,
          extension: String,
          duration: String,
        },
        sensation: String,
        modalities: {
          aggravation: String,
          amelioration: String,
          equivalent: String, // "=" in spec
        },
        accompaniments: String,
      },
    ],

    // 4. HISTORY OF PRESENT ILLNESS
    historyOfPresentIllness: {
      narrative: String,
      onset: String,
      cause: String,
      progression: String,
      frequency: String,
      previousTreatments: String,
    },

    // 5. HISTORY OF PREVIOUS ILLNESS
    previousIllnessHistory: [
      {
        age: String,
        event: String, // illness, trauma, fright, allergy, etc.
        treatment: String,
        remarks: String,
      },
    ],

    // 6. HISTORY OF FAMILY ILLNESS
    familyHistory: [
      {
        relation: String,
        disease: String,
        status: String, // Alive/Dead
        age: String,
      },
    ],

    // 7. PERSONAL HISTORY
    personalHistory: {
      familyStatus: {
        type: { type: String, enum: ["Nuclear", "Joint", "Extended", ""] },
        details: String,
      },
      developmentMilestones: {
        fontanellaClosure: { type: String, enum: ["Early", "Normal", "Late", ""] },
        headHolding: String,
        crawling: String,
        teething: String,
        sitting: String,
        standing: String,
        walking: String,
        talking: String,
      },
      birthHistory: {
        motherConditionDuringPregnancy: String,
        type: { type: String, enum: ["Normal", "Abnormal", "Premature", ""] },
        weightKg: Number,
        congenitalAnomalies: String,
        immunization: String,
      },
      habitsHobbies: {
        diet: { type: String, enum: ["Vegetarian", "Egg vegetarian", "Non vegetarian", ""] },
        addictions: [String], // Tea, Coffee, Smoking, etc.
        sleep: String,
        artistic: String,
        sports: String,
      },
      domesticRelations: {
        family: String,
        relatives: String,
        neighbours: String,
        friends: String,
        colleagues: String,
      },
      sexualRelations: {
        type: { type: String, enum: ["Premarital", "Marital", "Extramarital", "Others", ""] },
        details: String,
      },
    },

    // 8. LIFE SPACE INVESTIGATION (Abstract & Mental)
    lifeSpaceInvestigation: {
      mentalFeatures: [String], // The 50+ traits (Fastidious, lazy, etc.)
      emotionalFactors: [
        {
          factor: String, // Anger, Grief, Shock, etc.
          occasion: String,
          duration: String,
        },
      ],
      reactionPatterns: [
        {
          trigger: String, // Company, Consolation, Music, etc.
          aversion: String,
          desire: String,
          intolerance: String,
          aggravation: String,
          amelioration: String,
        },
      ],
      otherFeatures: {
        emotional: String, // Anxious on, Apprehensive about...
        perception: String, // Acute, Hallucination, etc.
        memory: String,
        thoughtFormulation: String,
        thinking: String,
        fancies: String,
      },
    },

    // 9. PHYSICAL FEATURES
    physicalFeatures: {
      appearance: {
        build: { type: String, enum: ["Obese", "Stocky", "Thin", ""] },
        stature: { type: String, enum: ["Large", "Small", ""] },
        complexion: { type: String, enum: ["Healthy", "Unwell", "Ill", ""] },
        ageAppearance: { type: String, enum: ["Premature old", "Childish", "Young", "Senile", ""] },
        gait: String,
        deformity: String,
        cleanliness: { type: String, enum: ["Clean", "Dirty", ""] },
        swelling: String,
      },
      regionalExamination: {
        headScalpHair: String,
        eyesVision: String,
        earHearingWax: String,
        noseOlfaction: String,
        faceExpression: String,
        mouthMouthSalivaTasteBreath: String,
        palateGumsTongueCoating: String,
        teethLips: String,
        throatTonsilsLarynxVoice: String,
        gastric: String,
        abdomenUmbilicusPelvis: String,
        rectumAnusDefecation: String,
        urethraUrination: String,
        genitalia: String,
        chestBreast: String,
        backNeck: String,
        extremitiesUpper: String,
        extremitiesLower: String,
        skin: String,
      },
      generals: {
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
        abnormalSecretions: String,
        excretions: String,
      },
      reactionsToFactors: [
        {
          factor: String, // Time, Thermal, Season, Moon, etc.
          intolerance: String,
          sensitivity: String,
          aggravation: String,
          amelioration: String,
        },
      ],
      constitution: {
        physicalMakeup: { type: String, enum: ["Carbon", "Nitrogenoid", "Oxygenoid", ""] },
        temperament: { type: String, enum: ["Choleric", "Melancholic", "Nervous", "Sanguine", "Plethoric", "Phlegmatic", ""] },
        thermal: { type: String, enum: ["Hot", "Ambient", "Cold", ""] },
        sideAffinity: { type: String, enum: ["Left", "Right", "Alternating", "Diagonal", "Crosswise", "None", ""] },
        tendencies: [String],
      },
    },

    // 10. PHYSICAL EXAMINATION
    physicalExamination: {
      general: {
        jaundice: String,
        anemia: String,
        oedema: String,
        cyanosis: String,
        clubbing: String,
        lymphadenopathy: String,
        skinColor: String,
        eruptions: String,
      },
      vitals: {
        height: String,
        weight: String,
        bmi: String,
        pulse: String,
        respiration: String,
        temperature: String,
        bp: String,
      },
      systemic: {
        respiratory: String,
        cardiovascular: String,
        gastrointestinal: String,
        neurogenic: String,
        musculoskeletal: String,
        cns: String,
        endocrine: String,
        specialSenses: String,
      },
    },

    // 11 & 12. FEMALE HISTORY
    femaleHistory: {
      menstrual: {
        lmp: String,
        amenorrhea: String,
        regularity: String,
        duration: String,
        flowDetails: {
          quantity: String,
          consistency: String,
          colour: String,
          odour: String,
          stains: String,
          frequency: String,
        },
        quantumMaintenance: {
          before: String,
          beginning: String,
          during: String,
          after: String,
        },
        menarche: String,
        menopause: {
          age: String,
          symptoms: String,
          stage: { type: String, enum: ["Pre", "With", "Post", ""] },
        },
        vaginalDischarge: [
          {
            type: String,
            duration: String,
            colourOdour: String,
            stainsAcidity: String,
            modalities: String,
            accompaniments: String,
          },
        ],
      },
      obstetrical: {
        gravida: String,
        para: String,
        abortion: String,
        livingChildren: String,
        pregnancyTable: [
          {
            year: String,
            period: String,
            complications: String,
            labour: String,
            deliveryMode: String,
            puerperium: String,
            childSex: String,
            childWeight: String,
            childCondition: String,
          },
        ],
        contraception: String,
        presentPregnancy: {
          lmp: String,
          conceptionDate: String,
          edc: String,
          complaints: String,
        },
      },
    },

    // 13 & 14. ANALYSIS & DIAGNOSIS
    analysisAndDiagnosis: {
      provisionalDiagnosis: String,
      differentialDiagnosis: String,
      symptomAnalysis: {
        basicCommon: String,
        determinativeUncommon: String,
      },
      laboratoryFindings: String,
      finalDiagnosis: {
        disease: String,
        hahnemannianClassification: String,
        miasmDominance: String,
        homeopathicDiagnosis: String,
      },
      evaluation: {
        totalityOfSymptoms: String,
        miasmaticExpression: [String], // Psora, Sycosis, Syphilis
      },
      repertorization: {
        repertoryName: String,
        table: [
          {
            symptom: String,
            rubric: String,
            explanation: String,
          },
        ],
      },
    },

    // 15. MANAGEMENT & TREATMENT
    management: {
      plan: String, // General, Surgical, Accessory
      restrictions: {
        diet: String,
        regimen: String,
        medicinal: String,
      },
      firstPrescription: {
        basis: String,
        medicine: String,
        potency: String,
        dose: String,
      },
    },

    // 16. PROGRESS (Handled by FollowUps)
    followUps: [
      {
        date: { type: Date, default: Date.now },
        symptomChanges: String,
        interference: String,
        prescription: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChronicCase", ChronicCaseSchema);
