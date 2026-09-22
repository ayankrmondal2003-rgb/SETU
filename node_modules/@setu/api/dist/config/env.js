"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from root directory if available
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../../.env') });
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./dev.db';
}
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
    JWT_SECRET: process.env.JWT_SECRET || 'setu_bihar_tourism_jwt_super_secret_key_2026',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_setu_bihar_demo_key',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_demo_key_12345',
    RAZORPAY_SETU_PLUS_PLAN_ID: process.env.RAZORPAY_SETU_PLUS_PLAN_ID || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || ''
};
