const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateInvoicePDF = async (transaction, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      // Company Details
      doc.fontSize(20).text("Tax Invoice", { align: "center" });
      doc.moveDown();
      doc
        .fontSize(10)
        .text("Digital Gold India Private Limited", { align: "center" });
      doc.text(
        "CoWrks, Birla Centurion, Century Mills, Pandurang Budhkar Marg, Worli, Mumbai, 400030",
        { align: "center" }
      );
      doc.moveDown();
      doc.text(
        "PAN No. : AAGCD1057K    GSTIN : 27AAGCD1057K1ZL    CIN No : U74999MH2017PTC293205",
        { align: "center" }
      );
      doc.moveDown();

      // Invoice Details
      const invoiceDate = new Date(transaction.txDate).toLocaleDateString(
        "en-IN"
      );
      doc.text(
        `Date : ${invoiceDate}    Customer ID : USER${transaction.userId}    Order No : SG${transaction.txId}`,
        { align: "left" }
      );
      doc.moveDown();

      // Customer Details
      doc.text("Bill To,", { align: "left" });
      doc.text(`Name : ${user.name || "N/A"}`, { align: "left" });
      doc.text(`Phone Number : ${user.phone}`, { align: "left" });
      doc.text(`Email Id : ${user.email || "N/A"}`, { align: "left" });
      doc.moveDown();

      // Table Header
      const tableTop = doc.y;
      doc.text("Description", 50, tableTop);
      doc.text("Grams*", 250, tableTop);
      doc.text("Rate per Gram", 350, tableTop);
      doc.text("Total Amount", 450, tableTop);
      doc.moveDown();

      // Table Content
      doc.text("24K Gold HSN Code : 71081300", 50, doc.y);
      doc.text(transaction.goldAmount, 250, doc.y);
      doc.text(`₹ ${transaction.rate}`, 350, doc.y);
      doc.text(`₹ ${transaction.buyPrice}`, 450, doc.y);
      doc.moveDown();

      // Tax Details
      doc.text(
        `Applied Tax (1.5% CGST + 1.5% SGST)    ₹ ${transaction.gstAmount}`,
        { align: "right" }
      );
      doc.moveDown();
      doc.text(`Total Invoice Value    ₹ ${transaction.buyPrice}`, {
        align: "right",
      });
      doc.moveDown(2);

      // Declaration
      doc
        .fontSize(8)
        .text(
          "Declaration : We declare that the above quantity of goods are kept by the seller in a safe vault on behalf of the buyer. It can be delivered in minted product as per the Terms & Conditions.",
          { align: "left" }
        );
      doc.moveDown();
      doc.text(
        "*Disclaimer : The gold grams you own are calculated by dividing the amount paid net of GST by the gold rate and rounded down to 4 decimal places. For example, .00054 grams will be rounded down to .0005 grams.",
        { align: "left" }
      );
      doc.moveDown();
      doc.text("(E & O.E.) (Subject to Realization)", { align: "left" });
      doc.moveDown(2);
      doc.text("For Digital Gold India Private Limited", { align: "right" });
      doc.text("(Authorized Signatory)", { align: "right" });

      // Finalize PDF
      doc.end();

      // Create a buffer to store the PDF
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF,
};
