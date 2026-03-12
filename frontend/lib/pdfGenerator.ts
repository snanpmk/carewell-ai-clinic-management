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
  
  if (data.diagnosis || data.symptoms || data.modalities || data.generals || data.mentals) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 141, 150);
    doc.text('CLINICAL DETAILS', 15, currentY);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(15, currentY + 2, 60, currentY + 2);
    
    currentY += 8;
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    const details = [
      { label: 'Diagnosis:', value: data.diagnosis },
      { label: 'Chief Complaint:', value: data.symptoms },
      { label: 'Modalities:', value: data.modalities },
      { label: 'Physical Generals:', value: data.generals },
      { label: 'Mental State:', value: data.mentals },
    ];

    details.forEach(item => {
      if (item.value) {
        doc.setFont('helvetica', 'bold');
        doc.text(item.label, 15, currentY);
        doc.setFont('helvetica', 'normal');
        const splitValue = doc.splitTextToSize(item.value, pageWidth - 50);
        doc.text(splitValue, 45, currentY);
        currentY += (splitValue.length * 5) + 2;
      }
    });
    
    currentY += 5;
  }

  // 5. Prescription Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 48, 87); // Brand Secondary
  doc.text('Rx - PRESCRIPTION', 15, currentY);
  
  currentY += 4;
  
  const tableData = data.prescriptions.map((p, index) => [
    index + 1,
    `${p.medicine} ${p.potency}`,
    p.form,
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
      2: { cellWidth: 25 },
      3: { cellWidth: 35 },
      4: { cellWidth: 20 },
      5: { cellWidth: 'auto' },
    },
    didDrawPage: (dataArg) => {
      // Keep track of Y position for next elements
      currentY = dataArg.cursor ? dataArg.cursor.y : currentY;
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 15;

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
  const fileName = `Prescription_${data.patientName.replace(/\s+/g, '_')}_${data.date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
