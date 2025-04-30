import jsPDF from "jspdf";

export function exportChatLog(log, filename = "chat_log.pdf") {
  const pdf = new jsPDF();
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const maxWidth = pageWidth * 0.6;
  const lineHeight = 8;
  let y = margin;

  pdf.setFont("Helvetica");

  y += lineHeight + 0.5;
  pdf.setFontSize(20);
  pdf.text("Chat Log", margin, y);
  y += lineHeight + 4;

  pdf.setFontSize(11);
  const entries = log.split("\n").filter((line) => line.trim() !== "");

  entries.forEach((entry) => {
    const isUser = entry.startsWith("User:");
    const sender = isUser ? "Usuario" : "Entrevistado";
    const message = entry.replace(/^User: |^Bot: /, "");

    const lines = pdf.splitTextToSize(message, maxWidth);
    const boxHeight = lines.length * lineHeight + 4;
    const boxWidth =
      Math.max(...lines.map((line) => pdf.getTextWidth(line))) + 6;

    const senderHeight = 5;
    const totalHeight = senderHeight + boxHeight;

    if (y + totalHeight + margin > pageHeight) {
      pdf.addPage();
      y = margin;
    }

    const x = isUser ? pageWidth - boxWidth - margin : margin;
    const fillColor = isUser ? [200, 230, 255] : [230, 230, 230];

    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(sender, x, y);

    pdf.setFillColor(...fillColor);
    pdf.roundedRect(x, y + 2, boxWidth, boxHeight, 3, 3, "F");

    pdf.setTextColor(0);
    pdf.setFontSize(11);
    let textY = y + lineHeight + 2;
    lines.forEach((line) => {
      pdf.text(line, x + 3, textY);
      textY += lineHeight;
    });

    y += totalHeight + 4;
  });

  pdf.save("chat_log.pdf");
}
