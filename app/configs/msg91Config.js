import axios from "axios";

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;

const msg91Client = axios.create({
  baseURL: "https://api.msg91.com/api/v5",
  headers: {
    "Content-Type": "application/json",
    authkey: MSG91_AUTH_KEY,
  },
});

export const sendOTP = async (phone, otp) => {
  try {
    const response = await msg91Client.post("/otp", {
      template_id: MSG91_TEMPLATE_ID,
      mobile: phone,
      otp: otp,
      sender: MSG91_SENDER_ID,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyOTP = async (phone, otp) => {
  try {
    const response = await msg91Client.post("/otp/verify", {
      mobile: phone,
      otp: otp,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
    throw error;
  }
};
