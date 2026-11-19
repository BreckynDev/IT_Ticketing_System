import rateLimit from "express-rate-limit";

// Strict limit for login attempts: max 10 requests per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

// Moderate limit for public ticket creation: max 20 tickets per 15 minutes per IP
export const createTicketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many tickets submitted from this connection. Please wait a bit and try again.",
  },
});