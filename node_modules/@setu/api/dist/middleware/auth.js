"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
exports.requireApprovedVendor = requireApprovedVendor;
const jwt_js_1 = require("../utils/jwt.js");
const apiError_js_1 = require("../utils/apiError.js");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function requireAuth(req, res, next) {
    try {
        let token = req.cookies?.setu_token;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            throw new apiError_js_1.ApiError(401, 'Authentication required');
        }
        const decoded = (0, jwt_js_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(new apiError_js_1.ApiError(401, 'Invalid or expired authentication token'));
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new apiError_js_1.ApiError(401, 'Authentication required'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new apiError_js_1.ApiError(403, `Forbidden: Requires ${roles.join(' or ')} access`));
        }
        next();
    };
}
async function requireApprovedVendor(req, res, next) {
    try {
        if (!req.user || req.user.role !== 'VENDOR') {
            return next(new apiError_js_1.ApiError(403, 'Access denied: Vendor account required'));
        }
        const vendor = await prisma.vendor.findUnique({
            where: { userId: req.user.userId }
        });
        if (!vendor) {
            return next(new apiError_js_1.ApiError(404, 'Vendor profile not found'));
        }
        if (vendor.status !== 'APPROVED') {
            return next(new apiError_js_1.ApiError(403, `Vendor account status is ${vendor.status}. Only APPROVED vendors can perform this action.`));
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
