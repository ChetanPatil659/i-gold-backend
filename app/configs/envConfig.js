import {config} from "dotenv";
config();


export const port = process.env.PORT || 3001;

export const cros_origin = process.env.CORS_ORIGIN || '*';

export const database_url = process.env.DATABASE_URL || '';

export const jwt_secret = process.env.JWT_SECRET || '';