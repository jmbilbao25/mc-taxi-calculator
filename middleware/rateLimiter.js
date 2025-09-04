const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for specific IPs
    skip: (req) => {
      const allowedIPs = ['110.93.87.45', '127.0.0.1', '::1'];
      return allowedIPs.includes(req.ip);
    },
  });
};

// Different rate limits for different endpoints
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

module.exports = generalLimiter;
