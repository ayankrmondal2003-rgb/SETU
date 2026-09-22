"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_js_1 = require("./config/env.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const tourismRoutes_js_1 = __importDefault(require("./routes/tourismRoutes.js"));
const vendorRoutes_js_1 = __importDefault(require("./routes/vendorRoutes.js"));
const offeringRoutes_js_1 = __importDefault(require("./routes/offeringRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./routes/orderRoutes.js"));
const paymentRoutes_js_1 = __importDefault(require("./routes/paymentRoutes.js"));
const aiRoutes_js_1 = __importDefault(require("./routes/aiRoutes.js"));
const favoriteRoutes_js_1 = __importDefault(require("./routes/favoriteRoutes.js"));
const adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
const cityHubRoutes_js_1 = __importDefault(require("./routes/cityHubRoutes.js"));
const messageRoutes_js_1 = __importDefault(require("./routes/messageRoutes.js"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: {
        policy: 'same-origin-allow-popups'
    }
}));
app.use((0, cors_1.default)({
    origin: env_js_1.env.FRONTEND_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'SETU Bihar Tourism API', timestamp: new Date() });
});
// API Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api', tourismRoutes_js_1.default); // /api/circuits, /api/destinations, /api/districts, /api/events
app.use('/api', cityHubRoutes_js_1.default); // /api/city-hubs, /api/city-hubs/:slug
app.use('/api/vendors', vendorRoutes_js_1.default);
app.use('/api/offerings', offeringRoutes_js_1.default);
app.use('/api/orders', orderRoutes_js_1.default);
app.use('/api/payments', paymentRoutes_js_1.default);
app.use('/api/ai', aiRoutes_js_1.default);
app.use('/api/favorites', favoriteRoutes_js_1.default);
app.use('/api/admin', adminRoutes_js_1.default);
app.use('/api/conversations', messageRoutes_js_1.default);
app.use('/api', (_req, res) => {
    res.status(404).json({ message: 'API route not found' });
});
if (env_js_1.env.NODE_ENV === 'production') {
    const webDist = node_path_1.default.resolve(__dirname, '../../web/dist');
    app.use(express_1.default.static(webDist));
    app.get('*', (_req, res) => {
        res.sendFile(node_path_1.default.join(webDist, 'index.html'));
    });
}
// Global Error Handler
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
