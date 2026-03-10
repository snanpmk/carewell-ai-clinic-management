export interface ChronicCase {
  _id?: string;
  patient: string; // Patient ID
  header?: {
    opNumber?: string;
    unit?: string;
    date?: string;
    caseTakenBy?: string;
    clinic?: string;
  };
  demographics?: {
    name?: string;
    age?: number;
    sex?: string;
    religion?: string;
    occupation?: string;
    spouseName?: string;
    spouseOccupation?: string;
    address?: string;
    phone?: string;
  };
  summaryDiagnosis?: {
    diseaseDiagnosis?: string;
    homeopathicDiagnosis?: string;
    result?: string;
  };
  initialPresentation?: {
    patientNarration?: string;
    physicianInterpretation?: string;
    physicianObservation?: string;
  };
  presentingComplaints?: Array<{
    complaintType?: string;
    location?: string;
    sensation?: string;
    modalities?: string;
    accompaniments?: string;
  }>;
  historyOfPresentIllness?: {
    onset?: string;
    cause?: string;
    progression?: string;
    frequency?: string;
    previousTreatments?: string;
  };
  previousIllnessHistory?: Array<{
    age?: string;
    illnessEvent?: string;
    treatment?: string;
    remarks?: string;
  }>;
  familyHistory?: {
    relations?: string[];
    diseases?: string[];
    notes?: string;
  };
  personalHistory?: {
    placeOfBirth?: string;
    religion?: string;
    caste?: string;
    education?: string;
    training?: string;
    economicStatus?: string;
    socialStatus?: string;
    nutritionalStatus?: string;
    maritalStatus?: string;
    yearsOfMarriage?: string;
    dwelling?: string;
    occupation?: string;
    natureOfWork?: string;
    familyType?: string;
    developmentMilestones?: {
      fontanelleClosure?: string;
      headHolding?: string;
      crawling?: string;
      teething?: string;
      sitting?: string;
      standing?: string;
      walking?: string;
      talking?: string;
    };
    maternalPregnancyHistory?: string;
    habits?: {
      diet?: string;
      addictions?: string;
      sleep?: string;
      activities?: string;
    };
    domesticRelations?: string;
    sexualRelations?: string;
  };
  lifeSpaceInvestigation?: {
    traits?: string[];
    emotionalUpsets?: Array<{
      factor?: string;
      duration?: string;
      remarks?: string;
    }>;
    reactionPatterns?: Array<{
      situation?: string;
      aversion?: string;
      desire?: string;
      aggravation?: string;
      amelioration?: string;
    }>;
    cognitiveFunctions?: string;
  };
  physicalFeatures?: {
    generalAppearance?: {
      build?: string;
      stature?: string;
      complexion?: string;
      health?: string;
      ageAppearance?: string;
      gait?: string;
      cleanliness?: string;
      swelling?: string;
    };
    regionalExamination?: string;
    functionalGenerals?: {
      appetite?: string;
      stool?: string;
      thirst?: string;
      urine?: string;
      sex?: string;
      sweat?: string;
      sleep?: string;
      breath?: string;
      dreams?: string;
      discharges?: string;
    };
  };
  modalities?: Array<{
    factor?: string;
    intolerance?: string;
    aggravation?: string;
    amelioration?: string;
  }>;
  constitution?: {
    physicalMakeup?: string;
    temperament?: string;
    thermalState?: string;
    sideAffinity?: string;
    tendencies?: string[];
  };
  physicalExamination?: {
    generalExamination?: string[];
    vitals?: {
      height?: string;
      weight?: string;
      bmi?: string;
      pulse?: string;
      respiration?: string;
      temperature?: string;
      bp?: string;
    };
    systemicExamination?: string;
  };
  menstrualHistory?: {
    lmp?: string;
    amenorrhea?: string;
    cycleTable?: Array<{
      duration?: string;
      quantity?: string;
      clots?: string;
      colour?: string;
      odour?: string;
      stains?: string;
      frequency?: string;
    }>;
    menstrualSymptoms?: {
      before?: string;
      beginning?: string;
      during?: string;
      after?: string;
    };
    menopause?: {
      pre?: string;
      during?: string;
      post?: string;
    };
    vaginalDischarge?: Array<{
      type?: string;
      onset?: string;
      colour?: string;
      acidity?: string;
      modalities?: string;
      accompaniments?: string;
      cause?: string;
    }>;
  };
  obstetricalHistory?: {
    summary?: {
      gravida?: string;
      para?: string;
      abortions?: string;
      livingChildren?: string;
    };
    pregnancyTable?: Array<{
      year?: string;
      pregnancyPeriod?: string;
      complications?: string;
      labour?: string;
      delivery?: string;
      puerperium?: string;
      sex?: string;
      weight?: string;
      condition?: string;
      viability?: string;
      causeOfDeath?: string;
    }>;
    contraception?: {
      temporary?: string;
      permanent?: string;
    };
    presentPregnancy?: {
      lmp?: string;
      dateOfConception?: string;
      edc?: string;
      morningSickness?: string;
      bleedingPV?: string;
    };
  };
  diseaseAnalysis?: {
    provisionalDiagnosis?: string;
    differentialDiagnosis?: string;
    symptomAnalysis?: {
      common?: string;
      characteristic?: string;
    };
    laboratoryFindings?: string;
  };
  homeopathicDiagnosis?: {
    totalityOfSymptoms?: string;
    miasmaticExpression?: string;
    differentialConsiderations?: string;
    repertorization?: Array<{
      symptom?: string;
      rubric?: string;
      explanation?: string;
    }>;
    finalDiagnosis?: {
      disease?: string;
      classification?: string;
      miasmDominance?: string;
      homeopathicDiagnosis?: string;
    };
  };
  management?: {
    treatmentPlan?: string;
    supportiveMeasures?: string;
    restrictions?: {
      disease?: string;
      medicinal?: string;
    };
    firstPrescription?: {
      medicine?: string;
      potency?: string;
      dose?: string;
    };
  };
  followUps?: Array<{
    date?: string;
    symptomChanges?: string;
    interference?: string;
    prescription?: string;
  }>;
  status?: "Draft" | "Completed";
  createdAt?: string;
  updatedAt?: string;
}
