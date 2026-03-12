export interface ChronicCase {
  _id?: string;
  patient: string;
  status: "Draft" | "Active" | "Completed" | "Closed";
  createdAt?: string;
  updatedAt?: string;

  // 1. FRONT PAGE / HEADER
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
    caste?: string;
    education?: string;
    training?: string;
    occupation?: string;
    spouseName?: string;
    spouseOccupation?: string;
    address?: string;
    phone?: string;
    economicStatus?: string;
    socialStatus?: string;
    nutritionalStatus?: string;
    maritalStatus?: string;
    yearsOfMarriage?: string;
    dwellings?: string;
    customs?: string;
    politicalStatus?: string;
  };
  summaryDiagnosis?: {
    diseaseDiagnosis?: string;
    homeopathicDiagnosis?: string;
    result?: "Cured" | "Relieved" | "Referred" | "Otherwise" | "Expired" | "";
  };

  // 2. INITIAL PRESENTATION
  initialPresentation?: {
    patientNarration?: string;
    physicianInterpretation?: string;
    physicianObservation?: string;
  };

  // 3. PRESENTING COMPLAINTS
  presentingComplaints?: Array<{
    complaintType: "Chief" | "Associated";
    location: {
      system?: string;
      organ?: string;
      tissue?: string;
      areas?: string;
      direction?: string;
      extension?: string;
      duration?: string;
    };
    sensation?: string;
    modalities?: {
      aggravation?: string;
      amelioration?: string;
      equivalent?: string;
    };
    accompaniments?: string;
  }>;

  // 4. HISTORY OF PRESENT ILLNESS
  historyOfPresentIllness?: {
    narrative?: string;
    onset?: string;
    cause?: string;
    progression?: string;
    frequency?: string;
    previousTreatments?: string;
  };

  // 5. HISTORY OF PREVIOUS ILLNESS
  previousIllnessHistory?: Array<{
    age?: string;
    event?: string;
    treatment?: string;
    remarks?: string;
  }>;

  // 6. HISTORY OF FAMILY ILLNESS
  familyHistory?: Array<{
    relation: string;
    disease: string;
    status: string;
    age?: string;
  }>;

  // 7. PERSONAL HISTORY
  personalHistory?: {
    familyStatus?: {
      type?: "Nuclear" | "Joint" | "Extended" | "";
      details?: string;
    };
    developmentMilestones?: {
      fontanellaClosure?: "Early" | "Normal" | "Late" | "";
      headHolding?: string;
      crawling?: string;
      teething?: string;
      sitting?: string;
      standing?: string;
      walking?: string;
      talking?: string;
    };
    birthHistory?: {
      motherConditionDuringPregnancy?: string;
      type?: "Normal" | "Abnormal" | "Premature" | "";
      weightKg?: number;
      congenitalAnomalies?: string;
      immunization?: string;
    };
    habitsHobbies?: {
      diet?: "Vegetarian" | "Egg vegetarian" | "Non vegetarian" | "";
      addictions?: string[];
      sleep?: string;
      artistic?: string;
      sports?: string;
    };
    domesticRelations?: {
      family?: string;
      relatives?: string;
      neighbours?: string;
      friends?: string;
      colleagues?: string;
    };
    sexualRelations?: {
      type?: "Premarital" | "Marital" | "Extramarital" | "Others" | "";
      details?: string;
    };
  };

  // 8. LIFE SPACE INVESTIGATION
  lifeSpaceInvestigation?: {
    mentalFeatures?: string[];
    emotionalFactors?: Array<{
      factor?: string;
      occasion?: string;
      duration?: string;
    }>;
    reactionPatterns?: Array<{
      trigger?: string;
      aversion?: string;
      desire?: string;
      intolerance?: string;
      aggravation?: string;
      amelioration?: string;
    }>;
    otherFeatures?: {
      emotional?: string;
      perception?: string;
      memory?: string;
      thoughtFormulation?: string;
      thinking?: string;
      fancies?: string;
    };
  };

  // 9. PHYSICAL FEATURES
  physicalFeatures?: {
    appearance?: {
      build?: "Obese" | "Stocky" | "Thin" | "";
      stature?: "Large" | "Small" | "";
      complexion?: "Healthy" | "Unwell" | "Ill" | "";
      ageAppearance?: "Premature old" | "Childish" | "Young" | "Senile" | "";
      gait?: string;
      deformity?: string;
      cleanliness?: "Clean" | "Dirty" | "";
      swelling?: string;
    };
    regionalExamination?: {
      headScalpHair?: string;
      eyesVision?: string;
      earHearingWax?: string;
      noseOlfaction?: string;
      faceExpression?: string;
      mouthMouthSalivaTasteBreath?: string;
      palateGumsTongueCoating?: string;
      teethLips?: string;
      throatTonsilsLarynxVoice?: string;
      gastric?: string;
      abdomenUmbilicusPelvis?: string;
      rectumAnusDefecation?: string;
      urethraUrination?: string;
      genitalia?: string;
      chestBreast?: string;
      backNeck?: string;
      extremitiesUpper?: string;
      extremitiesLower?: string;
      skin?: string;
    };
    generals?: {
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
      abnormalSecretions?: string;
      excretions?: string;
    };
    reactionsToFactors?: Array<{
      factor?: string;
      intolerance?: string;
      sensitivity?: string;
      aggravation?: string;
      amelioration?: string;
    }>;
    constitution?: {
      physicalMakeup?: "Carbon" | "Nitrogenoid" | "Oxygenoid" | "";
      temperament?: "Choleric" | "Melancholic" | "Nervous" | "Sanguine" | "Plethoric" | "Phlegmatic" | "";
      thermal?: "Hot" | "Ambient" | "Cold" | "";
      sideAffinity?: "Left" | "Right" | "Alternating" | "Diagonal" | "Crosswise" | "None" | "";
      tendencies?: string[];
    };
  };

  // 10. PHYSICAL EXAMINATION
  physicalExamination?: {
    general?: {
      jaundice?: string;
      anemia?: string;
      oedema?: string;
      cyanosis?: string;
      clubbing?: string;
      lymphadenopathy?: string;
      skinColor?: string;
      eruptions?: string;
    };
    vitals?: {
      height?: string;
      weight?: string;
      bmi?: string;
      pulse?: string;
      respiration?: string;
      temperature?: string;
      bp?: string;
    };
    systemic?: {
      respiratory?: string;
      cardiovascular?: string;
      gastrointestinal?: string;
      neurogenic?: string;
      musculoskeletal?: string;
      cns?: string;
      endocrine?: string;
      specialSenses?: string;
    };
  };

  // 11 & 12. FEMALE HISTORY
  femaleHistory?: {
    menstrual?: {
      lmp?: string;
      amenorrhea?: string;
      regularity?: string;
      duration?: string;
      flowDetails?: {
        quantity?: string;
        consistency?: string;
        colour?: string;
        odour?: string;
        stains?: string;
        frequency?: string;
      };
      quantumMaintenance?: {
        before?: string;
        beginning?: string;
        during?: string;
        after?: string;
      };
      menarche?: string;
      menopause?: {
        age?: string;
        symptoms?: string;
        stage?: "Pre" | "With" | "Post" | "";
      };
      vaginalDischarge?: Array<{
        type?: string;
        duration?: string;
        colourOdour?: string;
        stainsAcidity?: string;
        modalities?: string;
        accompaniments?: string;
      }>;
    };
    obstetrical?: {
      gravida?: string;
      para?: string;
      abortion?: string;
      livingChildren?: string;
      pregnancyTable?: Array<{
        year?: string;
        period?: string;
        complications?: string;
        labour?: string;
        deliveryMode?: string;
        puerperium?: string;
        childSex?: string;
        childWeight?: string;
        childCondition?: string;
      }>;
      contraception?: string;
      presentPregnancy?: {
        lmp?: string;
        conceptionDate?: string;
        edc?: string;
        morningSickness?: string;
        bleedingPV?: string;
        complaints?: string;
      };
    };
  };

  // 13 & 14. ANALYSIS & DIAGNOSIS
  analysisAndDiagnosis?: {
    provisionalDiagnosis?: string;
    differentialDiagnosis?: string;
    symptomAnalysis?: {
      basicCommon?: string;
      determinativeUncommon?: string;
    };
    laboratoryFindings?: string;
    finalDiagnosis?: {
      disease?: string;
      hahnemannianClassification?: string;
      miasmDominance?: string;
      homeopathicDiagnosis?: string;
    };
    evaluation?: {
      totalityOfSymptoms?: string;
      miasmaticExpression?: string[];
    };
    repertorization?: {
      repertoryName?: string;
      table?: Array<{
        symptom?: string;
        rubric?: string;
        explanation?: string;
      }>;
    };
  };

  // 15. MANAGEMENT & TREATMENT
  management?: {
    plan?: string;
    restrictions?: {
      diet?: string;
      regimen?: string;
      medicinal?: string;
    };
    firstPrescription?: {
      basis?: string;
      medicines?: Array<{
        medicine?: string;
        potency?: string;
        form?: string;
        dose?: string;
      }>;
    };
  };

  // 16. PROGRESS
  followUps?: Array<{
    date?: string;
    symptomChanges?: string;
    interference?: string;
    prescription?: string;
  }>;

  // AI ANALYSIS (DRAFTING)
  homeopathicDiagnosis?: {
    totalityOfSymptoms?: string;
    miasmaticExpression?: string;
    differentialConsiderations?: string;
    repertorization?: Array<{
      symptom?: string;
      rubric?: string;
      explanation?: string;
    }>;
  };
}
