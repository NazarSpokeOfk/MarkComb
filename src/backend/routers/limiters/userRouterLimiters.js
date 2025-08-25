import rateLimit from "../../node_modules/express-rate-limit/dist/index.cjs";

export const logInLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: "You have exceeded the request limit. Try again later",
    });
  },
  skip: (req, res) => {
    const allowedIPs = ["181.177.126.105", " 5.101.13.116"];
    return allowedIPs.includes(req.ip);
  },
});

export const registerLimiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: "You have exceeded the request limit. Try again later",
    });
  },
  skip: (req, res) => {
    const allowedIPs = ["181.177.126.105", " 5.101.13.116"];
    return allowedIPs.includes(req.ip);
  },
});

export const updateLimiter = rateLimit({
  windowMs: 1440 * 60 * 1000,
  max: 2,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: "You have exceeded the request limit. Try again later",
    });
  },
  skip: (req, res) => {
    const allowedIPs = ["181.177.126.105", "5.101.13.116"];
    return allowedIPs.includes(req.ip);
  },
});
