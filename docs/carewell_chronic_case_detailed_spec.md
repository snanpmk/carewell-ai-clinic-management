# CareWell AI Clinic Management

## Chronic Case Record -- Detailed Developer Specification

This document defines the **complete digital structure for a Homeopathic
Chronic Case Record** used in the CareWell AI‑assisted clinic management
system.

Purpose: - Standardize chronic case-taking workflow - Provide developers
with a clear schema for database + UI - Enable AI-assisted analysis and
remedy suggestion

------------------------------------------------------------------------

# 1. Case Header (Front Page)

## Administrative Fields

  Field                  Description
  ---------------------- ------------------------------
  OP Number              Unique outpatient identifier
  Unit                   OPD / IPD / Clinic Unit
  Date                   Date of consultation
  Case Taken By          Student / Practitioner
  Clinic / Institution   Optional clinic identifier

## Patient Demographics

  Field               Description
  ------------------- -----------------------
  Name                Full patient name
  Age                 Age at consultation
  Sex                 Male / Female / Other
  Religion            Religious background
  Occupation          Patient occupation
  Spouse Name         Husband/Wife name
  Spouse Occupation   Occupation of spouse
  Address             Full address
  Phone               Contact number

## Summary Diagnosis Section

  Field                   Description
  ----------------------- ---------------------------------------------------
  Disease Diagnosis       Conventional pathology diagnosis
  Homeopathic Diagnosis   Remedy or miasmatic interpretation
  Result                  Cured / Relieved / Referred / Otherwise / Expired

------------------------------------------------------------------------

# 2. Initial Presentation of Illness

Captures **how the patient narrates the complaint**.

  Field                      Description
  -------------------------- ---------------------------------
  Patient Narration          Exact words spoken by patient
  Physician Interpretation   Clinical translation
  Physician Observation      Behaviour, appearance, gestures

------------------------------------------------------------------------

# 3. Presenting Complaints

Structured description of complaints.

  Field            Description
  ---------------- -------------------------
  Complaint Type   Chief / Associated
  Location         Organ / system / area
  Sensation        Pain quality or symptom
  Modalities       Better/Worse factors
  Accompaniments   Associated symptoms

### Location Attributes

-   System
-   Organ
-   Tissue
-   Area
-   Direction / extension
-   Duration

### Modalities

  Symbol   Meaning
  -------- -----------
  \>       Better
  \<       Worse
  =        No change

------------------------------------------------------------------------

# 4. History of Present Illness

Tracks evolution of disease.

  Field                 Description
  --------------------- -------------------------------
  Onset                 When symptoms started
  Cause                 Triggering factor
  Progression           Acute / gradual / progressive
  Frequency             Episodic / continuous
  Previous Treatments   Drugs or therapies taken

------------------------------------------------------------------------

# 5. Previous Illness History

  Age   Illness/Event   Treatment   Remarks
  ----- --------------- ----------- ---------

Possible events:

-   Trauma
-   Fracture
-   Burns
-   Drug allergy
-   Operations
-   Exposure
-   Vaccinations

------------------------------------------------------------------------

# 6. Family History

Tracks hereditary diseases.

## Relations

-   Father
-   Mother
-   Brother
-   Sister
-   Son
-   Daughter
-   Grandparents
-   Maternal relatives
-   Paternal relatives

## Diseases

-   Diabetes
-   Hypertension
-   Cancer
-   Tuberculosis
-   Epilepsy
-   Skin disease
-   Mental illness
-   Autoimmune disease

------------------------------------------------------------------------

# 7. Personal History

## Life Situation

  Field                Description
  -------------------- ------------------------------
  Place of birth       Birth location
  Religion             Religious background
  Caste                Cultural classification
  Education            Highest education
  Training             Professional training
  Economic Status      Poor / middle / rich
  Social Status        Community standing
  Nutritional Status   Underweight / normal / obese
  Marital Status       Married / unmarried
  Years of Marriage    Duration
  Dwelling             Living environment
  Occupation           Job
  Nature of Work       Physical / sedentary
  Family Type          Nuclear / joint / extended

