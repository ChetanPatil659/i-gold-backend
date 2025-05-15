import axios from 'axios';
import { juspayConfig, generateSignature } from '../configs/juspayConfig.js';

export const createOrder = async (orderData) => {
    try {
        if (!process.env.JUSPAY_API_KEY || !process.env.JUSPAY_MERCHANT_ID) {
            throw new Error('Juspay configuration is missing. Please check your environment variables.');
        }

        const { amount, currency, orderId, customerId, customerEmail, customerPhone } = orderData;
        
        if (!amount || !orderId || !customerId) {
            throw new Error('Missing required fields: amount, orderId, and customerId are required');
        }

        const params = {
            amount: amount.toString(),
            currency: currency || 'INR',
            order_id: orderId,
            customer_id: customerId,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            return_url: `${process.env.BASE_URL}/payment/callback`,
            timestamp: Date.now().toString()
        };

        params.signature = generateSignature(params);

        console.log('Creating order with params:', {
            ...params,
            signature: '***' // Hide signature in logs
        });

        const response = await axios.post(
            `${juspayConfig.baseUrl}/orders`,
            params,
            { 
                headers: juspayConfig.headers,
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            }
        );

        if (response.status !== 200) {
            console.error('Juspay API Error Response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            throw new Error(`Juspay API Error: ${response.data.message || 'Unknown error'}`);
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Juspay API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(`Juspay API Error: ${error.response.data.message || error.message}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from Juspay API:', error.request);
            throw new Error('No response received from Juspay API');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error creating order:', error);
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }
};

export const getOrderStatus = async (orderId) => {
    try {
        if (!orderId) {
            throw new Error('Order ID is required');
        }

        const response = await axios.get(
            `${juspayConfig.baseUrl}/orders/${orderId}`,
            { 
                headers: juspayConfig.headers,
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        );

        if (response.status !== 200) {
            console.error('Juspay API Error Response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            throw new Error(`Juspay API Error: ${response.data.message || 'Unknown error'}`);
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Juspay API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(`Juspay API Error: ${error.response.data.message || error.message}`);
        } else if (error.request) {
            console.error('No response received from Juspay API:', error.request);
            throw new Error('No response received from Juspay API');
        } else {
            console.error('Error getting order status:', error);
            throw new Error(`Failed to get order status: ${error.message}`);
        }
    }
};

export const initiatePayment = async (orderId, paymentMethod) => {
    try {
        if (!orderId || !paymentMethod) {
            throw new Error('Order ID and payment method are required');
        }

        const params = {
            order_id: orderId,
            payment_method_type: paymentMethod,
            timestamp: Date.now().toString()
        };

        params.signature = generateSignature(params);

        console.log('Initiating payment with params:', {
            ...params,
            signature: '***' // Hide signature in logs
        });

        const response = await axios.post(
            `${juspayConfig.baseUrl}/orders/${orderId}/payment`,
            params,
            { 
                headers: juspayConfig.headers,
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        );

        if (response.status !== 200) {
            console.error('Juspay API Error Response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            throw new Error(`Juspay API Error: ${response.data.message || 'Unknown error'}`);
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Juspay API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(`Juspay API Error: ${error.response.data.message || error.message}`);
        } else if (error.request) {
            console.error('No response received from Juspay API:', error.request);
            throw new Error('No response received from Juspay API');
        } else {
            console.error('Error initiating payment:', error);
            throw new Error(`Failed to initiate payment: ${error.message}`);
        }
    }
};

export const verifyPayment = async (orderId, paymentId) => {
    try {
        if (!orderId || !paymentId) {
            throw new Error('Order ID and payment ID are required');
        }

        const response = await axios.get(
            `${juspayConfig.baseUrl}/orders/${orderId}/payments/${paymentId}`,
            { 
                headers: juspayConfig.headers,
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        );

        if (response.status !== 200) {
            console.error('Juspay API Error Response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            throw new Error(`Juspay API Error: ${response.data.message || 'Unknown error'}`);
        }

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Juspay API Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            throw new Error(`Juspay API Error: ${error.response.data.message || error.message}`);
        } else if (error.request) {
            console.error('No response received from Juspay API:', error.request);
            throw new Error('No response received from Juspay API');
        } else {
            console.error('Error verifying payment:', error);
            throw new Error(`Failed to verify payment: ${error.message}`);
        }
    }
}; 