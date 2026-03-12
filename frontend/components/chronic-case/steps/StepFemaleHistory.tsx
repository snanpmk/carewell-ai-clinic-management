"use client";

import { useForm } from "react-hook-form";
import { StepProps } from "../ChronicCaseWizard";
import { ChronicCase } from "@/types/chronicCase";
import { Input } from "@/components/ui/Input";
import { DynamicTable } from "@/components/ui/DynamicTable";
import StepLayout from "../StepLayout";
import { Calendar, Baby, Activity } from "lucide-react";

export default function StepFemaleHistory({ caseData, updateCaseData, nextStep, prevStep }: StepProps) {
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm({
    defaultValues: {
      femaleHistory: {
        menstrual: caseData.femaleHistory?.menstrual || { flowDetails: {}, quantumMaintenance: {}, menopause: {}, vaginalDischarge: [] },
        obstetrical: caseData.femaleHistory?.obstetrical || { pregnancyTable: [], presentPregnancy: {} },
      }
    }
  });

  const onSubmit = (data: Partial<ChronicCase>) => {
    updateCaseData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contents">
      <StepLayout
        title="Gynaecological History"
        subtitle="Menstrual characteristics and obstetrical history"
        onBack={prevStep}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-12">
          {/* Section 11: Menstrual History */}
          <div className="space-y-8">
            <div className="eyebrow flex items-center gap-3">
              <Calendar className="w-4 h-4" /> Menstrual Cycle Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="LMP Date" {...register("femaleHistory.menstrual.lmp")} placeholder="e.g. 12/05/2024" />
              <Input label="Menarche Age" {...register("femaleHistory.menstrual.menarche")} />
              <Input label="Regularity" {...register("femaleHistory.menstrual.regularity")} />
              <Input label="Duration (Days)" {...register("femaleHistory.menstrual.duration")} />
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
              <div className="eyebrow !text-[9px]">Flow Characteristics</div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Input label="Quantity" {...register("femaleHistory.menstrual.flowDetails.quantity")} />
                <Input label="Colour" {...register("femaleHistory.menstrual.flowDetails.colour")} />
                <Input label="Odour" {...register("femaleHistory.menstrual.flowDetails.odour")} />
                <Input label="Consistency" {...register("femaleHistory.menstrual.flowDetails.consistency")} />
                <Input label="Stains" {...register("femaleHistory.menstrual.flowDetails.stains")} />
                <Input label="Frequency" {...register("femaleHistory.menstrual.flowDetails.frequency")} />
              </div>
            </div>

            <DynamicTable 
              control={control}
              register={register}
              name="femaleHistory.menstrual.vaginalDischarge"
              label="Abnormal Vaginal Discharges"
              emptyRow={{ type: "", duration: "", colourOdour: "", modalities: "" }}
              columns={[
                { header: "Type", accessor: "type" },
                { header: "Duration", accessor: "duration" },
                { header: "Colour/Odour", accessor: "colourOdour" },
                { header: "Modalities", accessor: "modalities" },
              ]}
            />
          </div>

          {/* Section 12: Obstetrical History */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <div className="eyebrow flex items-center gap-3">
              <Baby className="w-4 h-4" /> Obstetrical & Pregnancy Archive
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Input label="Gravida (G)" {...register("femaleHistory.obstetrical.gravida")} />
              <Input label="Para (P)" {...register("femaleHistory.obstetrical.para")} />
              <Input label="Abortion (A)" {...register("femaleHistory.obstetrical.abortion")} />
              <Input label="Living Children" {...register("femaleHistory.obstetrical.livingChildren")} />
            </div>

            <DynamicTable 
              control={control}
              register={register}
              name="femaleHistory.obstetrical.pregnancyTable"
              label="Previous Pregnancies Table"
              emptyRow={{ year: "", complications: "", labour: "", childSex: "", childWeight: "" }}
              columns={[
                { header: "Year", accessor: "year" },
                { header: "Complications", accessor: "complications" },
                { header: "Labour Events", accessor: "labour" },
                { header: "Child Sex", accessor: "childSex" },
                { header: "Birth Weight", accessor: "childWeight" },
              ]}
            />

            <div className="p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
              <div className="eyebrow !text-[9px] mb-4 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Present Pregnancy Status
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="EDC" {...register("femaleHistory.obstetrical.presentPregnancy.edc")} />
                <Input label="Morning Sickness" {...register("femaleHistory.obstetrical.presentPregnancy.morningSickness")} />
                <Input label="Bleeding P/V" {...register("femaleHistory.obstetrical.presentPregnancy.bleedingPV")} />
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    </form>
  );
}
