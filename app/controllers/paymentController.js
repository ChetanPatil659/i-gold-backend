// Basic payment controller structure
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      customerId,
      customerEmail,
      customerPhone,
    } = req.body;

    const apiKey = "3D453A5641140B2A01CAC12B95B252";
    const merchantId = "MMON3LrvDCy7S0";
    const clientId = "MMON3LrvDCy7S0";
    const authorization =
      "Basic " + Buffer.from(apiKey + ":").toString("base64");

    var requestPayload = JSON.stringify({
      order_id: "testing-order-one",
      amount: "1.0",
      customer_id: "testing-customer-one",
      customer_email: "test@mail.com",
      customer_phone: "9876543210",
      payment_page_client_id: clientId,
      action: "paymentPage",
      return_url: "https://shop.merchant.com",
      description: "Complete your payment",
      theme: "dark",
      first_name: "John",
      last_name: "wick",
    });

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: authorization,
        "x-merchantid": merchantId,
        "Content-Type": "application/json",
      },
      body: requestPayload,
    };

    const resp = fetch("https://sandbox.juspay.in/session", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    console.log(res);

    res.status(200).json({
      success: true,
      data: res,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderStatus = await getOrderStatus(orderId);
    res.status(200).json({
      success: true,
      data: orderStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const startPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentMethod } = req.body;

    const payment = await initiatePayment(orderId, paymentMethod);

    res.status(200).json({
      success: true,
      data: payment,
      client_secret:
        "pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const paymentCallback = async (req, res) => {
  try {
    const { order_id, payment_id } = req.query;
    const paymentStatus = await verifyPayment(order_id, payment_id);

    // Handle the payment status
    if (paymentStatus.status === "SUCCESS") {
      // Update your database with successful payment
      // Send confirmation email, etc.
    }

    res.status(200).json({
      success: true,
      data: paymentStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const juspaySessionApi = async (req, res) => {
  try {
    const apiKey = "05AF19DF0E04B939EC04ABCC176290";
    const merchantId = "MMON3LrvDCy7S0";
    const clientId = "MMON3LrvDCy7S0";
    const authorization =
      "Basic " + Buffer.from(apiKey + ":").toString("base64");

    var requestPayload = JSON.stringify({
      order_id: "testing-order-one",
      amount: "1.0",
      customer_id: "testing-customer-one",
      customer_email: "patilchetan659@gmail.com",
      customer_phone: "7648954968",
      payment_page_client_id: clientId,
      action: "paymentPage",
      return_url: "https://shop.merchant.com",
      description: "Complete your payment",
      theme: "dark",
      first_name: "John",
      last_name: "wick",
    });

    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: authorization,
        "x-merchantid": merchantId,
        "Content-Type": "application/json",
      },
      body: requestPayload,
    };

    fetch("https://sandbox.juspay.in/session", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
