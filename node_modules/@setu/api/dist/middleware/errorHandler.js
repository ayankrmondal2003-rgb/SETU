"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const apiError_js_1 = require("../utils/apiError.js");
function errorHandler(err, req, res, next) {
    if (err instanceof apiError_js_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }
    console.error('Unhandled Server Error:', err);
    return res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
}
