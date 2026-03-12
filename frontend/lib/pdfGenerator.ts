import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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

export const generatePrescriptionPDF = (data: PrescriptionData) => {
  const doc = new jsPDF();
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

  // 4. Clinical Context
  let currentY = 80;
  
  if (data.diagnosis || data.symptoms) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 141, 150);
    doc.text('CLINICAL ASSESSMENT', 15, currentY);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(15, currentY + 2, 60, currentY + 2);
    
    currentY += 8;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    
    const assessmentText = data.diagnosis 
      ? `Diagnosis: ${data.diagnosis}` 
      : `Chief Complaint: ${data.symptoms}`;
      
    const splitAssessment = doc.splitTextToSize(assessmentText, pageWidth - 30);
    doc.text(splitAssessment, 15, currentY);
    currentY += (splitAssessment.length * 5) + 5;
  }

  // 5. Prescription Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 48, 87); // Brand Secondary
  doc.text('Rx - PRESCRIPTION', 15, currentY);
  
  currentY += 4;
  
  const tableData = data.prescriptions.map((p, index) => [
    index + 1,
    p.medicine,
    p.potency,
    p.form,
    p.dosage
  ]);

  doc.autoTable({
    startY: currentY,
    head: [['#', 'REMEDY / MEDICINE', 'POTENCY', 'FORM', 'DOSAGE / SCHEDULE']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 141, 150], textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
    margin: { left: 15, right: 15 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

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
  const footerY = 270;
  doc.setDrawColor(230, 230, 230);
  doc.line(10, footerY - 5, pageWidth - 10, footerY - 5);
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This is an electronically generated prescription from Carewell AI.', 15, footerY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('Signature / Seal', pageWidth - 50, footerY - 10);
  doc.line(pageWidth - 60, footerY - 15, pageWidth - 15, footerY - 15);

  // Save PDF
  const fileName = `Prescription_${data.patientName.replace(/\s+/g, '_')}_${data.date}.pdf`;
  doc.save(fileName);
};
