import { createOrder, getOrderStatus, initiatePayment, verifyPayment } from '../services/juspayService.js';

export const createPaymentOrder = async (req, res) => {
    try {
        const {
            amount,
            currency = 'INR',
            customerId,
            customerEmail,
            customerPhone
        } = req.body;

        // Generate a unique order ID
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const orderData = {
            amount,
            currency,
            orderId,
            customerId,
            customerEmail,
            customerPhone
        };

        const order = await createOrder(orderData);
        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderStatus = await getOrderStatus(orderId);
        res.status(200).json({
            success: true,
            data: orderStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
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
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const paymentCallback = async (req, res) => {
    try {
        const { order_id, payment_id } = req.query;
        const paymentStatus = await verifyPayment(order_id, payment_id);

        // Handle the payment status
        if (paymentStatus.status === 'SUCCESS') {
            // Update your database with successful payment
            // Send confirmation email, etc.
        }

        res.status(200).json({
            success: true,
            data: paymentStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 