## Development Milestones

  Milestone            Values
  -------------------- -----------------------
  Fontanelle Closure   Early / Normal / Late
  Head Holding         Early / Normal / Late
  Crawling             Early / Normal / Late
  Teething             Early / Normal / Late
  Sitting              Early / Normal / Late
  Standing             Early / Normal / Late
  Walking              Early / Normal / Late
  Talking              Early / Normal / Late

## Maternal Pregnancy History

-   Normal / abnormal pregnancy
-   Premature birth
-   Birth weight
-   Congenital anomalies
-   Immunization

## Habits and Hobbies

  Category     Examples
  ------------ ----------------------------------
  Diet         Vegetarian / Egg / Non‑veg
  Addictions   Tea / Coffee / Smoking / Alcohol
  Sleep        Normal / disturbed
  Activities   Arts / sports / music

## Domestic Relations

-   Family members
-   Relatives
-   Neighbours
-   Friends
-   Colleagues

## Sexual Relations

-   Premarital
-   Marital
-   Extramarital

------------------------------------------------------------------------

# 8. Life Space Investigation (Mental Profile)

Mental characteristics of the patient.

Examples:

-   Fastidious
-   Jealous
-   Timid
-   Hypochondriac
-   Melancholic
-   Obstinate
-   Suspicious
-   Cheerful
-   Gloomy
-   Optimistic
-   Pessimistic
-   Hopeless
-   Despondent

## Emotional Upsets

  Factor   Duration   Remarks
  -------- ---------- ---------

Factors:

-   Anger
-   Fright
-   Shock
-   Grief
-   Joy
-   Disappointment

## Reaction Patterns

  Situation   Aversion   Desire   Aggravation   Amelioration
  ----------- ---------- -------- ------------- --------------

Examples:

-   Company
-   Solitude
-   Consolation
-   Conversation
-   Work
-   Music
-   Travel

## Cognitive Functions

-   Perception
-   Concentration
-   Memory
-   Delusions
-   Fantasies
-   Thought patterns

------------------------------------------------------------------------

# 9. Physical Features

## General Appearance

  Feature          Examples
  ---------------- --------------------------
  Build            Obese / thin / stocky
  Stature          Tall / short
  Complexion       Fair / dark
  Health           Healthy / ill
  Age appearance   Premature old / childish
  Gait             Normal / abnormal
  Cleanliness      Clean / dirty
  Swelling         Present / absent

## Regional Examination

Head‑to‑toe observation.

-   Head
-   Scalp
-   Hair
-   Eyes
-   Ears
-   Nose
-   Face
-   Mouth
-   Tongue
-   Teeth
-   Throat
-   Thyroid
-   Abdomen
-   Pelvis
-   Rectum
-   Urethra
-   Chest
-   Back
-   Neck
-   Extremities
-   Skin

## Functional Generals

  ------------------------------------------------------------------------------------------
  Appetite   Stool   Thirst   Urine   Sex     Sweat   Sleep   Breath   Dreams   Discharges
  ---------- ------- -------- ------- ------- ------- ------- -------- -------- ------------

  ------------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 10. Modalities (Reactions To)

  Factor   Intolerance   Aggravation   Amelioration
  -------- ------------- ------------- --------------

Examples:

-   Time
-   Thermal changes
-   Seasons
-   Weather changes
-   Moon phases
-   Noise
-   Air
-   Clothing
-   Bathing
-   Food
-   Motion
-   Posture
-   Sleep
-   Sex
-   Eliminations
-   Menses

------------------------------------------------------------------------

# 11. Constitution

## Physical Makeup

-   Carbon
-   Nitrogenoid
-   Oxygenoid

## Temperament

-   Choleric
-   Melancholic
-   Nervous
-   Sanguine
-   Plethoric
-   Phlegmatic

## Thermal State

-   Hot patient
-   Cold patient
-   Ambient

## Side Affinity

-   Left
-   Right
-   Alternating
-   Crosswise

## Tendencies

