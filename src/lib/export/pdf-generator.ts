import { jsPDF } from "jspdf";
import type { ResultRow } from "./csv-generator";

export function generatePdf(
  examTitle: string,
  results: ResultRow[]
): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Exam Results: ${examTitle}`, 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Total submissions: ${results.length}`, 14, 34);

  // Table headers
  const headers = [
    "Student Name",
    "Student No.",
    "Score",
    "Max",
    "%",
    "Grade",
    "Confidence",
    "Status",
  ];
  const colWidths = [50, 30, 20, 20, 20, 20, 30, 30];
  const startX = 14;
  let y = 45;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setFillColor(59, 130, 246);
  doc.setTextColor(255, 255, 255);

  let x = startX;
  headers.forEach((header, i) => {
    doc.rect(x, y - 5, colWidths[i], 8, "F");
    doc.text(header, x + 2, y);
    x += colWidths[i];
  });

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  y += 6;

  results.forEach((row, index) => {
    if (y > 180) {
      doc.addPage();
      y = 20;
    }

    const fillColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);

    x = startX;
    const cells = [
      (row.studentName || "Unknown").substring(0, 24),
      (row.studentNumber || "N/A").substring(0, 14),
      String(row.totalScore),
      String(row.maxScore),
      row.percentage.toFixed(1),
      row.grade,
      `${row.confidence.toFixed(1)}%`,
      row.status,
    ];

    cells.forEach((cell, i) => {
      doc.rect(x, y - 4, colWidths[i], 7, "F");
      doc.text(cell, x + 2, y);
      x += colWidths[i];
    });

    y += 7;
  });

  return doc.output("arraybuffer");
}
