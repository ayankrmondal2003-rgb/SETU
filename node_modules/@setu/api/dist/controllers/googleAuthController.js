"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleConfig = googleConfig;
exports.googleLogin = googleLogin;
const google_auth_library_1 = require("google-auth-library");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const env_js_1 = require("../config/env.js");
const apiError_js_1 = require("../utils/apiError.js");
const jwt_js_1 = require("../utils/jwt.js");
const prisma = new client_1.PrismaClient();
const google = new google_auth_library_1.OAuth2Client();
const cookieOptions = { httpOnly: true, secure: env_js_1.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api/auth/google' };
const schema = zod_1.z.object({ credential: zod_1.z.string().min(1).max(10000), role: zod_1.z.enum(['TOURIST', 'VENDOR']) });
// The app's general CORS policy is permissive; enforce a strict origin here.
function checkOrigin(req, required = false) {
    const origin = req.get('origin');
    if ((required || origin) && origin !== new URL(env_js_1.env.FRONTEND_URL).origin) {
        throw new apiError_js_1.ApiError(403, 'Google sign-in origin is not allowed.');
    }
}
function googleConfig(req, res, next) {
    try {
        checkOrigin(req);
        res.setHeader('Cache-Control', 'no-store');
        if (!env_js_1.env.GOOGLE_CLIENT_ID)
            return res.json({ enabled: false });
        const nonce = (0, crypto_1.randomBytes)(32).toString('hex');
        res.cookie('setu_google_nonce', nonce, { ...cookieOptions, maxAge: 10 * 60 * 1000 });
        return res.json({ enabled: true, clientId: env_js_1.env.GOOGLE_CLIENT_ID, nonce });
    }
    catch (error) {
        next(error);
    }
}
async function googleLogin(req, res, next) {
    try {
        checkOrigin(req, true);
        if (!env_js_1.env.GOOGLE_CLIENT_ID)
            throw new apiError_js_1.ApiError(503, 'Google sign-in is not configured yet.');
        const { credential, role } = schema.parse(req.body);
        const nonce = req.cookies.setu_google_nonce;
        if (typeof nonce !== 'string' || nonce.length !== 64)
            throw new apiError_js_1.ApiError(401, 'Reload this page and try Google sign-in again.');
        let payload;
        try {
            const ticket = await google.verifyIdToken({ idToken: credential, audience: env_js_1.env.GOOGLE_CLIENT_ID });
            payload = ticket.getPayload();
        }
        catch {
            throw new apiError_js_1.ApiError(401, 'Google could not verify this sign-in. Please try again.');
        }
        const tokenNonce = payload?.nonce;
        if (!payload?.sub || !payload.email || !payload.email_verified ||
            typeof tokenNonce !== 'string' || tokenNonce.length !== nonce.length ||
            !(0, crypto_1.timingSafeEqual)(Buffer.from(tokenNonce), Buffer.from(nonce))) {
            throw new apiError_js_1.ApiError(401, 'Google could not verify this sign-in. Please try again.');
        }
        let user = await prisma.user.findUnique({ where: { googleSubject: payload.sub }, include: { vendor: true } });
        if (!user) {
            const email = payload.email.toLowerCase();
            const existing = await prisma.user.findUnique({ where: { email }, include: { vendor: true } });
            if (existing) {
                // Google is authoritative for Gmail and verified Workspace domains, not all third-party emails.
                const authoritative = email.endsWith('@gmail.com') || Boolean(payload.hd);
                if (!authoritative || (existing.googleSubject && existing.googleSubject !== payload.sub)) {
                    throw new apiError_js_1.ApiError(409, 'Please use your existing email and password for this account.');
                }
                if (!existing.isActive || existing.role === 'ADMIN' || existing.role !== role) {
                    throw new apiError_js_1.ApiError(403, 'This account cannot sign in with the selected Google account type.');
                }
                user = await prisma.user.update({
                    where: { id: existing.id }, data: { googleSubject: payload.sub, emailVerified: true }, include: { vendor: true }
                });
            }
            else {
                const name = payload.name || email.split('@')[0];
                user = await prisma.user.create({
                    data: {
                        name, email, role, googleSubject: payload.sub, emailVerified: true,
                        passwordHash: await bcryptjs_1.default.hash((0, crypto_1.randomBytes)(48).toString('hex'), 10),
                        avatar: payload.picture,
                        ...(role === 'VENDOR' ? { vendor: { create: {
                                    businessName: name + "'s Business", description: 'New vendor awaiting approval.',
                                    businessType: 'Tour Operator', phone: '', email, address: 'Pending Update',
                                    city: '', district: '', status: 'PENDING'
                                } } } : {})
                    }, include: { vendor: true }
                });
            }
        }
        if (!user.isActive || user.role === 'ADMIN' || user.role !== role) {
            throw new apiError_js_1.ApiError(403, 'This account cannot sign in with the selected Google account type.');
        }
        const token = (0, jwt_js_1.signToken)({ userId: user.id, role: user.role, email: user.email });
        res.clearCookie('setu_google_nonce', cookieOptions);
        res.cookie('setu_token', token, { httpOnly: true, secure: env_js_1.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.json({ success: true, user: {
                id: user.id, name: user.name, email: user.email, role: user.role,
                avatar: user.avatar, phone: user.phone, isPremium: user.isPremium,
                vendor: user.vendor ? { id: user.vendor.id, businessName: user.vendor.businessName, businessType: user.vendor.businessType, status: user.vendor.status } : null
            } });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError)
            return next(new apiError_js_1.ApiError(400, 'Invalid Google sign-in request.'));
        next(error);
    }
}
