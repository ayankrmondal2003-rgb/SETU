"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.getMe = getMe;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const apiError_js_1 = require("../utils/apiError.js");
const jwt_js_1 = require("../utils/jwt.js");
const prisma = new client_1.PrismaClient();
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['TOURIST', 'VENDOR']).default('TOURIST'),
    phone: zod_1.z.string().optional(),
    // Vendor specific optional fields
    businessName: zod_1.z.string().optional(),
    businessType: zod_1.z.string().optional()
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
    role: zod_1.z.enum(['TOURIST', 'VENDOR', 'ADMIN']).optional()
});
async function register(req, res, next) {
    try {
        const data = registerSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new apiError_js_1.ApiError(400, 'An account with this email already exists.');
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
                role: data.role,
                phone: data.phone || null
            }
        });
        // If registered as VENDOR, automatically create a Vendor record with PENDING status
        if (data.role === 'VENDOR') {
            await prisma.vendor.create({
                data: {
                    userId: user.id,
                    businessName: data.businessName || `${data.name}'s Tourism Services`,
                    description: 'New vendor awaiting approval.',
                    businessType: data.businessType || 'Tour Operator',
                    phone: data.phone || '+910000000000',
                    email: data.email,
                    address: 'Pending Update',
                    city: 'Patna',
                    district: 'Patna',
                    status: 'PENDING'
                }
            });
        }
        const token = (0, jwt_js_1.signToken)({
            userId: user.id,
            role: user.role,
            email: user.email
        });
        res.cookie('setu_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });
        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phone: user.phone,
                isPremium: user.isPremium
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next(new apiError_js_1.ApiError(400, error.errors.map(e => e.message).join(', ')));
        }
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const data = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { vendor: true }
        });
        if (!user || !user.isActive) {
            throw new apiError_js_1.ApiError(401, 'Invalid email or password');
        }
        const passwordMatch = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!passwordMatch) {
            throw new apiError_js_1.ApiError(401, 'Invalid email or password');
        }
        if (data.role && user.role !== data.role) {
            throw new apiError_js_1.ApiError(403, `Please select ${user.role.toLowerCase()} sign in for this account.`);
        }
        const token = (0, jwt_js_1.signToken)({
            userId: user.id,
            role: user.role,
            email: user.email
        });
        res.cookie('setu_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });
        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phone: user.phone,
                isPremium: user.isPremium,
                vendor: user.vendor ? {
                    id: user.vendor.id,
                    businessName: user.vendor.businessName,
                    businessType: user.vendor.businessType,
                    status: user.vendor.status
                } : null
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return next(new apiError_js_1.ApiError(400, error.errors.map(e => e.message).join(', ')));
        }
        next(error);
    }
}
async function logout(req, res) {
    res.clearCookie('setu_token');
    return res.json({ success: true, message: 'Logged out successfully' });
}
async function getMe(req, res, next) {
    try {
        if (!req.user) {
            throw new apiError_js_1.ApiError(401, 'Not authenticated');
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { vendor: true }
        });
        if (!user) {
            throw new apiError_js_1.ApiError(404, 'User not found');
        }
        return res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                phone: user.phone,
                isPremium: user.isPremium,
                vendor: user.vendor ? {
                    id: user.vendor.id,
                    businessName: user.vendor.businessName,
                    businessType: user.vendor.businessType,
                    status: user.vendor.status
                } : null
            }
        });
    }
    catch (error) {
        next(error);
    }
}
