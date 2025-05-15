import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JUSPAY_API_KEY = process.env.JUSPAY_API_KEY;
const JUSPAY_MERCHANT_ID = process.env.JUSPAY_MERCHANT_ID;
const JUSPAY_API_BASE_URL = 'https://api.juspay.in';

// Validate required environment variables
if (!JUSPAY_API_KEY) {
    console.error('JUSPAY_API_KEY is missing in environment variables');
    throw new Error('JUSPAY_API_KEY is required in environment variables');
}
if (!JUSPAY_MERCHANT_ID) {
    console.error('JUSPAY_MERCHANT_ID is missing in environment variables');
    throw new Error('JUSPAY_MERCHANT_ID is required in environment variables');
}

export const generateSignature = (params) => {
    if (!JUSPAY_API_KEY) {
        throw new Error('JUSPAY_API_KEY is not configured');
    }

    const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

    const signatureString = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    return crypto
        .createHmac('sha256', JUSPAY_API_KEY)
        .update(signatureString)
        .digest('hex');
};

export const juspayConfig = {
    apiKey: JUSPAY_API_KEY,
    merchantId: JUSPAY_MERCHANT_ID,
    baseUrl: JUSPAY_API_BASE_URL,
    headers: {
        'Authorization': JUSPAY_API_KEY,
        'Content-Type': 'application/json',
        'x-merchant-id': JUSPAY_MERCHANT_ID,
        'x-api-version': '2018-10-01'
    }
}; 