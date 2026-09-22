"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_js_1 = require("../controllers/authController.js");
const auth_js_1 = require("../middleware/auth.js");
const googleAuthController_js_1 = require("../controllers/googleAuthController.js");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.Router)();
router.post('/register', authController_js_1.register);
router.post('/login', authController_js_1.login);
router.post('/logout', authController_js_1.logout);
router.get('/me', auth_js_1.requireAuth, authController_js_1.getMe);
router.use('/google', (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false }));
router.get('/google/config', googleAuthController_js_1.googleConfig);
router.post('/google', googleAuthController_js_1.googleLogin);
exports.default = router;
