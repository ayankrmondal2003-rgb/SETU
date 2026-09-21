"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const adminController_js_1 = require("../controllers/adminController.js");
const router = (0, express_1.Router)();
// Protect all admin routes
router.use(auth_js_1.requireAuth, (0, auth_js_1.requireRole)('ADMIN'));
router.get('/stats', adminController_js_1.getAdminStats);
router.get('/vendors', adminController_js_1.getAllVendors);
router.patch('/vendors/:id/status', adminController_js_1.updateVendorStatus);
router.get('/users', adminController_js_1.getAllUsers);
router.get('/orders', adminController_js_1.getAllOrders);
exports.default = router;
