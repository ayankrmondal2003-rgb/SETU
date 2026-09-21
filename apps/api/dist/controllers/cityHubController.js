"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCityHubs = getCityHubs;
exports.getCityHubBySlug = getCityHubBySlug;
const client_1 = require("@prisma/client");
const apiError_js_1 = require("../utils/apiError.js");
const prisma = new client_1.PrismaClient();
function parseJsonField(val, fallback = []) {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        }
        catch {
            return fallback;
        }
    }
    return val || fallback;
}
async function getCityHubs(req, res, next) {
    try {
        const hubs = await prisma.cityHub.findMany();
        const formatted = hubs.map(h => ({
            ...h,
            touristPlaces: parseJsonField(h.touristPlaces, [])
        }));
        return res.json({ success: true, count: formatted.length, data: formatted });
    }
    catch (error) {
        next(error);
    }
}
async function getCityHubBySlug(req, res, next) {
    try {
        const { slug } = req.params;
        const hub = await prisma.cityHub.findUnique({
            where: { slug }
        });
        if (!hub) {
            throw new apiError_js_1.ApiError(404, 'City hub not found');
        }
        const formatted = {
            ...hub,
            touristPlaces: parseJsonField(hub.touristPlaces, [])
        };
        return res.json({ success: true, data: formatted });
    }
    catch (error) {
        next(error);
    }
}
