import rateLimit from "express-rate-limit";
import logger from "../utils/logger.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

// In-memory store to track blocked IPs
const blockedIPs = new Map(); 

const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit to 10 requests per 5 minutes
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        blockedIPs.set(req.ip, Date.now() + 60 * 1000); // Block for 1 minute

        res.status(429).json({
            success: false,
            message: "Too many login attempts, please try again later.",
        });
    }
});

// Register Rate Limiter
const registerRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 5 minutes
    max: 3, // Limit to 5 registration attempts per 5 minutes
    handler: (req, res) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        blockedIPs.set(req.ip, Date.now() + 60 * 1000); // Block for 1 minute

        res.status(429).json({
            success: false,
            message: "Too many registration attempts, please try again later.",
        });
    }
});

// Middleware to check if the IP is blocked
const checkIPBlocked = (req, res, next) => {
    const blockedUntil = blockedIPs.get(req.ip);

    if (blockedUntil && Date.now() < blockedUntil) {
        const remainingTime = (blockedUntil - Date.now()) / 1000; // Remaining block time in seconds
        return res.status(429).json({
            success: false,
            message: `Your IP is blocked. Try again after ${Math.ceil(remainingTime)} seconds.`,
        });
    }

    // IP is not blocked, proceed to the next middleware
    next();
};

export { loginRateLimiter, checkIPBlocked, registerRateLimiter };
