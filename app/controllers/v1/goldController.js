import { PrismaClient } from "@prisma/client";
import safeGoldApi from "../../configs/safegoldApiConfig.js";

const prisma = new PrismaClient();

export async function fetchBalance(req, res) {
  try {
    const { phone } = req.user;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });
    const balance = await safeGoldApi.fetchBalance(user.userId);
    console.log("balance", balance);

    if (!balance || !balance.id) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User balance fetched successfully",
      data: balance,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function transactionHistory(req, res) {
  try {
    console.log("transaction");

    const { phone } = req.user;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });
    const history = await safeGoldApi.transactions(user.userId);

    console.log("history", history);

    return res.status(200).json({
      success: true,
      message: "User transaction history fetched successfully",
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function invoicePdf(req, res) {
  try {
    const { txId } = req.params;

    // Fetch transaction details
    const transaction = await prisma.transaction.findUnique({
      where: { txId: parseInt(txId) },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Fetch user details
    const user = await prisma.user.findFirst({
      where: { userId: transaction.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(transaction, user);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${txId}.pdf`
    );

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    res.status(500).json({ error: "Failed to generate invoice PDF" });
  }
}
