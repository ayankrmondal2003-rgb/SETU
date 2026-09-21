"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityHubController_js_1 = require("../controllers/cityHubController.js");
const router = (0, express_1.Router)();
router.get('/city-hubs', cityHubController_js_1.getCityHubs);
router.get('/city-hubs/:slug', cityHubController_js_1.getCityHubBySlug);
exports.default = router;
