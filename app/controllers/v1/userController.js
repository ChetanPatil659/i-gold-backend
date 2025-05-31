import { PrismaClient } from "@prisma/client";
import { createJWT } from "../../utils/auth.js";
import safeGoldAPI from "../../configs/safegoldApiConfig.js";
import safeGoldApi from "../../configs/safegoldApiConfig.js";
import { sendOtp, validateOtp } from "../../services/otpService.js";

const prisma = new PrismaClient();

export const user_login_register = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    const otp = await sendOtp(phone);

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        data: existingUser,
        otp,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        phone: phone,
        role: "USER",
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
      otp: otp,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_verify_otp = async (req, res) => {
  try {
    const { phone, otp, deviceId, verificationId } = req.body;

    if (!phone || !otp || !deviceId) {
      return res.status(403).json({
        success: false,
        message: "Phone number, OTP and deviceId are required",
      });
    }

    const otpValidation = await validateOtp(phone, otp, verificationId);

    if (!otpValidation) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        deviceId: deviceId,
      },
    });

    await prisma.loginRecord.create({
      data: {
        user: {
          connect: {
            phone: existingUser.phone,
          },
        },
        // userId: existingUser.id.toString(),
        loginTime: new Date(),
        device: deviceId,
        // userId: existingUser.id,
      },
    });

    const token = await createJWT({ ...existingUser, deviceId: deviceId });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token: token,
      data: existingUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_logout = async (req, res) => {
  try {
    const { phone } = req.user;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        deviceId: "",
      },
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_delete = async (req, res) => {
  try {
    const { phone } = req.user;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        deleted: true,
      },
    });
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const registerSafeGold = async (req, res) => {
  try {
    const { phone } = req.user;
    const { name, pincode } = req.body;

    if (!phone) {
      return res.status(404).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!name || !pincode) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        name: name,
        pincode: parseInt(pincode),
      },
    });

    const register = await safeGoldAPI.register({
      name,
      pin_code: pincode,
      mobile_no: phone,
    });

    console.log(register, "register");

    if (!register || register?.code == 1) {
      return res.status(400).json({
        success: false,
        message: "Failed to register with safegold",
      });
    }

    const userLocal = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        name: name,
        pincode: parseInt(pincode, 10),
        userId: register.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User profile registered with safegold successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_complete_name = async (req, res) => {
  try {
    const { phone } = req.user;
    const { name } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        name: name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_complete_age = async (req, res) => {
  try {
    const { phone } = req.user;
    const { age } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!age) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        age: parseInt(age, 10),
      },
    });

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_complete_gender = async (req, res) => {
  try {
    const { phone } = req.user;
    const { gender } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        gender: gender,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_complete_email = async (req, res) => {
  try {
    const { phone } = req.user;
    const { email } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await prisma.user.update({
      where: {
        phone: phone,
      },
      data: {
        email: email,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_get_profile = async (req, res) => {
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_add_address = async (req, res) => {
  try {
    const { phone } = req.user;
    const { city, state, street, zip, name, phoneNumber } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!city || !state || !street || !zip || !name || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const address = await prisma.address.create({
      data: {
        city: city,
        state: state,
        street: street,
        zip: zip,
        phone: phoneNumber,
        userPhone: phone,
        name: name,
        user: {
          connect: {
            phone: phone,
          },
        },
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        phone: phone,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User address added successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_update_address = async (req, res) => {
  try {
    const { phone } = req.user;
    const { addressId, city, state, street, zip } = req.body;

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

    if (!city || !state || !street || !zip) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await prisma.address.update({
      where: {
        id: addressId,
      },
      data: {
        city: city,
        state: state,
        street: street,
        zip: zip,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User address updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const user_delete_address = async (req, res) => {
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

    const user = await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User address deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Internal Server Error",
    });
  }
};
