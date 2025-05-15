import express from 'express';
import {
    createPaymentOrder,
    getPaymentStatus,
    startPayment,
    paymentCallback
} from '../../controllers/paymentController.js';

const router = express.Router();

// Create a new payment order
router.post('/orders', createPaymentOrder);

// Get payment status
router.get('/orders/:orderId/status', getPaymentStatus);

// Start payment process
router.post('/orders/:orderId/payment', startPayment);

// Payment callback URL
router.get('/payment/callback', paymentCallback);

export default router; 