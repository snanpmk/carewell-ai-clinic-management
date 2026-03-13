import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PrescriptionData {
  clinicName: string;
  clinicAddress?: string;
  doctorName: string;
  doctorLicense?: string;
  patientName: string;
  patientAge?: number | string;
  patientGender?: string;
  date: string;
  opNumber?: string;
  diagnosis?: string;
  symptoms?: string;
  modalities?: string;
  generals?: string;
  mentals?: string;
  
  // Follow-up specific fields
  symptomChanges?: string;
  interference?: string;
  basisOfPrescription?: string;

  prescriptions: Array<{
    medicine: string;
    potency: string;
    form: string;
    dosage: string;
    quantity?: string;
    indication?: string;
  }>;
  advice?: string;
}

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export const generatePrescriptionPDF = (data: PrescriptionData) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 1. Header (Clinic Information)
  doc.setFillColor(0, 141, 150); // Brand Primary (#008D96)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(data.clinicName.toUpperCase(), pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (data.clinicAddress) {
    doc.text(data.clinicAddress, pageWidth / 2, 25, { align: 'center' });
  }
  
  // 2. Doctor Information
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`DR. ${data.doctorName.toUpperCase()}`, pageWidth / 2, 33, { align: 'center' });
  if (data.doctorLicense) {
    doc.setFontSize(8);
    doc.text(`Reg No: ${data.doctorLicense}`, pageWidth / 2, 37, { align: 'center' });
  }

  // 3. Patient Info Bar
  doc.setTextColor(60, 60, 60);
  doc.setFillColor(245, 245, 245);
  doc.rect(10, 45, pageWidth - 20, 25, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PATIENT:', 15, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientName.toUpperCase(), 40, 52);
  
  doc.setFont('helvetica', 'bold');
  doc.text('AGE/SEX:', 15, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.patientAge || 'N/A'} / ${data.patientGender || 'N/A'}`, 40, 58);

  doc.setFont('helvetica', 'bold');
  doc.text('OP NO:', 15, 64);
  doc.setFont('helvetica', 'normal');
  doc.text(data.opNumber || 'N/A', 40, 64);

  doc.setFont('helvetica', 'bold');
  doc.text('DATE:', 120, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(data.date, 145, 52);

  // 4. Clinical Context & Follow-up Details
  let currentY = 80;
  
  const clinicalDetails = [
    { label: 'Diagnosis:', value: data.diagnosis },
    { label: 'Chief Complaint:', value: data.symptoms },
    { label: 'Symptom Changes:', value: data.symptomChanges },
    { label: 'Interference:', value: data.interference },
    { label: 'Prescription Basis:', value: data.basisOfPrescription },
    { label: 'Modalities:', value: data.modalities },
    { label: 'Physical Generals:', value: data.generals },
    { label: 'Mental State:', value: data.mentals },
  ].filter(item => !!item.value);

  if (clinicalDetails.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 141, 150);
    doc.text('CLINICAL EVALUATION', 15, currentY);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(15, currentY + 2, 60, currentY + 2);
    
    currentY += 10;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    clinicalDetails.forEach(item => {
      doc.setFont('helvetica', 'bold');
      doc.text(item.label, 15, currentY);
      doc.setFont('helvetica', 'normal');
      const splitValue = doc.splitTextToSize(item.value || "", pageWidth - 55);
      doc.text(splitValue, 50, currentY);
      currentY += (splitValue.length * 5) + 3;

      // Page break check
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
    });
    
    currentY += 5;
  }

  // 5. Prescription Table
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 48, 87); // Brand Secondary
  doc.text('Rx - PRESCRIPTION', 15, currentY);
  
  currentY += 4;
  
  const tableData = data.prescriptions.map((p, index) => [
    index + 1,
    `${p.medicine} ${p.potency}`,
    p.form || '-',
    p.dosage,
    p.quantity || '-',
    p.indication || '-'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'REMEDY & POTENCY', 'FORM', 'DOSAGE', 'QTY', 'INDICATION']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 141, 150], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
    margin: { left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 45, fontStyle: 'bold' },
      2: { cellWidth: 20 },
      3: { cellWidth: 35 },
      4: { cellWidth: 20 },
      5: { cellWidth: 'auto' },
    },
  });

  const finalY = doc.lastAutoTable?.finalY || currentY;
  currentY = finalY + 15;

  // Check for page overflow before drawing Advice
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // 6. Advice / Instructions
  if (data.advice) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 141, 150);
    doc.text('ADVICE & INSTRUCTIONS', 15, currentY);
    
    currentY += 6;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    
    const splitAdvice = doc.splitTextToSize(data.advice, pageWidth - 30);
    doc.text(splitAdvice, 15, currentY);
    
    currentY += (splitAdvice.length * 5) + 15;
  }

  // 7. Footer / Signature
  const footerY = 280;
  doc.setDrawColor(230, 230, 230);
  doc.line(10, footerY - 15, pageWidth - 10, footerY - 15);
  
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('This is an electronically generated prescription from Carewell AI Homeopathy.', 15, footerY - 10);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Signature / Seal', pageWidth - 50, footerY - 20);
  doc.line(pageWidth - 60, footerY - 25, pageWidth - 15, footerY - 25);

  // Save PDF
  const fileName = `Prescription_${data.patientName.replace(/\s+/g, '_')}_${data.date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
