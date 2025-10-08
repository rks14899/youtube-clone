import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  // ✅ Check both header and cookie
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token;

  // Prefer Authorization header, fallback to cookie
  const token = authHeader?.split(" ")[1] || cookieToken;

  if (!token) {
    return next(createError(401, "No token provided, please login again!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(createError(401, "Token expired, please login again!"));
      }
      return next(createError(403, "Invalid token, please login again!"));
    }

    req.user = user; // ✅ Now req.user.id will exist
    next();
  });
};
