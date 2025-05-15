import safeGoldApi from "../../configs/safegoldApiConfig";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function pincodeValidate(req, res) {
  try {
    const { pincode } = req.body;
    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    const validate = await safeGoldApi.validatePincode(pincode);

    return res.status(200).json({
      success: true,
      message: "Pincode validated successfully",
      data: validate,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function redeemGold(req, res) {
  try {
    const { phone } = req.user;
    const { addressId } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address id is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    const redeem = await safeGoldApi.redeemGold({
      userId: user.userId,
      address: {
        pincode: address.zip,
        city: address.city,
        state: address.state,
        address: address.street,
      },
      product_code: 32,
    });

    return res.status(200).json({
      success: true,
      message: "Pincode validated successfully",
      data: redeem,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function redeemGoldConfirm(req, res) {
  try {
    const { phone } = req.user;
    const { addressId } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address id is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    const redeem = await safeGoldApi.redeemGold({
      userId: user.userId,
      address: {
        pincode: address.zip,
        city: address.city,
        state: address.state,
        address: address.street,
      },
      product_code: 32,
    });

    return res.status(200).json({
      success: true,
      message: "Pincode validated successfully",
      data: redeem,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
}
