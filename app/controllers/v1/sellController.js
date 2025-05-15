import safeGoldApi from "../../configs/safegoldApiConfig";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getGoldSellPrice(req, res) {
  try {
    const price = await safeGoldApi.sellPrice();

    return res.status(200).json({
      success: true,
      message: "Gold price fetched successfully",
      data: price,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function sellGoldVerify(req, res) {
  try {
    const { phone } = req.user;
    const { priceType, value } = req.body;
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
    const sell_price = 0;
    const GST_PERCENT = 0.03;
    const price = await safeGoldApi.sellPrice();
    const commissiom = 0.02;
    const rateWithGST = +(
      price.current_price *
      (1 + GST_PERCENT + commissiom)
    ).toFixed(2);
    let gold_amount = 0;
    if (priceType === "amount") {
      // Scenario 1: Customer enters amount in Rupees
      gold_amount = Math.floor((value / rateWithGST) * 10000) / 10000;
      sell_price = value;
    }

    if (priceType === "grams") {
      // Scenario 2: Customer enters weight in grams
      sell_price = parseFloat((inputValue * rateWithGST).toFixed(2));
      gold_amount = value;
    }

    const sell = await safeGoldApi.verifySellGold({
      rate_id: price?.rate_id,
      gold_amount,
      sell_price,
      userId: user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Gold sell verified successfully",
      data: sell,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function sellGoldConfirm(req, res) {
  try {
    const { phone } = req.user;
    const { tx_id } = req.body;
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

    const confirm = await safeGoldApi.sellConfirm({
      tx_id,
      userId: user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Gold sell confirmed successfully",
      data: confirm,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function sellGoldStatus(req, res) {
  try {
    const { phone } = req.user;
    const { tx_id } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const status = await safeGoldApi.sellStatus({
      tx_id,
    });

    return res.status(200).json({
      success: true,
      message: "Gold sell status fetched successfully",
      data: status,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}
