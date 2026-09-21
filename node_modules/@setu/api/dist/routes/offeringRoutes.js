"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offeringController_js_1 = require("../controllers/offeringController.js");
const router = (0, express_1.Router)();
router.get('/', offeringController_js_1.getPublicOfferings);
router.get('/:slug', offeringController_js_1.getPublicOfferingBySlug);
exports.default = router;
