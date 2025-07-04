// import express from "express";
// import {
//   createPaymentOrder,
//   createRazorpayOrder,
//   juspaySessionApi,
//   verifyRazorpayPayment,
// } from "../../controllers/paymentController.js";

// const router = express.Router();

// // Create a new payment order

// // Razorpay routes
// router.post("/orders", createRazorpayOrder);
// router.post("/verify", verifyRazorpayPayment);

// router.post("/juspay", juspaySessionApi);

// export default router;

import express from "express";
import {
  createPaymentOrder,
  createRazorpayOrder,
  juspaySessionApi,
  verifyRazorpayPayment,
} from "../../controllers/paymentController.js";

const router = express.Router();

// Create a new payment order

// Razorpay routes
router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);

router.post("/juspay", juspaySessionApi);

export default router;