-   Hemorrhagic
-   Suppurative
-   Spasmodic
-   Catch cold easily
-   Exhaustion
-   Rapid growth
-   Retarded growth

------------------------------------------------------------------------

# 12. Physical Examination

## General Examination

-   Jaundice
-   Anemia
-   Oedema
-   Cyanosis
-   Clubbing
-   Lymphadenopathy

## Vitals

  Height   Weight   BMI   Pulse   Respiration   Temperature   BP
  -------- -------- ----- ------- ------------- ------------- ----

## Systemic Examination

-   Respiratory system
-   Cardiovascular system
-   Gastrointestinal system
-   Nervous system
-   Musculoskeletal system
-   Endocrine system
-   Skin
-   Eye / ENT

------------------------------------------------------------------------

# 13. Menstrual History

Fields:

-   LMP
-   Amenorrhea (primary / secondary)

## Cycle Table

  ------------------------------------------------------------------------------
  Cycle    Duration   Quantity   Clots    Colour   Odour    Stains   Frequency
  -------- ---------- ---------- -------- -------- -------- -------- -----------

  ------------------------------------------------------------------------------

## Menstrual Symptoms

  Before   Beginning   During   After
  -------- ----------- -------- -------

## Menopause

  Pre   During   Post
  ----- -------- ------

## Vaginal Discharge

  ------------------------------------------------------------------------------------
  Type       Onset      Colour     Acidity    Modalities   Accompaniments   Cause
  ---------- ---------- ---------- ---------- ------------ ---------------- ----------

  ------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 14. Obstetrical History

## Pregnancy Summary

-   Gravida
-   Para
-   Abortions
-   Living children

## Pregnancy Table

  -------------------------------------------------------------------------------------------------------------------
  Year   Pregnancy   Complications   Labour   Delivery   Puerperium   Sex    Weight   Condition   Viability   Cause
         Period                                                                                               of
                                                                                                              Death
  ------ ----------- --------------- -------- ---------- ------------ ------ -------- ----------- ----------- -------

  -------------------------------------------------------------------------------------------------------------------

## Contraception

-   Temporary
-   Permanent

## Present Pregnancy

-   LMP
-   Date of conception
-   EDC
-   Morning sickness
-   Bleeding PV

------------------------------------------------------------------------

# 15. Disease Analysis

## Provisional Diagnosis

Working clinical diagnosis.

## Differential Diagnosis

Possible alternative diseases.

## Symptom Analysis

  Common / Pathognomonic   Characteristic / Determinative
  ------------------------ --------------------------------

## Laboratory Findings

-   Urine
-   Stool
-   Blood
-   Sputum
-   Imaging
-   ECG
-   Other tests

------------------------------------------------------------------------

# 16. Homeopathic Diagnosis

## Totality of Symptoms

Characteristic symptoms selected for remedy choice.

## Miasmatic Expression

-   Psora
-   Sycosis
-   Syphilis

## Repertorization

  Symptom   Rubric   Explanation
  --------- -------- -------------

## Final Diagnosis

-   Disease
-   Hahnemannian classification
-   Miasm dominance
-   Homeopathic diagnosis

------------------------------------------------------------------------

# 17. Management & Treatment

## Treatment Plan

Overall strategy.

## Supportive Measures

-   General
-   Surgical
-   Accessory

## Restrictions

  Disease   Medicinal
  --------- -----------

## First Prescription

-   Medicine
-   Potency
-   Dose

------------------------------------------------------------------------

# 18. Follow‑Up

  Date   Symptom Changes   Interference   Prescription
  ------ ----------------- -------------- --------------

------------------------------------------------------------------------

# Implementation Guidance (For Developers)

Recommended modules:

1.  Patient Management
2.  Consultation Case Record
3.  Diagnosis Engine
4.  Repertory Integration
5.  Prescription System
6.  Follow‑up Tracking
7.  AI Symptom Analysis
8.  Remedy Suggestion

Recommended Tech Stack:

Backend: - Node.js - Express - MongoDB

Frontend: - React - Tailwind

AI: - LLM symptom interpretation - Remedy suggestion model