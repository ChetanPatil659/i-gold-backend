import safeGoldApi from "../../configs/safegoldApiConfig.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getGoldBuyPrice(req, res) {
  try {
    const price = await safeGoldApi.buyPrice();

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

export async function buyGoldVerify(req, res) {
  try {
    const { phone } = req.user;
    const { gold_amount, buy_price, rate_id } = req.body;
    console.log(req.body);
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
    // const buy_price = 0;
    // const GST_PERCENT = 0.03;
    // const price = await safeGoldApi.buyPrice();
    // const commissiom = 0.02;
    // const rateWithGST = +(
    //   price.current_price *
    //   (1 + GST_PERCENT + commissiom)
    // ).toFixed(2);
    // let gold_amount = 0;
    // if (priceType === "amount") {
    //   // Scenario 1: Customer enters amount in Rupees
    //   gold_amount = Math.floor((value / rateWithGST) * 10000) / 10000;
    //   buy_price = value;
    // }

    // if (priceType === "grams") {
    //   // Scenario 2: Customer enters weight in grams
    //   buy_price = parseFloat((inputValue * rateWithGST).toFixed(2));
    //   gold_amount = value;
    // }

    const buy = await safeGoldApi.verifyBuyGold({
      rate_id,
      gold_amount,
      buy_price,
      userId: user.userId,
    });

    console.log(buy);

    return res.status(200).json({
      success: true,
      message: "Gold buy verified successfully",
      data: buy,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function buyGoldConfirm(req, res) {
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

    const confirm = await safeGoldApi.buyConfirm({
      pincode: user.pincode,
      tx_id,
      userId: user.userId,
    });

    const balance = await safeGoldApi.fetchBalance(user.userId);

    await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        balance: balance.gold_balance,
        sellableBalance: balance.sellable_balance,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Gold buy confirmed successfully",
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

export async function buyGoldStatus(req, res) {
  try {
    const { phone } = req.user;
    const { tx_id } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const status = await safeGoldApi.buyStatus(tx_id);

    return res.status(200).json({
      success: true,
      message: "Gold buy status fetched successfully",
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

export async function invoice(req, res) {
  try {
    const { phone } = req.user;
    const { tx_id } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const invoice = await safeGoldApi.invoice(tx_id);

    return res.status(200).json({
      success: true,
      message: "Gold buy invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}
