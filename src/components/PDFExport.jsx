import jsPDF from "jspdf";
import "jspdf-autotable";

const PDFExport = ({ lessonPlan }) => {
  const generatePDF = () => {
    if (!lessonPlan) {
      alert("No lesson plan available!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20; 
    const addSectionHeader = (title) => {
      if (y + 15 > pageHeight) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(50, 50, 150); // Dark Blue Background
      doc.setTextColor(255, 255, 255); // White Text
      doc.setFont("helvetica", "bold");
      doc.rect(10, y - 5, pageWidth - 20, 10, "F"); // Background Fill
      doc.text(title, 15, y);
      doc.setTextColor(0, 0, 0); // Reset Text Color
      y += 12;
    };
    const checkPageSpace = (neededSpace) => {
      if (y + neededSpace > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };
    const formatText = (data) => {
      if (!data) return "N/A"; // Handle empty values
      if (typeof data === "string") return data; // Already a string
      if (Array.isArray(data)) return data.join(", "); // Convert array to string
      if (typeof data === "object") return JSON.stringify(data, null, 2); // Convert objects to readable JSON
      return String(data); // Convert other types to string
    };
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Lesson Plan", pageWidth / 2, 15, { align: "center" });
    y += 10;
    addSectionHeader("Lesson Details");
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(` Topic: ${formatText(lessonPlan.topic)}`, 15, y);
    y += 8;
    doc.text(` Grade Level: ${formatText(lessonPlan.grade_level)}`, 15, y);
    y += 8;
    doc.text(` Subject: ${formatText(lessonPlan.subject)}`, 15, y);
    y += 8;
    doc.text(` Duration: ${formatText(lessonPlan.duration)}`, 15, y);
    y += 15;
    addSectionHeader(" Materials Needed");
    checkPageSpace(10);
    doc.text(formatText(lessonPlan.materials), 15, y, { maxWidth: pageWidth - 30 });
    y += 20;
    addSectionHeader(" Learning Objectives");
    checkPageSpace(10);
    doc.text(formatText(lessonPlan.objectives), 15, y, { maxWidth: pageWidth - 30 });
    y += 20;

    // 📌 Procedure Table
    addSectionHeader(" Lesson Procedure");
    checkPageSpace(10);
    doc.autoTable({
      startY: y,
      head: [["Step", "Description", "Duration"]],
      body: lessonPlan.procedure.map((step) => [
        formatText(step.step),
        formatText(step.description),
        formatText(step.duration),
      ]),
      theme: "grid",
      styles: { cellPadding: 4, fontSize: 10 },
      headStyles: { fillColor: [50, 50, 150], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 100 }, 2: { cellWidth: 30, halign: "center" } },
      margin: { top: y },
      didDrawPage: (data) => {
        y = data.cursor.y + 15;
        checkPageSpace(10);
      },
    });
    addSectionHeader(" Assessment");
    checkPageSpace(10);
    doc.text(formatText(lessonPlan.assessment), 15, y, { maxWidth: pageWidth - 30 });
    doc.save(`Lesson_Plan_${lessonPlan.topic}.pdf`);
  };
  return (
    <button
      onClick={generatePDF}
      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md mt-4 transition"
    >
      Download PDF
    </button>
  );
};

export default PDFExport;
